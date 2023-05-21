import { TextInput, TouchableOpacity, View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5 } from '@expo/vector-icons'
import { FlatList } from 'react-native'
import { useState, useEffect } from 'react'
import { useAuthSocket } from '../../utils/websocket'
import { useAuth } from '@clerk/clerk-expo'
import dayjs from 'dayjs'
import { Message } from '@prisma/client'

export const ChatScreenHeader: React.FC<{ partnerId: string }> = ({
  partnerId,
}) => {
  const { data: partner } = trpc.user.getById.useQuery({ userId: partnerId })
  return <Text className="text-xl">{partner?.username}</Text>
}

export function ChatScreen({ route }) {
  const { postId, to } = route.params

  const { userId } = useAuth()

  const socket = useAuthSocket()

  const [writeMessageInput, setWriteMessageInput] = useState('')
  const [messages, setMessages] = useState<Message[]>()

  const { data: chat, isLoading } = trpc.chat.find.useQuery({
    postId,
    partnerId: to,
  })

  useEffect(() => {
    if (!messages && chat) {
      setMessages(chat.conversation?.messages ?? [])
    }
  }, [chat])

  socket.on('message:receive', ({ message }) => {
    setMessages((prevMessages) => [message, ...prevMessages])
  })

  const onSendMessagePress = () => {
    if (!writeMessageInput) {
      return
    }
    const message = {
      from: userId,
      to,
      content: writeMessageInput,
      createdAt: new Date(),
    }
    socket.emit('message:send', { postId, message }, ({ message }) => {
      setMessages((prevMessages) => [message, ...prevMessages])
    })
  }

  if (isLoading) return <Text>loading</Text>
  if (!chat) return <Text>404</Text>

  return (
    <View className="flex h-full flex-col">
      <View className="flex-1">
        <FlatList
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          inverted={true}
          keyExtractor={(message) =>
            message.id || message.createdAt.getUTCMilliseconds().toString()
          }
          data={messages}
          renderItem={({ item: message }) => (
            <View
              className={`flex flex-row p-2 ${
                message.from === userId ? 'justify-start' : 'justify-end'
              }`}
            >
              <View
                className={`flex flex-col gap-1 ${
                  message.from === userId ? 'items-start' : 'items-end'
                }`}
              >
                <Text className="rounded-xl border p-2">{message.content}</Text>
                <Text className="text-xs">
                  {dayjs(message.createdAt).format('HH:mm')}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      <View className="flex flex-row items-center gap-2 border-t p-3">
        <TextInput
          className="flex-1 border"
          placeholder="Write a message"
          value={writeMessageInput}
          onChangeText={setWriteMessageInput}
        />
        <TouchableOpacity onPress={onSendMessagePress}>
          <FontAwesome5 name="paper-plane" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

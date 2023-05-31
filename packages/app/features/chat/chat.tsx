import { TextInput, TouchableOpacity, View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5 } from '@expo/vector-icons'
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native'
import { useState, useEffect } from 'react'
import { useAuthSocket } from '../../utils/websocket'
import { useAuth } from '@clerk/clerk-expo'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'
import { useForm, Controller } from 'react-hook-form'
import { useHeaderHeight } from '@react-navigation/elements'
import { inputVariants } from 'app/components/form'
import { IconButton } from 'app/components/button'
import { LoadingSpinner } from 'app/components/spinner'

type Chat = inferProcedureOutput<AppRouter['chat']['list']>[number]
type Message = Chat['conversation']['messages'][number]

export const ChatScreenHeader: React.FC<{ chatId: string }> = ({ chatId }) => {
  const { data: chat } = trpc.chat.getById.useQuery({ chatId })
  return <Text className="text-xl">{chat?.partner?.username}</Text>
}

export function ChatScreen({ route }) {
  const headerHeight = useHeaderHeight()

  const { chatId } = route.params

  const { userId } = useAuth()

  const socket = useAuthSocket()

  const { watch, control, handleSubmit } = useForm()

  const watchNewMessage = watch('newMessage')

  const [messages, setMessages] = useState<Message[]>()

  const queryClient = useQueryClient()

  const { data: chat, isLoading } = trpc.chat.getById.useQuery({
    chatId,
  })

  useEffect(() => {
    if (!messages && chat) {
      setMessages(chat.conversation?.messages ?? [])
    }
  }, [chat])

  const context = trpc.useContext()

  const updateListChatsCache = (updatedChat: Chat) => {
    context.chat.list.setData(undefined, (oldChats) => {
      if (oldChats === undefined) {
        return
      }

      const chatExistsInCache = oldChats.some(
        (oldChat) => oldChat.conversation.id === chat?.conversation.id
      )

      if (chatExistsInCache) {
        return oldChats.map((oldChat) =>
          oldChat.conversation.id === chat!.conversation.id
            ? updatedChat
            : oldChat
        )
      }

      return [updatedChat, ...oldChats]
    })
  }

  const updateGetChatCache = (updatedChat: Chat) => {
    context.chat.getById.setData({ chatId }, (oldChat) => updatedChat)
  }

  const addMessageToCachedChats = (message: Message) => {
    const chatWithNewMessage = {
      ...chat!,
      conversation: {
        ...chat!.conversation,
        messages: [message, ...chat!.conversation.messages],
      },
    }

    updateListChatsCache(chatWithNewMessage)
    updateGetChatCache(chatWithNewMessage)
  }

  const onReceiveMessage = (message: Message) => {
    setMessages((prevMessages) => [message, ...prevMessages!])
    addMessageToCachedChats(message)
  }

  useEffect(() => {
    socket.on('message:receive', ({ message }) => {
      onReceiveMessage(message)
    })

    return () => {
      socket.off('message:receive')
    }
  }, [])

  const onSendMessage = ({ newMessage }) => {
    const message = {
      from: userId,
      to: chat?.partner?.id,
      content: newMessage,
      createdAt: new Date(),
      conversationId: chat?.conversation?.id,
    }
    socket.emit('message:send', { message }, ({ message }) => {
      setMessages((prevMessages) => [message, ...prevMessages!])
      addMessageToCachedChats(message)
    })
  }

  if (isLoading) {
    return (
      <View className="flex h-full items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }
  if (!chat) return <Text>404</Text>

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        <View className="flex h-full flex-col">
          <View className="flex-1 border-b border-gray-300 bg-stone-200">
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'flex-end',
              }}
              inverted={true}
              keyExtractor={(message) =>
                message.id || message.createdAt.getUTCMilliseconds().toString()
              }
              data={messages}
              renderItem={({ item: message }) => (
                <View
                  className={`flex flex-row p-2 px-4 ${
                    message.from === userId ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <View
                    className={`flex flex-col gap-1 rounded-xl bg-white p-2 ${
                      message.from === userId ? 'items-start' : 'items-end'
                    }`}
                  >
                    <Text className="flex-1">{message.content}</Text>
                    <Text className="text-xs">
                      {dayjs(message.createdAt).format('HH:mm')}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
          <View className="flex flex-row items-end gap-4 p-4">
            <View className="flex-1">
              <Controller
                name="newMessage"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, ref, onChange, onBlur } }) => (
                  <TextInput
                    ref={ref}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Write a message"
                    maxLength={2 ** 16 - 1}
                    multiline={true}
                    className={inputVariants['default']}
                  />
                )}
              />
            </View>
            <IconButton
              size={17}
              variant={watchNewMessage ? 'primary' : 'secondary'}
              onPress={handleSubmit(onSendMessage)}
              icon={<FontAwesome5 name="paper-plane" />}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

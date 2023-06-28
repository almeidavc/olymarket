import { TextInput, View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { trpc } from 'app/utils/trpc'
import { PaperAirplaneIcon } from 'react-native-heroicons/outline'
import { ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { useRef, useState, useEffect } from 'react'
import { useAuthSocket } from '../../utils/websocket'
import { useAuth } from '@clerk/clerk-expo'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'
import { useHeaderHeight } from '@react-navigation/elements'
import { IconButton } from 'app/components/button'
import { SafeAreaView } from 'react-native'
import { ChatMessages, MessageBasic } from './messages'
import { FlatList } from 'react-native'

type Chat = inferProcedureOutput<AppRouter['chat']['list']>[number]
export type Message = Chat['conversation']['messages'][number]

export function ChatScreen({ route }) {
  const headerHeight = useHeaderHeight()

  const messagesContainer = useRef<FlatList>(null)

  const { chatId } = route.params

  const { userId } = useAuth()

  const socket = useAuthSocket()

  const [input, setInput] = useState<string>('')
  const [pendingMessages, setPendingMessages] = useState<MessageBasic[]>([])

  const { data: chat, isLoading } = trpc.chat.getById.useQuery({
    chatId,
  })

  const messages = chat?.conversation?.messages

  const context = trpc.useContext()

  const updateListChatsCache = (chat: Chat) => {
    context.chat.list.setData(undefined, (oldChats) => {
      if (oldChats === undefined) {
        return
      }

      const chatExistsInCache = oldChats.some(
        (oldChat) => oldChat.conversation.id === chat?.conversation.id
      )

      if (chatExistsInCache) {
        return oldChats.map((oldChat) =>
          oldChat.conversation.id === chat!.conversation.id ? chat : oldChat
        )
      }

      return [chat, ...oldChats]
    })
  }

  const updateGetChatCache = (chat: Chat) => {
    context.chat.getById.setData({ chatId }, () => chat)
  }

  const addMessageToCachedChats = (message: Message) => {
    const outdatedChat = context.chat.getById.getData({ chatId })

    const updatedChat = {
      ...outdatedChat!,
      conversation: {
        ...outdatedChat!.conversation,
        messages: [message, ...outdatedChat!.conversation.messages],
      },
    }

    updateListChatsCache(updatedChat)
    updateGetChatCache(updatedChat)
  }

  useEffect(() => {
    socket.on('message:receive', ({ message }) => {
      addMessageToCachedChats(message)
    })

    return () => {
      socket.off('message:receive')
    }
  }, [])

  const sendMessage = (content: string) => {
    const message = {
      from: userId,
      to: chat!.partner!.id,
      content: input,
      createdAt: new Date(),
      conversationId: chat!.conversation.id,
    }

    socket.emit('message:send', { message }, ({ message }) => {
      addMessageToCachedChats(message)
      setPendingMessages((prevMessages) =>
        prevMessages.slice(0, prevMessages.length - 1)
      )
    })

    setInput('')
    setPendingMessages((prevMessages) => [message, ...prevMessages!])
    messagesContainer?.current?.scrollToOffset({ offset: 0 })
  }

  const onSendMessagePress = () => {
    if (input) {
      sendMessage(input)
    }
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
    <SafeAreaView className="-mb-2 bg-white">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        <View className="flex h-full flex-col">
          <ChatMessages
            ref={messagesContainer}
            messages={[...pendingMessages, ...(messages ?? [])]}
          />
          <View className="flex flex-row items-end border-t-[0.5px] border-gray-300 px-4 py-2">
            <View className="mr-2 flex-1">
              <TextInput
                value={input}
                onChangeText={setInput}
                maxLength={2 ** 16 - 1}
                multiline={true}
                enablesReturnKeyAutomatically={true}
                className="bg-background rounded-lg px-4 py-2.5 text-lg leading-[20px] text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Send a message..."
              />
            </View>
            <IconButton
              size={21}
              disabled={!input}
              variant={input ? 'primary' : 'disabled'}
              onPress={onSendMessagePress}
              textClassName="p-2"
              icon={<PaperAirplaneIcon />}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

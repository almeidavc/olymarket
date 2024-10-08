import { TextInput, View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { trpc } from 'app/utils/trpc'
import { PaperAirplaneIcon } from 'react-native-heroicons/outline'
import { ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { useRef, useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'
import { useHeaderHeight } from '@react-navigation/elements'
import { IconButton } from 'app/components/button'
import { SafeAreaView } from 'react-native'
import { ChatMessages, MessageBasic } from './messages'
import { FlatList } from 'react-native'
import { supabase } from '../../utils/supabase'

type Chat = inferProcedureOutput<AppRouter['chat']['list']>[number]
export type Message = Chat['conversation']['messages'][number]

export function ChatScreen({ route }) {
  const headerHeight = useHeaderHeight()

  const messagesContainer = useRef<FlatList>(null)

  const { chatId } = route.params

  const { userId } = useAuth()

  const [input, setInput] = useState<string>('')

  const { data: chat, isLoading } = trpc.chat.getById.useQuery({
    chatId,
  })
  const messages = chat?.conversation?.messages

  const context = trpc.useContext()

  const { mutate: sendMessageMutation } = trpc.chat.sendMessage.useMutation()

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

  const updateListChatsCache = (chat: Chat) => {
    context.chat.list.setData(undefined, (oldChats) => {
      if (oldChats === undefined) {
        return
      }
      const chatExistsInCache = oldChats.some(
        (oldChat) => oldChat.conversation.id === chat?.conversation.id,
      )
      if (chatExistsInCache) {
        return oldChats.map((oldChat) =>
          oldChat.conversation.id === chat!.conversation.id ? chat : oldChat,
        )
      }
      return [chat, ...oldChats]
    })
  }

  const updateGetChatCache = (chat: Chat) => {
    context.chat.getById.setData({ chatId }, () => chat)
  }

  useEffect(() => {
    const channel = supabase.channel(chatId)
    channel.on('broadcast', { event: 'message' }, ({ payload }) => {
      addMessageToCachedChats(payload.message)
    })
    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendMessage = async (content: string) => {
    const message = {
      from: userId,
      to: chat!.partner!.id,
      content: content,
      createdAt: new Date(),
      conversationId: chat!.conversation.id,
    }

    sendMessageMutation(message)

    setInput('')
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
          <ChatMessages ref={messagesContainer} messages={messages ?? []} />
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

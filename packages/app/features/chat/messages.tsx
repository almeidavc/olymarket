import { View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { FlatList } from 'react-native'
import { useAuth } from '@clerk/clerk-expo'
import dayjs from 'dayjs'
import React from 'react'
import { Message } from '@prisma/client'

export type MessageBasic = Pick<
  Message,
  'from' | 'to' | 'content' | 'createdAt'
>

interface ChatMessagesProps {
  messages: MessageBasic[]
}

export const ChatMessages = React.forwardRef<FlatList, ChatMessagesProps>(
  function ({ messages }, ref) {
    const { userId } = useAuth()

    return (
      <View className="flex-1 bg-stone-200">
        <FlatList
          ref={ref}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
          inverted={true}
          keyExtractor={(message) => message.createdAt}
          data={messages}
          renderItem={({ item: message }) => {
            const mainAxisAlignment =
              userId === message.from ? 'justify-end' : 'justify-start'
            const crossAxisAlignment =
              userId === message.from ? 'items-end' : 'items-start'

            const backgroundColor =
              userId === message.from ? 'bg-sky-700' : 'bg-white'
            const textColor = userId === message.from ? 'text-white' : ''

            return (
              <View className={`m-2 mx-4 flex flex-row ${mainAxisAlignment}`}>
                <View
                  className={`flex max-w-[80%] flex-col rounded-xl p-2 ${backgroundColor} ${crossAxisAlignment}`}
                >
                  <Text className={`flex-1 text-base ${textColor}`}>
                    {message.content}
                  </Text>
                  <Text className={`text-xs ${textColor}`}>
                    {dayjs(message.createdAt).format('HH:mm')}
                  </Text>
                </View>
              </View>
            )
          }}
        />
      </View>
    )
  }
)
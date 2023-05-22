import { View, TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'
import { trpc } from 'app/utils/trpc'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { Image } from 'app/design/image'
import { useRouter } from 'solito/router'
import { useAuth } from '@clerk/clerk-expo'
import { AppRouter } from 'server/api/routers'
import { inferProcedureOutput } from '@trpc/server'

type Chat = inferProcedureOutput<AppRouter['chat']['list']>[number]

export function ChatInboxScreen() {
  const router = useRouter()

  const { userId } = useAuth()

  const { data: chats } = trpc.chat.list.useQuery()

  return (
    <FlatList
      data={chats}
      renderItem={({ item: chat }: ListRenderItemInfo<Chat>) => {
        return (
          <TouchableOpacity
            onPress={() => router.push(`/chats/${chat.conversation.id}`)}
          >
            <View className="flex flex-row items-center gap-3 border-b p-4">
              <Image
                className="h-12 w-12 rounded-full "
                source={{ uri: chat.partner?.profileImageUrl }}
              />
              <View className="flex flex-col">
                <Text>{chat.partner?.username}</Text>
                <Text className="text-base font-semibold">
                  {chat?.conversation?.post?.title}
                </Text>
                <Text className="text-xs">
                  {chat?.conversation?.messages?.[0]?.content}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )
}

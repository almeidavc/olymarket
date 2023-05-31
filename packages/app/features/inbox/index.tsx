import { View, TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'
import { trpc } from 'app/utils/trpc'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { Image } from 'app/design/image'
import { useRouter } from 'solito/router'
import { AppRouter } from 'server/api/routers'
import { inferProcedureOutput } from '@trpc/server'
import { RefreshControl } from 'react-native'
import dayjs from 'app/utils/dayjs'
import { Tag } from 'app/components/tag'
import { PostStatus } from 'app/utils/enums'

type Chat = inferProcedureOutput<AppRouter['chat']['list']>[number]

export function InboxScreen() {
  const router = useRouter()

  const {
    data: chats,
    refetch,
    isRefetching,
  } = trpc.chat.list.useQuery(undefined, {
    refetchOnMount: false,
  })

  return (
    <FlatList
      data={chats}
      keyExtractor={(chat) => chat.conversation.id}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      renderItem={({ item: chat }: ListRenderItemInfo<Chat>) => {
        return (
          <TouchableOpacity
            onPress={() => router.push(`/chat/${chat.conversation.id}`)}
          >
            <View className="flex h-24 flex-row items-center border-b border-gray-300 p-4">
              <Image
                className="mr-4 h-12 w-12 rounded-full"
                source={{ uri: chat.partner?.profileImageUrl }}
              />
              <View className="flex h-full flex-1 flex-col justify-start">
                <View className="mb-0.5 flex flex-row justify-between">
                  <Text>{chat.partner?.username}</Text>
                  <Text className="text-gray-600">
                    {dayjs().to(
                      dayjs(chat.conversation.messages[0]?.createdAt)
                    )}
                  </Text>
                </View>
                <View className="mb-0.5 flex flex-row items-center justify-between">
                  <Text className="w-9/12 text-lg" numberOfLines={1}>
                    {chat?.post?.title}
                  </Text>
                  {chat.post.status === PostStatus.REMOVED && (
                    <View>
                      <Tag label="Deleted" color="red" />
                    </View>
                  )}
                </View>
                <Text className="text-sm text-gray-600" numberOfLines={1}>
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

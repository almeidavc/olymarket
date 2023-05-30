import { View, TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'
import { trpc } from 'app/utils/trpc'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { Image } from 'app/design/image'
import { useRouter } from 'solito/router'
import { AppRouter } from 'server/api/routers'
import { inferProcedureOutput } from '@trpc/server'
import { PostStatusTag } from '../post/post'
import { RefreshControl } from 'react-native'

type Chat = inferProcedureOutput<AppRouter['chat']['list']>[number]

export function ChatInboxScreen() {
  const router = useRouter()

  const { data: chats, refetch, isRefetching } = trpc.chat.list.useQuery()

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
            onPress={() => router.push(`/chats/${chat.conversation.id}`)}
          >
            <View className="flex flex-row items-center gap-3 border-b p-4">
              <Image
                className="h-12 w-12 rounded-full "
                source={{ uri: chat.partner?.profileImageUrl }}
              />
              <View className="flex flex-grow flex-col">
                <Text>{chat.partner?.username}</Text>
                <Text className="text-base font-semibold">
                  {chat?.post?.title}
                </Text>
                <Text className="text-xs">
                  {chat?.conversation?.messages?.[0]?.content}
                </Text>
              </View>
              {(chat?.post?.status === 'REMOVED' ||
                chat?.post?.status === 'SOLD') && (
                <PostStatusTag status={chat?.post?.status} />
              )}
            </View>
          </TouchableOpacity>
        )
      }}
    />
  )
}

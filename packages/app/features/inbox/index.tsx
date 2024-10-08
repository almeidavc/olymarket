import { View, TouchableOpacity } from 'app/design/core'
import { ActivityIndicator, SafeAreaView } from 'react-native'
import { Text, Title, Caption } from 'app/design/typography'
import { trpc } from 'app/utils/trpc'
import { useRouter } from 'solito/router'
import { AppRouter } from 'server/api/routers'
import { inferProcedureOutput } from '@trpc/server'
import { RefreshControl } from 'react-native'
import dayjs from 'app/utils/dayjs'
import { Tag } from 'app/components/tag'
import { PostStatus } from 'app/utils/enums'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'app/design/image'
import { Placeholder } from 'app/components/placeholder'
import { ChatBubbleLeftRightIcon } from 'react-native-heroicons/outline'

type Chat = inferProcedureOutput<AppRouter['chat']['list']>[number]

const ChatCard = ({ chat }: { chat: Chat }) => {
  return (
    <View className="border-b-0.5 flex h-24 flex-row items-center border-[#d8d8d8] p-4">
      <Image
        className="mr-4 h-12 w-12 rounded-full"
        source={{ uri: chat.partner?.profileImageUrl }}
      />
      <View className="flex h-full flex-1 flex-col justify-start">
        <View className="mb-0.5 flex flex-row justify-between">
          <Text>{chat.partner?.username}</Text>
          <Caption className="text-gray-600">
            {dayjs().to(dayjs(chat.conversation.messages[0]?.createdAt))}
          </Caption>
        </View>
        <View className="mb-0.5 flex flex-row items-center justify-between">
          <Title className="w-9/12" numberOfLines={1}>
            {chat?.post?.title}
          </Title>
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
  )
}

export function InboxScreen() {
  const router = useRouter()

  const {
    data: chats,
    isLoading,
    refetch,
    isRefetching,
  } = trpc.chat.list.useQuery(undefined, {
    refetchOnMount: false,
  })

  if (isLoading) {
    return (
      <View className="flex h-full items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!chats?.length) {
    return (
      <SafeAreaView>
        <Placeholder
          title="No chats yet"
          icon={<ChatBubbleLeftRightIcon color="black" />}
          description="You don't currently have any chats. Once you start a conversation, your chat will appear here."
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="bg-white">
      <View className="h-full">
        <FlashList
          data={chats}
          keyExtractor={(chat) => chat.conversation.id}
          renderItem={({ item: chat }) => (
            <TouchableOpacity
              onPress={() => router.push(`/chat/${chat.conversation.id}`)}
            >
              <ChatCard chat={chat} />
            </TouchableOpacity>
          )}
          estimatedItemSize={96}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        />
      </View>
    </SafeAreaView>
  )
}

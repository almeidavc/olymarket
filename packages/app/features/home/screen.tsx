import { H1, Text, } from 'app/design/typography'
import { View } from 'app/design/view'
import { Image } from 'app/design/image'
import { trpc } from 'app/utils/trpc'

export function PostCard() {
  const data = trpc.post.list.useQuery()

  console.log(data.data)

  return (
    <View className="flex h-[30vh] flex-col justify-between rounded-lg border-2 border-lime-800 p-4">
      <Image
        className="h-2/3 w-full bg-black"
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/SMPTE_Color_Bars.svg/200px-SMPTE_Color_Bars.svg.png',
        }}
        resizeMode="contain"
      />
      <View>
        <Text className="text-lg font-semibold text-lime-900">
          {/* {post.title} */}
        </Text>
        <Text className="text-lime-900">
          {/* {post.price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'EUR',
          })} */}
        </Text>
      </View>
    </View>
  )
}

export function HomeScreen() {
  return (
    <View className="p-3">
      <H1>Olymarket</H1>
      <PostCard />
    </View>
  )
}

import { View, Button } from 'app/design/core'
import { Text, H1 } from 'app/design/typography'
import { ScrollView } from 'react-native'
import { Image } from 'app/design/image'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5 } from '@expo/vector-icons'
import { ZoneTitles } from 'app/utils/enums'

export function PostScreen({ route }) {
  const { postId } = route.params

  const { data: post } = trpc.post.getById.useQuery(postId)

  if (!post) {
    return <Text>404</Text>
  }

  return (
    <ScrollView>
      <ScrollView horizontal={true}>
        {post.images.map((img) => (
          <Image
            className="aspect-square w-screen"
            key={img.id}
            source={{ uri: img.url }}
          />
        ))}
      </ScrollView>
      <View className="p-4">
        <H1 className="mb-0 text-3xl font-bold">{post.title}</H1>
        <Text className="text-lg font-extrabold text-blue-900">
          {new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }).format(post.price)}
        </Text>
        {post.zone !== 'NONE' && (
          <Text>
            <FontAwesome5 name="map-marker-alt" /> {ZoneTitles.get(post.zone)}
          </Text>
        )}
        <Text className="mt-4">Description</Text>
        <Text className="text-lg">{post.description}</Text>
        <Button className="mt-4" title="Contact seller" />
      </View>
    </ScrollView>
  )
}
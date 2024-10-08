import { View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'
import { Link } from 'solito/link'
import { TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { formatPrice } from './utils'
import { Animated, Easing } from 'react-native'
import { useRef, useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { Post } from 'app/utils/types'

export const SkeletonPostCard = () => {
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  return (
    <View className="flex flex-col rounded-t-md">
      <Animated.View
        className="bg-background h-[30vh] w-full rounded-md"
        style={{ opacity }}
      />
      <View>
        <Animated.View
          className="bg-background mt-2 h-[22px] w-5/6"
          style={{ opacity }}
        />
        <Animated.View
          className="bg-background mt-1 h-[22px] w-14"
          style={{ opacity }}
        />
      </View>
    </View>
  )
}

interface PostCardProps {
  post: Post
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigation = useNavigation()

  const [isLoadingImage, setIsLoadingImage] = useState(true)

  useEffect(() => {
    Image.prefetch(post.images[0].url).then(() => {
      setIsLoadingImage(false)
    })
  }, [])

  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('post', { postId: post.id })}
    >
      <View className="flex flex-col rounded-t-md">
        <Image
          className={'h-[30vh] w-full rounded-md'}
          style={{ display: isLoadingImage ? 'none' : 'flex' }}
          contentFit="cover"
          source={post.images![0]?.url}
        />
        <Animated.View
          className="bg-background h-[30vh] w-full rounded-md"
          style={{ display: isLoadingImage ? 'flex' : 'none' }}
        />
        <View>
          <Text className="mt-2" numberOfLines={1}>
            {post.title}
          </Text>
          <Text className="mt-1">{formatPrice(post.price)}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

interface HorizontalPostCardProps extends PostCardProps {
  href: string
  height: number
}

export const HorizontalPostCard: React.FC<HorizontalPostCardProps> = ({
  post,
  href,
  height,
}) => {
  return (
    <Link href={href}>
      <View className="flex flex-row border-b border-gray-300">
        <Image
          style={{ height, width: height }}
          className="mr-2 bg-gray-300"
          source={{
            uri: post.images![0]?.url,
          }}
        />
        <View className="flex flex-col items-start">
          <Text className="text-lg tracking-tight text-gray-600">
            {post.title}
          </Text>
          <Text className="font-bold text-sky-900">
            {formatPrice(post.price)}
          </Text>
        </View>
      </View>
    </Link>
  )
}

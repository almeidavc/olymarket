import { View } from 'app/design/core'
import React, { useState } from 'react'
import { TouchableOpacity } from 'app/design/core'
import Constants from 'expo-constants'
import {
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { PaginatedCarousel } from './carousel'
import { Image } from 'app/design/image'
import { Post } from 'app/utils/types'

interface ImageSliderProps {
  post: Post
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ post }) => {
  const { width } = useWindowDimensions()

  const images = post?.images

  const [showImageFullscreen, setShowImageFullScreen] = useState<string>()

  return (
    <>
      <Modal visible={!!showImageFullscreen}>
        <View className="relative bg-black">
          <PaginatedCarousel
            data={images}
            itemWidth={width}
            sliderWidth={width}
            renderItem={({ item: image }) => (
              <Image
                className="h-full w-full bg-black"
                contentFit="contain"
                source={image.url}
              />
            )}
          />
          <TouchableOpacity
            style={{ marginTop: Constants.statusBarHeight }}
            className="absolute right-0 top-0 p-6"
            onPress={() => setShowImageFullScreen(undefined)}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
      <PaginatedCarousel
        data={images}
        itemWidth={width}
        sliderWidth={width}
        renderItem={({ item: image }) => (
          <TouchableWithoutFeedback
            onPress={() => setShowImageFullScreen(image.url)}
          >
            <Image className="h-[55vh]" source={image.url} />
          </TouchableWithoutFeedback>
        )}
      />
    </>
  )
}

import { View } from 'app/design/core'
import React, { useState } from 'react'
import { Image } from 'app/design/image'
import { TouchableOpacity } from 'app/design/core'
import Constants from 'expo-constants'
import {
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { PaginatedCarousel } from './carousel'

interface ImageSliderProps {
  imageUris: string[]
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ imageUris }) => {
  const { width } = useWindowDimensions()

  const [showImageFullscreen, setShowImageFullScreen] = useState<string>()

  return (
    <>
      <Modal visible={!!showImageFullscreen}>
        <View className="relative bg-black">
          <PaginatedCarousel
            data={imageUris}
            itemWidth={width}
            sliderWidth={width}
            renderItem={({ item: imageUri, index }) => (
              <Image
                className="h-full w-full bg-black"
                resizeMode="contain"
                source={{ uri: imageUri }}
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
        data={imageUris}
        itemWidth={width}
        sliderWidth={width}
        renderItem={({ item: imageUri }) => (
          <TouchableWithoutFeedback
            onPress={() => setShowImageFullScreen(imageUri)}
          >
            <Image className="h-[55vh]" source={{ uri: imageUri }} />
          </TouchableWithoutFeedback>
        )}
      />
    </>
  )
}

import { View, TouchableOpacity } from 'app/design/core'
import { Image } from 'app/design/image'
import { AntDesign } from '@expo/vector-icons'
import { Text } from 'app/design/typography'
import * as ImagePicker from 'expo-image-picker'
import { PhotoIcon } from 'react-native-heroicons/outline'
import { IconButton } from 'app/components/button'
import { ScrollView } from 'react-native'
import { ExclamationCircleIcon } from 'react-native-heroicons/outline'

export interface Image {
  url: string
  // undefined if image has not yet been uploaded
  key?: string
}

interface ImageSelectProps {
  images: Image[]
  setImages: (images: Image[]) => void
  selectionLimit: number
  showHelperText: boolean
}

export const ImageSelect: React.FC<ImageSelectProps> = ({
  images,
  setImages,
  selectionLimit,
  showHelperText,
}) => {
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: selectionLimit - images.length,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      // allowsEditing: true,
      // aspect: [4, 3],
    })

    if (!result.canceled && result.assets.length) {
      const newImages = result.assets.map((asset) => ({ url: asset.uri }))
      setImages([...images, ...newImages])
    }
  }

  const deselectImage = (img: Image) => {
    setImages(images.filter((i) => img.url !== i.url))
  }

  // const setAsMainImage = (imageUri: string, imageIndex: number) => {
  //   const swappedImageUris = [...imageUris]
  //   swappedImageUris[imageIndex] = swappedImageUris[0]!
  //   swappedImageUris[0] = imageUri
  //   setImageUris(swappedImageUris)
  // }

  return (
    <View
      className={`${showHelperText ? 'bg-red-50' : 'bg-background'} h-[260px]`}
    >
      {images.length ? (
        <View className="space-between flex h-full flex-col">
          <Text className="mt-4 w-full text-center text-xs font-semibold text-gray-500">
            Add up to {selectionLimit} images.
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {images.map((img, index) => (
              <View
                key={img.url}
                className={`relative my-6 ml-4 ${
                  index === selectionLimit - 1 ? 'mr-4' : ''
                }`}
              >
                <Image
                  className="h-[180px] w-[180px] rounded-lg"
                  source={{ uri: img.url }}
                />
                <View className="absolute right-0 top-0 -mr-[10px] -mt-[10px]">
                  <IconButton
                    size={16}
                    textClassName="p-1.5"
                    icon={<AntDesign name="close" />}
                    onPress={() => deselectImage(img)}
                  />
                </View>
              </View>
            ))}
            {images.length < selectionLimit && (
              <View className="relative m-4 my-6 flex h-[180px] w-[180px] items-center justify-center">
                <IconButton
                  shape="square"
                  variant="secondary"
                  icon={<AntDesign name="plus" />}
                  onPress={pickImages}
                />
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <TouchableOpacity
          className="relative flex h-full items-center justify-center"
          onPress={pickImages}
        >
          {showHelperText ? (
            <ExclamationCircleIcon size={60} color={'#dc2626'} />
          ) : (
            <PhotoIcon size={60} color={'#6b7280'} />
          )}
          <Text
            className={`mt-2 text-sm font-semibold ${
              showHelperText ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            Add images
          </Text>
          {showHelperText && (
            <Text className="absolute bottom-0 mb-2 text-center text-sm text-red-600">
              Please upload at least one image.
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}

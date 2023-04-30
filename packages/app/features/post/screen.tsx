import { View, Button, TouchableOpacity, TextInput } from 'app/design/core'
import { Text } from 'app/design/typography'
import * as ImagePicker from 'expo-image-picker'
import { ScrollView } from 'react-native'
import { useState } from 'react'
import { Image } from 'app/design/image'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5 } from '@expo/vector-icons'
import { getImageDownloadUrl, uploadImages } from './upload-image'

const UploadImageButton: React.FC<{
  compact?: boolean
  uploadImages: () => void
}> = ({ compact = false, uploadImages }) => {
  return (
    <TouchableOpacity
      onPress={uploadImages}
      style={{
        padding: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 8,
      }}
    >
      {compact && <FontAwesome5 name="plus" />}
      {!compact && (
        <Text>
          <FontAwesome5 name="plus" /> Upload images
        </Text>
      )}
    </TouchableOpacity>
  )
}

export function CreatePostScreen() {
  const [imagesUris, setImagesUris] = useState<string[] | undefined>()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState<number | undefined>()

  const { data: imageUploadUrl } = trpc.post.getImageUploadUrl.useQuery()
  const { mutate: createPostMutation } = trpc.post.create.useMutation()

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      // allowsEditing: true,
      // aspect: [4, 3],
    })

    if (!result.canceled && result.assets.length) {
      setImagesUris(result.assets.map((asset) => asset.uri))
    }
  }

  const createPost = async () => {
    if (!title || !price || !imagesUris) {
      throw new Error('The post you are trying to create is not valid')
    }
    await uploadImages(imagesUris[0], imageUploadUrl?.imageUploadUrl)
    createPostMutation({
      title,
      price,
      imageUrl: getImageDownloadUrl(imageUploadUrl?.imageKey),
    })
  }

  return (
    <View>
      <View className="bg-neutral-300 p-4">
        {imagesUris && imagesUris.length ? (
          <ScrollView horizontal={true}>
            {imagesUris.map((imageUri) => (
              <Image
                className="m-2 h-[20vh] w-[20vh]"
                key={imageUri}
                source={{ uri: imageUri }}
              />
            ))}
            <View className="m-2 flex h-[20vh] w-[20vh] items-center justify-center">
              <UploadImageButton compact={true} uploadImages={pickImage} />
            </View>
          </ScrollView>
        ) : (
          <View className="flex h-[20vh] items-center justify-center">
            <UploadImageButton compact={false} uploadImages={pickImage} />
          </View>
        )}
      </View>
      <View className="p-4">
        <Text>Title</Text>
        <TextInput
          placeholder="example title"
          className="text-xl"
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View className="p-4">
        <Text>Price</Text>
        <TextInput
          inputMode="numeric"
          placeholder="0€"
          className="text-xl"
          value={price ? `${price}` : ''}
          onChangeText={(input) => {
            setPrice(Number.parseInt(input))
          }}
        />
      </View>
      <Button
        className={!title || !price || !imagesUris ? 'opacity-10' : ''}
        disabled={!title || !price || !imagesUris}
        title="Create post"
        onPress={createPost}
      />
    </View>
  )
}

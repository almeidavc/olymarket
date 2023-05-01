import { View, Button, TouchableOpacity, TextInput } from 'app/design/core'
import { Text } from 'app/design/typography'
import * as ImagePicker from 'expo-image-picker'
import { ScrollView } from 'react-native'
import { useState } from 'react'
import { Image } from 'app/design/image'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5 } from '@expo/vector-icons'
import { getImageDownloadUrl, uploadImages } from './upload-image'
import { Picker } from '@react-native-picker/picker'

enum Zone {
  BUNGALOWS = 'BUNGALOWS',
  TOWER_A = 'TOWER_A',
  TOWER_B = 'TOWER_B',
}

const ZoneTitles = new Map<Zone, string>([
  [Zone.BUNGALOWS, 'Bungalows'],
  [Zone.TOWER_A, 'Tower A'],
  [Zone.TOWER_B, 'Tower B'],
])

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
  const [imageUris, setImageUris] = useState<string[] | undefined>()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | undefined>()
  const [zone, setZone] = useState<Zone | undefined>()

  const { mutate: createPostMutation } = trpc.post.create.useMutation()
  const { refetch: refetchImageUploadUrls } =
    trpc.post.getImageUploadUrls.useQuery(imageUris?.length ?? 0, {
      refetchOnMount: false,
      enabled: false,
      onSuccess: async (imageUploadUrls) => {
        try {
          await uploadImages(
            imageUris,
            imageUploadUrls.map((img) => img.url)
          )
        } catch {
          throw new Error('Something went wrong while uploading the images')
        }
        createPostMutation({
          title,
          zone,
          description,
          price: price!,
          images: imageUploadUrls.map((img) => getImageDownloadUrl(img.key)),
        })
      },
    })

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      // allowsEditing: true,
      // aspect: [4, 3],
    })

    if (!result.canceled && result.assets.length) {
      setImageUris(result.assets.map((asset) => asset.uri))
    }
  }

  const createPost = async () => {
    if (!title || !price || !imageUris || !imageUris.length) {
      throw new Error('The post you are trying to create is not valid')
    }
    refetchImageUploadUrls()
  }

  return (
    <View>
      <View className="bg-neutral-300 p-4">
        {imageUris && imageUris.length ? (
          <ScrollView horizontal={true}>
            {imageUris.map((imageUri) => (
              <Image
                className="m-2 h-[20vh] w-[20vh]"
                key={imageUri}
                source={{ uri: imageUri }}
              />
            ))}
            <View className="m-2 flex h-[20vh] w-[20vh] items-center justify-center">
              <UploadImageButton compact={true} uploadImages={pickImages} />
            </View>
          </ScrollView>
        ) : (
          <View className="m-2 flex h-[20vh] items-center justify-center">
            <UploadImageButton compact={false} uploadImages={pickImages} />
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
        <Text>Description</Text>
        <TextInput
          multiline
          placeholder="example description"
          className="text-xl"
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View className="p-4">
        <Text>Zone</Text>
        <View className="-m-4">
          <Picker selectedValue={zone} onValueChange={(zone) => setZone(zone)}>
            {Object.values(Zone).map((zone) => (
              <Picker.Item
                key={zone}
                label={ZoneTitles.get(zone)}
                value={zone}
              />
            ))}
          </Picker>
        </View>
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
        className={!title || !price || !imageUris ? 'opacity-10' : ''}
        disabled={!title || !price || !imageUris}
        title="Create post"
        onPress={createPost}
      />
    </View>
  )
}

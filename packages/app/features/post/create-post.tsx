import { View, TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'
import * as ImagePicker from 'expo-image-picker'
import { ScrollView } from 'react-native'
import { useState } from 'react'
import { Image } from 'app/design/image'
import { trpc } from 'app/utils/trpc'
import { uploadImages } from './upload-image'
import { Zone, ZoneTitles } from 'app/utils/enums'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useForm } from 'react-hook-form'
import { FormInput } from 'app/components/form'
import ContextMenu from 'react-native-context-menu-view'
import { Button, IconButton } from 'app/design/button'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'

interface ImageSelectProps {
  imageUris: string[]
  setImageUris: (uris: string[]) => void
  selectionLimit: number
}

const ImageSelect: React.FC<ImageSelectProps> = ({
  imageUris,
  setImageUris,
  selectionLimit,
}) => {
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      selectionLimit: selectionLimit - imageUris.length,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      // allowsEditing: true,
      // aspect: [4, 3],
    })

    if (!result.canceled && result.assets.length) {
      const newImageUris = result.assets.map((asset) => asset.uri)
      setImageUris([...imageUris, ...newImageUris])
    }
  }

  const deselectImage = (imageUri) => {
    setImageUris(imageUris.filter((imgUri) => imgUri !== imageUri))
  }

  const setAsMainImage = (imageUri: string, imageIndex: number) => {
    const swappedImageUris = [...imageUris]
    swappedImageUris[imageIndex] = swappedImageUris[0]!
    swappedImageUris[0] = imageUri
    setImageUris(swappedImageUris)
  }

  return (
    <View className="h-[260px] bg-gray-200">
      {imageUris.length ? (
        <View className="space-between flex h-full flex-col">
          <Text className="mt-4 w-full text-center text-xs font-semibold text-gray-500">
            Add up to {selectionLimit} images.
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {imageUris.map((imageUri, index) => (
              <View
                className={`relative my-6 ml-4 ${
                  index === selectionLimit - 1 ? 'mr-4' : ''
                }`}
              >
                <ContextMenu
                  actions={[
                    {
                      title: 'Set as main photo',
                    },
                  ]}
                  onPress={() => setAsMainImage(imageUri, index)}
                >
                  <Image
                    className="h-[180px] w-[180px] rounded-lg"
                    key={imageUri}
                    source={{ uri: imageUri }}
                  />
                </ContextMenu>
                <View className="absolute right-0 top-0 -mr-[10px] -mt-[10px]">
                  <IconButton
                    size="small"
                    icon={<AntDesign name="close" />}
                    onPress={() => deselectImage(imageUri)}
                  />
                </View>
              </View>
            ))}
            {imageUris.length < selectionLimit && (
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
          className="flex h-full items-center justify-center"
          onPress={pickImages}
        >
          <MaterialCommunityIcons name="image-plus" size={60} color="#6b7280" />
          <Text className="mt-2 text-sm font-semibold text-gray-500">
            Add images
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export function CreatePostScreen() {
  const { control, handleSubmit, formState, setFocus } = useForm()

  const [imageUris, setImageUris] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | undefined>()
  const [zone, setZone] = useState<Zone | undefined>()

  const context = trpc.useContext()

  const { mutate: createPostMutation } = trpc.post.create.useMutation({
    onSuccess: (createdPost) => {
      context.post.list.invalidate()
      context.post.listMine.setData(undefined, (oldPosts) => {
        if (oldPosts) {
          return [createdPost, ...oldPosts]
        }
      })
    },
  })

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
          images: imageUploadUrls.map((img) => img.key),
        })
      },
    })

  const createPost = async () => {
    if (!title || !price || !imageUris || !imageUris.length) {
      throw new Error('The post you are trying to create is not valid')
    }
    refetchImageUploadUrls()
  }

  const onSubmit = (data) => console.log(data)

  return (
    <KeyboardAwareScrollView>
      <ImageSelect
        imageUris={imageUris}
        setImageUris={setImageUris}
        selectionLimit={10}
      />
      <View className="flex flex-col divide-y divide-gray-300">
        <View className="flex flex-col gap-4 p-4">
          <View>
            <FormInput
              name="title"
              label="Title"
              control={control}
              rules={{
                required: 'A title is required.',
                maxLength: {
                  value: 60,
                  message: 'The maximum length for the title is 60 characters.',
                },
              }}
              textInput={{
                placeholder: 'Title',
                returnKeyType: 'next',
                onSubmitEditing: () => setFocus('description'),
                blurOnSubmit: false,
              }}
            />
          </View>
          <View>
            <FormInput
              name="description"
              label="Description"
              control={control}
              rules={{
                maxLength: {
                  value: 2 ** 16 - 1,
                  message: 'The description is too long.',
                },
              }}
              textInput={{
                placeholder: 'Description',
                multiline: true,
              }}
            />
          </View>
        </View>
        {/* <View className="p-4">
          <ContextMenu
            dropdownMenuMode={true}
            actions={Object.keys(Zone).map((zoneKey) => ({
              title: ZoneTitles.get(zoneKey),
            }))}
            onPress={(event) => {
              const { name } = event.nativeEvent
              setZone(name)
            }}
          >
            <FormInput
              label="Zone"
              value={zone}
              placeholder="Zone"
              editable={false}
            />
          </ContextMenu>
        </View> */}
        <View className="p-4">
          <FormInput
            name="price"
            label="Price"
            control={control}
            rules={{
              required: 'A price is required.',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Price can only consist of digits.',
              },
            }}
            textInput={{
              placeholder: '0',
              inputMode: 'numeric',
              returnKeyType: 'done',
            }}
          />
        </View>
      </View>
      <Button
        className="mx-4 mt-4"
        title="Create post"
        // onPress={createPost}
        onPress={handleSubmit(onSubmit)}
      />
    </KeyboardAwareScrollView>
  )
}

import { View, TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'
import * as ImagePicker from 'expo-image-picker'
import { ScrollView } from 'react-native'
import { useState } from 'react'
import { Image } from 'app/design/image'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5 } from '@expo/vector-icons'
import { uploadImages } from './upload-image'
import { Zone, ZoneTitles } from 'app/utils/enums'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useForm, Controller } from 'react-hook-form'
import { LabeledInput } from 'app/components/input'
import ContextMenu from 'react-native-context-menu-view'
import { Button } from 'app/design/button'

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
  const { control, handleSubmit, formState } = useForm()

  const [imageUris, setImageUris] = useState<string[] | undefined>()
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

  const onSubmit = (data) => console.log(data)

  return (
    <KeyboardAwareScrollView>
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
      <View className="flex flex-col divide-y divide-gray-300">
        <View className="flex flex-col gap-4 p-4">
          <View>
            <Controller
              name="title"
              control={control}
              rules={{
                required: 'A title is required.',
                maxLength: {
                  value: 60,
                  message: 'The maximum length for the title is 60 characters.',
                },
              }}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid, error },
              }) => (
                <LabeledInput
                  label="Title"
                  placeholder="Title"
                  value={value}
                  onChangeValue={onChange}
                  onBlur={onBlur}
                  invalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
          </View>
          <View>
            <Controller
              name="description"
              control={control}
              rules={{
                maxLength: {
                  value: 2 ** 16 - 1,
                  message: 'The description is too long.',
                },
              }}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { invalid, error },
              }) => (
                <LabeledInput
                  label="Description"
                  placeholder="Description"
                  multiline
                  className="h-28"
                  value={value}
                  onChangeValue={onChange}
                  onBlur={onBlur}
                  invalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
          </View>
        </View>
        <View className="p-4">
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
            <LabeledInput
              label="Zone"
              value={zone}
              placeholder="Zone"
              editable={false}
            />
          </ContextMenu>
        </View>
        <View className="p-4">
          <Controller
            name="price"
            control={control}
            rules={{
              required: 'A price is required.',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Price can only consist of digits.',
              },
            }}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { invalid, error },
            }) => (
              <LabeledInput
                label="Price"
                inputMode="numeric"
                placeholder="0€"
                value={value}
                onChangeValue={onChange}
                onBlur={onBlur}
                invalid={invalid}
                errorMessage={error?.message}
              />
            )}
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

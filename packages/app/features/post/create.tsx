import { useRouter } from 'solito/router'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'
import * as ImagePicker from 'expo-image-picker'
import { Modal, ScrollView } from 'react-native'
import { useState } from 'react'
import { trpc } from 'app/utils/trpc'
import { uploadImages } from './upload-image'
import { Zone, ZoneTitles } from 'app/utils/enums'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useForm } from 'react-hook-form'
import { FormInput } from 'app/components/form'
import ContextMenu from 'react-native-context-menu-view'
import { Button, IconButton } from 'app/components/button'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { RadioButton } from 'app/components/radio'
import { Image } from 'app/design/image'

interface ImageSelectProps {
  imageUris: string[]
  setImageUris: (uris: string[]) => void
  selectionLimit: number
  showHelperText: boolean
}

const ImageSelect: React.FC<ImageSelectProps> = ({
  imageUris,
  setImageUris,
  selectionLimit,
  showHelperText,
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
                key={imageUri}
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
                    source={{ uri: imageUri }}
                  />
                </ContextMenu>
                <View className="absolute right-0 top-0 -mr-[10px] -mt-[10px]">
                  <IconButton
                    size={16}
                    textClassName="p-1.5"
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
          className="relative flex h-full items-center justify-center"
          onPress={pickImages}
        >
          <MaterialCommunityIcons name="image-plus" size={60} color="#6b7280" />
          <Text className="mt-2 text-sm font-semibold text-gray-500">
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

const Stack = createNativeStackNavigator()

export function CreatePostScreen({ navigation, route }) {
  const router = useRouter()

  const { getValues, control, handleSubmit, setFocus, reset } = useForm()

  const { zone } = route.params
  const [imageUris, setImageUris] = useState<string[]>([])

  const [showImagesHelperText, setShowImagesHelperText] = useState(false)
  const [isCreatePostLoading, setIsCreatePostLoading] = useState(false)
  const [showSuccessMessageModal, setShowSuccessMessageModal] = useState(false)

  const context = trpc.useContext()

  const resetForm = () => {
    reset()
    setImageUris([])
    navigation.setParams({ zone: undefined })
    setShowImagesHelperText(false)
  }

  const { mutate: createPostMutation } = trpc.post.create.useMutation({
    onSuccess: (createdPost) => {
      setIsCreatePostLoading(false)

      setShowSuccessMessageModal(true)

      resetForm()

      context.post.list.invalidate()
      context.post.listMine.setData(undefined, (oldPosts) => {
        if (oldPosts) {
          return [createdPost, ...oldPosts]
        }
      })
    },
  })

  const { refetch: fetchImageUploadUrlsAndCreatePost } =
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

        const { title, description, price } = getValues()

        createPostMutation({
          title,
          description,
          zone,
          price: Number.parseInt(price),
          images: imageUploadUrls.map((img) => img.key),
        })
      },
    })

  const onCreatePost = () => {
    if (isCreatePostLoading) {
      return
    }

    setIsCreatePostLoading(true)

    fetchImageUploadUrlsAndCreatePost()
  }

  const onCreatePostPress = () => {
    if (imageUris.length === 0) {
      setShowImagesHelperText(true)
    } else {
      setShowImagesHelperText(false)
      handleSubmit(onCreatePost)()
    }
  }

  return (
    <>
      <Modal visible={showSuccessMessageModal}>
        <View className="mb-32 flex flex-grow items-center justify-center">
          <View className="mx-auto mb-3.5 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 p-2 dark:bg-green-900">
            <AntDesign name="check" size={50} color="#22c55e" />
          </View>
          <Text className="mb-4 text-4xl font-extrabold  text-gray-900">
            Success!
          </Text>
          <Text className="mb-8 text-2xl font-normal text-gray-500">
            Your post has been created.
          </Text>
          <Button
            title="See your posts"
            onPress={() => {
              setShowSuccessMessageModal(false)
              router.push('/profile/selling')
            }}
          />
        </View>
      </Modal>
      <KeyboardAwareScrollView>
        <ImageSelect
          imageUris={imageUris}
          setImageUris={setImageUris}
          selectionLimit={10}
          showHelperText={showImagesHelperText}
        />
        <View className="flex flex-col divide-y divide-gray-300">
          <View className="flex flex-col p-4">
            <View>
              <FormInput
                name="title"
                label="Title"
                control={control}
                rules={{
                  required: 'A title is required.',
                  maxLength: {
                    value: 60,
                    message:
                      'The maximum length for the title is 60 characters.',
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
                  style: { height: 160 },
                }}
              />
            </View>
          </View>
          <View className="p-4">
            <TouchableOpacity
              className="flex h-8 flex-row items-center justify-between"
              onPress={() => navigation.navigate('choose-zone', { zone })}
            >
              <Text className="text-sm font-medium text-gray-900">
                Location
              </Text>
              <View className="flex flex-row items-center">
                {zone && (
                  <Text className="mr-2 text-sm font-medium text-gray-500">
                    {ZoneTitles.get(zone)}
                  </Text>
                )}
                <AntDesign name="right" size={16} color="#6b7280" />
              </View>
            </TouchableOpacity>
          </View>
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
                maxLength: {
                  value: 4,
                  message: 'The maximum price is 9999.',
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
          loading={isCreatePostLoading}
          className="m-4"
          title="Create post"
          onPress={onCreatePostPress}
        />
      </KeyboardAwareScrollView>
    </>
  )
}

const ChooseZoneModal = ({ navigation, route }) => {
  const { zone } = route.params

  return (
    <View className="px-4 py-2">
      {Object.keys(Zone).map((zoneKey) => (
        <View key={zoneKey} className="w-full border-b border-gray-200">
          <RadioButton
            label={ZoneTitles.get(zoneKey as Zone)!}
            isSelected={zone === zoneKey}
            select={() => navigation.navigate('create-post', { zone: zoneKey })}
          />
        </View>
      ))}
    </View>
  )
}

export function Post() {
  return (
    <Stack.Navigator
      initialRouteName="create-post"
      screenOptions={{ headerTintColor: 'black' }}
    >
      <Stack.Screen
        name="create-post"
        component={CreatePostScreen}
        options={{ headerShown: false }}
        initialParams={{ zone: undefined }}
      />
      <Stack.Screen
        name="choose-zone"
        component={ChooseZoneModal}
        options={{ presentation: 'modal', headerTitle: 'Location' }}
      />
    </Stack.Navigator>
  )
}

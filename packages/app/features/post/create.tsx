import { useRouter } from 'solito/router'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'
import * as ImagePicker from 'expo-image-picker'
import { Modal, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { trpc } from 'app/utils/trpc'
import { uploadImages } from './upload-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useForm } from 'react-hook-form'
import { FormInput } from 'app/components/form'
import { AntDesign } from '@expo/vector-icons'
import { Button, IconButton } from 'app/components/button'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { RadioButton } from 'app/components/radio'
import { Image } from 'app/design/image'
import {
  Zone,
  ZoneTitles,
  PostCategory,
  PostCategoryTitles,
} from 'app/utils/enums'
import { PriceInput } from './price-input'

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
    <View
      className={`${showHelperText ? 'bg-red-50' : 'bg-background'} h-[260px]`}
    >
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
                <Image
                  className="h-[180px] w-[180px] rounded-lg"
                  source={{ uri: imageUri }}
                />
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
          {showHelperText ? (
            <AntDesign
              name={'exclamationcircleo'}
              size={60}
              color={'#dc2626'}
            />
          ) : (
            <MaterialCommunityIcons
              name={'image-plus'}
              size={60}
              color={'#6b7280'}
            />
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

const Stack = createNativeStackNavigator()

export function CreatePostScreen({ navigation, route }) {
  const router = useRouter()

  const { getValues, control, handleSubmit, setFocus, reset } = useForm()

  const { category, zone } = route.params

  const [imageUris, setImageUris] = useState<string[]>([])

  const [showImagesHelperText, setShowImagesHelperText] = useState(false)
  const [showCategoryMissingError, setShowCategoryMissingError] =
    useState(false)

  const [isCreatePostLoading, setIsCreatePostLoading] = useState(false)
  const [showSuccessMessageModal, setShowSuccessMessageModal] = useState(false)

  useEffect(() => {
    setShowCategoryMissingError(false)
  }, [category])

  useEffect(() => {
    if (imageUris.length) {
      setShowImagesHelperText(false)
    }
  }, [imageUris])

  const context = trpc.useContext()

  const resetForm = () => {
    reset()
    setImageUris([])
    navigation.setParams({ zone: undefined })
    navigation.setParams({ category: undefined })
  }

  const { mutate: createPostMutation } = trpc.post.create.useMutation({
    onSuccess: (createdPost) => {
      setIsCreatePostLoading(false)

      setShowSuccessMessageModal(true)

      resetForm()

      context.post.search.invalidate()

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
          category,
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
      return
    }

    handleSubmit(onCreatePost)()

    if (!category) {
      setShowCategoryMissingError(true)
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
        <View className="divide-background flex flex-col divide-y">
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
            <View>
              <PriceInput name="price" label="Price" control={control} />
            </View>
          </View>
          <View className="mx-4 py-4">
            <TouchableOpacity
              className="flex h-8 flex-row items-center justify-between"
              onPress={() => navigation.navigate('category', route.params)}
            >
              <Text className="text-sm font-medium text-gray-900">
                Category
              </Text>
              <View className="flex flex-row items-center">
                {showCategoryMissingError && (
                  <Text className="mr-2 text-sm text-red-600">
                    Choose a category
                  </Text>
                )}
                {category && (
                  <Text className="mr-2 text-sm font-medium text-gray-500">
                    {PostCategoryTitles.get(category)}
                  </Text>
                )}
                <AntDesign name="right" size={16} color="#6b7280" />
              </View>
            </TouchableOpacity>
          </View>
          <View className="mx-4 py-4">
            <TouchableOpacity
              className="flex h-8 flex-row items-center justify-between"
              onPress={() => navigation.navigate('zone', route.params)}
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

  const onSelectZone = (zone: string) => {
    navigation.navigate('create-post', {
      ...route.params,
      zone,
    })
  }

  return (
    <View>
      {Object.keys(Zone).map((zoneKey) => (
        <View key={zoneKey} className="w-full border-b border-gray-300 px-4">
          <RadioButton
            label={ZoneTitles.get(zoneKey as Zone)!}
            isSelected={zone === zoneKey}
            select={() => onSelectZone(zoneKey)}
          />
        </View>
      ))}
    </View>
  )
}

const ChooseCategoryModal = ({ navigation, route }) => {
  const { category } = route.params

  const onSelectCategory = (category: string) => {
    navigation.navigate('create-post', {
      ...route.params,
      category,
    })
  }

  return (
    <View>
      {Object.keys(PostCategory).map((categoryKey) => (
        <View
          key={categoryKey}
          className="w-full border-b border-gray-300 px-4"
        >
          <RadioButton
            label={PostCategoryTitles.get(categoryKey as PostCategory)!}
            isSelected={category === categoryKey}
            select={() => onSelectCategory(categoryKey)}
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
      screenOptions={{
        headerTintColor: 'black',
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="create-post"
        component={CreatePostScreen}
        options={{ headerShown: false }}
        initialParams={{ category: undefined, zone: undefined }}
      />
      <Stack.Screen
        name="zone"
        component={ChooseZoneModal}
        options={{ presentation: 'modal', headerTitle: 'Location' }}
      />
      <Stack.Screen
        name="category"
        component={ChooseCategoryModal}
        options={{ presentation: 'modal', headerTitle: 'Category' }}
      />
    </Stack.Navigator>
  )
}

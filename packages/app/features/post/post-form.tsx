import { View, TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FormInput } from 'app/components/form'
import { AntDesign } from '@expo/vector-icons'
import { Button } from 'app/components/button'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from 'server/api/routers'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { RadioButton } from 'app/components/radio'
import { ImageSelect } from './image-select'
import {
  Zone,
  ZoneTitles,
  PostCategory,
  PostCategoryTitles,
} from 'app/utils/enums'
import { Modal, SafeAreaView } from 'react-native'
import { PriceInput } from './price-input'

type Post = inferProcedureOutput<AppRouter['post']['getById']>

interface PostFormProps {
  defaultValues?: Post
  submit: (post: Partial<Post>, images: string[]) => Promise<void>
  submitLabel: string
  isSubmitLoading: boolean
}

export const PostFormScreen = ({
  defaultValues,
  submit,
  submitLabel,
  isSubmitLoading,
}: PostFormProps) => {
  const {
    control,
    formState: { isDirty },
    handleSubmit,
    setFocus,
    reset,
  } = useForm({
    defaultValues: {
      title: defaultValues?.title,
      description: defaultValues?.description,
      price: defaultValues?.price ? `${defaultValues?.price}` : '',
    },
  })

  const [isFormDirty, setIsFormDirty] = useState(false)

  const isAnyFieldDirty = isDirty || isFormDirty

  const [imageUris, setImageUris] = useState<string[]>(
    () => defaultValues?.images?.map((img) => img.url) ?? []
  )
  const [category, setCategory] = useState<PostCategory>(
    defaultValues?.category
  )
  const [zone, setZone] = useState<Zone>(defaultValues?.zone)

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showZoneModal, setShowZoneModal] = useState(false)
  const [showImagesHelperText, setShowImagesHelperText] = useState(false)
  const [showCategoryMissingError, setShowCategoryMissingError] =
    useState(false)

  const resetForm = () => {
    reset()
    setImageUris([])
    setCategory(undefined)
    setZone(undefined)
  }

  const onSubmit = async () => {
    if (imageUris.length === 0) {
      setShowImagesHelperText(true)
      return
    }

    if (!category) {
      setShowCategoryMissingError(true)
      return
    }

    handleSubmit(async ({ title, description, price }) => {
      await submit(
        {
          title,
          description,
          price: Number.parseInt(price),
          category,
          zone,
        },
        imageUris
      )
      resetForm()
    })()
  }

  return (
    <SafeAreaView>
      <Modal
        visible={showCategoryModal}
        presentationStyle="pageSheet"
        animationType="slide"
      >
        <View>
          {Object.keys(PostCategory).map((categoryKey) => (
            <View
              key={categoryKey}
              className="w-full border-b border-gray-300 px-4"
            >
              <RadioButton
                label={PostCategoryTitles.get(categoryKey as PostCategory)!}
                isSelected={category === categoryKey}
                select={() => {
                  setCategory(categoryKey)
                  setShowCategoryModal(false)
                  setIsFormDirty(true)
                }}
              />
            </View>
          ))}
        </View>
      </Modal>
      <Modal
        visible={showZoneModal}
        presentationStyle="pageSheet"
        animationType="slide"
      >
        <View>
          {Object.keys(Zone).map((zoneKey) => (
            <View
              key={zoneKey}
              className="w-full border-b border-gray-300 px-4"
            >
              <RadioButton
                label={ZoneTitles.get(zoneKey as Zone)!}
                isSelected={zone === zoneKey}
                select={() => {
                  setZone(zoneKey)
                  setShowZoneModal(false)
                  setIsFormDirty(true)
                }}
              />
            </View>
          ))}
        </View>
      </Modal>
      <KeyboardAwareScrollView>
        <ImageSelect
          imageUris={imageUris}
          setImageUris={(imageUris) => {
            setImageUris(imageUris)
            setIsFormDirty(true)
          }}
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
              onPress={() => setShowCategoryModal(true)}
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
              // onPress={() => navigation.navigate('zone', route.params)}
              onPress={() => setShowZoneModal(true)}
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
          disabled={!isAnyFieldDirty || isSubmitLoading}
          className="m-4"
          loading={isSubmitLoading}
          variant={isAnyFieldDirty ? 'primary' : 'disabled'}
          title={submitLabel}
          onPress={onSubmit}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

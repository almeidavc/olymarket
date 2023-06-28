import { useAuth, useUser } from '@clerk/clerk-expo'
import { View, TouchableOpacity } from 'app/design/core'
import { SafeAreaView } from 'react-native'
import { Text, Title } from 'app/design/typography'
import { useRouter } from 'solito/router'
import { Button } from 'app/components/button'
import { trpc } from 'app/utils/trpc'
import { CommonActions } from '@react-navigation/native'
import { Image } from 'app/design/image'
import {
  TrashIcon,
  ArrowRightOnRectangleIcon,
  MegaphoneIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/outline'
import { Modal } from 'react-native'
import { useState } from 'react'

export function AccountScreen({ navigation }) {
  const router = useRouter()

  const { signOut } = useAuth()

  const { user } = useUser()

  const isModerator = !!user?.publicMetadata?.isModerator

  const { mutate: deleteUserMutation, isLoading: isDeleteUserLoading } =
    trpc.user.delete.useMutation()

  const context = trpc.useContext()

  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false)

  const resetRootNavigator = () => {
    navigation
      .getParent('root')
      .dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'tabs' }] }))
  }

  const invalidateProtectedQueries = () => {
    context.chat.list.setData(undefined, [])
    context.post.listMine.setData(undefined, [])
  }

  const onSignOut = async () => {
    await signOut()
    resetRootNavigator()
    invalidateProtectedQueries()
  }

  const onDeleteAccountPress = () => {
    setIsDeleteConfirmationModalOpen(true)
  }

  const deleteAccount = () => {
    deleteUserMutation(undefined, { onSuccess: onSignOut })
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <Modal visible={isDeleteConfirmationModalOpen} transparent>
        <View className="flex flex-1 items-center justify-center">
          <View className="absolute inset-0 h-full w-full bg-black opacity-70" />
          <View className="mx-6 rounded-md bg-white p-6">
            <Title className="mb-2 text-center font-bold">
              Are you sure you want to delete your account?
            </Title>
            <Text className="mb-4 text-center text-sm text-gray-600">
              All data associated with your account will be lost. This action
              cannot be undone.
            </Text>
            <Button
              title="Yes, delete my account"
              className="mb-4"
              onPress={() => {
                setIsDeleteConfirmationModalOpen(false)
                deleteAccount()
              }}
            />
            <Button
              title="No"
              variant="secondary"
              onPress={() => setIsDeleteConfirmationModalOpen(false)}
            />
          </View>
        </View>
      </Modal>
      <View className="m-4 h-full">
        <View className="mb-6 flex flex-row items-center">
          <Image
            className="mr-3 h-14 w-14 rounded-full"
            source={{ uri: user?.profileImageUrl }}
          />
          <Title className="font-bold">{user?.username}</Title>
        </View>
        <TouchableOpacity
          className="border-background flex flex-row items-center border-b py-4"
          onPress={onSignOut}
        >
          <ArrowRightOnRectangleIcon color="black" size={30} />
          <Text className="ml-3 grow">Log out</Text>
          <ChevronRightIcon color="black" size={17} />
        </TouchableOpacity>
        <TouchableOpacity
          className="border-background flex flex-row items-center border-b py-4"
          onPress={onDeleteAccountPress}
        >
          <TrashIcon color="black" size={30} />
          <Text className="ml-3 grow">Delete account</Text>
          <ChevronRightIcon color="black" size={17} />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex flex-row items-center py-4"
          onPress={() => router.push('/feedback')}
        >
          <MegaphoneIcon color="black" size={30} />
          <Text className="ml-3 grow">Send us feedback</Text>
          <ChevronRightIcon color="black" size={17} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

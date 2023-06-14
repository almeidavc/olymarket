import { useAuth, useUser } from '@clerk/clerk-expo'
import { TouchableOpacity } from 'app/design/core'
import { SafeAreaView } from 'react-native'
import { Text } from 'app/design/typography'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'solito/router'
import { Button } from 'app/components/button'
import { trpc } from 'app/utils/trpc'
import { CommonActions } from '@react-navigation/native'

export function AccountScreen({ navigation }) {
  const router = useRouter()

  const { signOut } = useAuth()

  const { user } = useUser()

  const isModerator = !!user?.publicMetadata?.isModerator

  const { mutate: deleteUserMutation, isLoading: isDeleteUserLoading } =
    trpc.user.delete.useMutation()

  const context = trpc.useContext()

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
    deleteUserMutation(undefined, { onSuccess: onSignOut })
  }

  return (
    <SafeAreaView>
      {isModerator && (
        <TouchableOpacity
          className="flex h-10 flex-row items-center justify-between px-2"
          onPress={() => router.push('/profile/account/moderate')}
        >
          <Text className="text-sm font-medium text-gray-900">
            Moderator View
          </Text>
          <AntDesign name="right" size={16} color="#6b7280" />
        </TouchableOpacity>
      )}
      <Button title="Log out" onPress={onSignOut} shape="square" />
      <Button
        loading={isDeleteUserLoading}
        title="Delete account"
        variant="danger"
        onPress={onDeleteAccountPress}
        shape="square"
      />
    </SafeAreaView>
  )
}

import { useAuth, useUser } from '@clerk/clerk-expo'
import { TouchableOpacity } from 'app/design/core'
import { useQueryClient } from '@tanstack/react-query'
import { SafeAreaView } from 'react-native'
import { Text } from 'app/design/typography'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'solito/router'

export function AccountScreen() {
  const router = useRouter()

  const { signOut } = useAuth()

  const { user } = useUser()

  const isModerator = !!user?.publicMetadata?.isModerator

  const queryClient = useQueryClient()

  const onSignOutPress = () => {
    signOut()
    queryClient.clear()
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
      <TouchableOpacity
        className="bg-sky-700 px-5 py-2.5"
        onPress={onSignOutPress}
      >
        <Text className="text-center text-sm font-medium text-white">
          Log out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

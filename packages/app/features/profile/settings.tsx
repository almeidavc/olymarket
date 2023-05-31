import { useAuth } from '@clerk/clerk-expo'
import { TouchableOpacity, View } from 'app/design/core'
import { Button } from 'app/components/button'
import { useQueryClient } from '@tanstack/react-query'
import { SafeAreaView } from 'react-native'
import { Text } from 'app/design/typography'

export function SettingsScreen() {
  const { signOut } = useAuth()

  const queryClient = useQueryClient()

  const onSignOutPress = () => {
    signOut()
    queryClient.clear()
  }

  return (
    <SafeAreaView>
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

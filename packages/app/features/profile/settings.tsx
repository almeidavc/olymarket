import { useAuth } from '@clerk/clerk-expo'
import { View } from 'app/design/core'
import { Button } from 'app/design/button'
import { useQueryClient } from '@tanstack/react-query'

export function SettingsScreen() {
  const { signOut } = useAuth()

  const queryClient = useQueryClient()

  const onSignOutPress = () => {
    signOut()
    queryClient.clear()
  }

  return (
    <View>
      <Button title="Log out" onPress={onSignOutPress} />
    </View>
  )
}

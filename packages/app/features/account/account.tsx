import { useAuth } from '@clerk/clerk-expo'
import { Button, View } from 'app/design/core'

export function AccountScreen() {
  const { signOut } = useAuth()

  const onSignOutPress = () => {
    signOut()
  }

  return (
    <View>
      <Button title="Log out" onPress={onSignOutPress} />
    </View>
  )
}
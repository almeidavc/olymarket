import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SettingsScreen } from './settings'
import { SellingScreen } from './selling'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PostScreen } from '../post/post'

const Tab = createMaterialTopTabNavigator()
const Stack = createNativeStackNavigator()

export function ProfileTabs() {
  return (
    <Tab.Navigator initialRouteName="selling">
      <Tab.Screen name="selling" component={SellingScreen} />
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export function Profile() {
  return (
    <Stack.Navigator initialRouteName="selling">
      <Stack.Screen
        name="profile-tabs"
        component={ProfileTabs}
        options={{ headerTitle: 'Profile' }}
      />
      <Stack.Screen
        name="post"
        component={PostScreen}
        options={{
          headerTransparent: true,
          headerTintColor: 'white',
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  )
}

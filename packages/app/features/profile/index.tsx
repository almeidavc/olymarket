import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SettingsScreen } from './settings'
import { SellingScreen } from './selling'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PostScreen } from '../post/post'

const Tab = createMaterialTopTabNavigator()
const Stack = createNativeStackNavigator()

export function ProfileTabs() {
  return (
    <Tab.Navigator
      initialRouteName="selling"
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#0369a1' },
        tabBarLabelStyle: { fontWeight: '600', textTransform: 'none' },
      }}
    >
      <Tab.Screen
        name="selling"
        component={SellingScreen}
        options={{ tabBarLabel: 'Selling' }}
      />
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  )
}

export function Profile() {
  return (
    <Stack.Navigator
      initialRouteName="selling"
      screenOptions={{ headerTintColor: 'black' }}
    >
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

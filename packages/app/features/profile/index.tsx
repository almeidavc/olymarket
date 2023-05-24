import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SettingsScreen } from './settings'
import { Selling } from './selling'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

const Tab = createMaterialTopTabNavigator()

export function Profile() {
  return (
    <Tab.Navigator initialRouteName="selling">
      <Tab.Screen
        name="selling"
        component={Selling}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'feed'
          return {
            tabBarStyle: routeName === 'post' ? { display: 'none' } : undefined,
          }
        }}
      />
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

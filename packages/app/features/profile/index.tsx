import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { SettingsScreen } from './settings'

const Tab = createMaterialTopTabNavigator()

export function Profile() {
  return (
    <Tab.Navigator initialRouteName="settings">
      <Tab.Screen name="settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

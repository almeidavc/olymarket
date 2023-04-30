import { HomeScreen } from '../../features/home/screen'
import { CreatePostScreen } from '../../features/post/screen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'

const tabIcons = {
  Home: 'home',
  Post: 'plus',
}

const Tab = createBottomTabNavigator()

export function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name={tabIcons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Post"
        component={CreatePostScreen}
        options={{ headerTitle: 'Sell an item' }}
      />
    </Tab.Navigator>
  )
}

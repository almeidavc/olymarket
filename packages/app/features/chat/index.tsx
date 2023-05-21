import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ChatInboxScreen } from './inbox'
import { ChatScreen, ChatScreenHeader } from './chat'

const Stack = createNativeStackNavigator()

export function Chat() {
  return (
    <Stack.Navigator initialRouteName="inbox">
      <Stack.Screen name="inbox" component={ChatInboxScreen} />
      <Stack.Screen
        name="chat"
        component={ChatScreen}
        options={({ route }) => ({
          headerTitle: () => <ChatScreenHeader partnerId={route.params.to} />,
        })}
      />
    </Stack.Navigator>
  )
}

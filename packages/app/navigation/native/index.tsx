import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ChatScreen } from 'app/features/chat'
import { ChatScreenHeader } from 'app/features/chat/header'
import { Onboarding } from 'app/features/onboarding'
import { Tabs } from './tabs'
import { ReportPostScreen } from 'app/features/post/report'
import { SendFeedbackScreen } from 'app/features/feedback'

const Stack = createNativeStackNavigator()

export function RootNavigator() {
  return (
    <Stack.Navigator
      id="root"
      initialRouteName="tabs"
      screenOptions={{
        headerTintColor: 'black',
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name="tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="chat"
          component={ChatScreen}
          options={({ route }) => ({
            headerTitle: () => (
              <ChatScreenHeader chatId={route.params.chatId} />
            ),
          })}
        />
        <Stack.Screen
          name="report"
          component={ReportPostScreen}
          options={{ headerTitle: 'Report post' }}
        />
        <Stack.Screen
          name="feedback"
          component={SendFeedbackScreen}
          options={{ headerTitle: 'Send us feedback' }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

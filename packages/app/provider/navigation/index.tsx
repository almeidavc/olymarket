import { NavigationContainer } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { useMemo } from 'react'

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NavigationContainer
      linking={useMemo(
        () => ({
          prefixes: [Linking.createURL('/')],
          config: {
            initialRouteName: 'home',
            screens: {
              home: {
                screens: {
                  feed: '',
                  post: 'post/:postId',
                  contact: 'post/:postId/contact/:chatId',
                },
              },
              post: 'post',
              chats: {
                path: 'chats',
                screens: {
                  inbox: 'inbox',
                  chat: ':chatId',
                },
              },
              profile: {
                screens: {
                  settings: 'settings',
                },
              },
              'sign-in': 'sign-in',
              'sign-up': 'sign-up',
              verify: 'sign-up/verify',
            },
          },
        }),
        []
      )}
    >
      {children}
    </NavigationContainer>
  )
}

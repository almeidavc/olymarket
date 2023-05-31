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
              // signed in
              'main-tabs': {
                screens: {
                  home: {
                    screens: {
                      feed: '',
                      post: 'post/:postId',
                    },
                  },
                  post: 'post',
                  chats: {
                    path: 'chats',
                    screens: {
                      inbox: 'inbox',
                    },
                  },
                  profile: {
                    screens: {
                      post: 'profile/selling/post/:postId',
                      'profile-tabs': {
                        screens: {
                          selling: 'profile/selling',
                          settings: 'profile/settings',
                        },
                      },
                    },
                  },
                },
              },
              chat: 'chat/:chatId',

              // signed out
              'sign-in': 'sign-in',
              'sign-up': 'sign-up',
              'verify-email': 'sign-up/verify-email',
              'choose-username': 'sign-up/username',
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

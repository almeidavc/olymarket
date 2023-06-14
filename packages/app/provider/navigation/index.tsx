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
              tabs: {
                screens: {
                  home: {
                    screens: {
                      feed: '',
                      post: 'post/:postId',
                      report: 'post/:postId/report',
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
                      post: 'profile/:context/post/:postId',
                      moderate: 'profile/account/moderate',
                      'profile-tabs': {
                        screens: {
                          selling: 'profile/selling',
                          account: 'profile/account',
                        },
                      },
                    },
                  },
                },
              },

              chat: 'chat/:chatId',

              onboarding: {
                screens: {
                  'sign-in': 'sign-in',
                  'sign-up': 'sign-up',
                  'verify-email': 'sign-up/verify-email',
                  'choose-username': 'sign-up/username',
                },
              },
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

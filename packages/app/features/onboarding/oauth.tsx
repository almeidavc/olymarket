import { useCallback } from 'react'
import { TouchableOpacity } from 'app/design/core'
import { Text } from 'app/design/typography'
import { useRouter } from 'solito/router'
import { useOAuth } from '@clerk/clerk-expo'
import { useWarmUpBrowser } from 'app/utils/browser'
import Svg, { Path } from 'react-native-svg'

function SignInWithGoogle() {
  useWarmUpBrowser()

  const router = useRouter()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onSignInPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, authSessionResult } =
        await startOAuthFlow()

      if (createdSessionId) {
        setActive?.({ session: createdSessionId })
      } else if (authSessionResult?.type === 'success') {
        router.push('/sign-up/username')
      }
    } catch (error) {
      console.error('OAuth error', error)
    }
  }, [])

  return (
    <TouchableOpacity
      onPress={onSignInPress}
      className="mb-2 inline-flex flex-row items-center justify-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center"
    >
      <Svg
        width={16}
        height={16}
        data-prefix="fab"
        data-icon="google"
        role="img"
        viewBox="0 0 488 512"
      >
        <Path
          fill="white"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        ></Path>
      </Svg>
      <Text className="ml-2 text-sm font-medium text-white">
        Continue with Google
      </Text>
    </TouchableOpacity>
  )
}

function SignInWithApple() {
  useWarmUpBrowser()

  const router = useRouter()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_apple' })

  const onSignInPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, authSessionResult } =
        await startOAuthFlow()

      if (createdSessionId) {
        setActive?.({ session: createdSessionId })
      } else if (authSessionResult?.type === 'success') {
        router.push('/sign-up/username')
      }
    } catch (error) {
      console.error('OAuth error', error)
    }
  }, [])

  return (
    <TouchableOpacity
      onPress={onSignInPress}
      className="mb-2 inline-flex flex-row items-center justify-center rounded-lg bg-[#050708] px-5 py-2.5 text-center"
    >
      <Svg
        width={16}
        height={16}
        data-prefix="fab"
        data-icon="apple"
        role="img"
        viewBox="0 0 384 512"
      >
        <Path
          fill="white"
          d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
        ></Path>
      </Svg>
      <Text className="ml-2 text-sm font-medium text-white">
        Continue with Apple
      </Text>
    </TouchableOpacity>
  )
}

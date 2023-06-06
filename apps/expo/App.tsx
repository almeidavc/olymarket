import { RootNavigator } from 'app/navigation/native'
import { Provider } from 'app/provider'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'app/design/core'
import {
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'

const customFonts = {
  'Cormorant-Bold': require('./assets/fonts/Cormorant-Bold.ttf'),
}

const iconFonts = [
  FontAwesome5.font,
  AntDesign.font,
  MaterialCommunityIcons.font,
]

function loadCustomFonts() {
  Font.loadAsync(customFonts)
}

function loadIconFonts() {
  return iconFonts.map((font) => Font.loadAsync(font))
}

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function loadAssetsAsync() {
      try {
        const customFonts = loadCustomFonts()
        const iconFonts = loadIconFonts()
        await Promise.all([customFonts, ...iconFonts])
      } catch (error) {
        console.warn(error)
      } finally {
        setAppIsReady(true)
      }
    }

    loadAssetsAsync()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <View className="h-full" onLayout={onLayoutRootView}>
      <Provider>
        <RootNavigator />
      </Provider>
    </View>
  )
}

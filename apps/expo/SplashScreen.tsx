import { useCallback, useEffect, useState } from 'react'
import { View } from 'app/design/core'
import { trpc } from 'app/utils/trpc'
import { FontAwesome5, AntDesign } from '@expo/vector-icons'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'

const customFonts = {
  'Cormorant-Bold': require('./assets/fonts/Cormorant-Bold.ttf'),
}

const iconFonts = [FontAwesome5.font, AntDesign.font]

function loadCustomFonts() {
  Font.loadAsync(customFonts)
}

function loadIconFonts() {
  return iconFonts.map((font) => Font.loadAsync(font))
}

SplashScreen.preventAutoHideAsync()

export function SplashScreenManager({
  children,
}: {
  children: React.ReactNode
}) {
  const context = trpc.useContext()

  const [feedReady, setFeedReady] = useState(false)
  const [assetsReady, setAssetsReady] = useState(false)

  const appReady = feedReady && assetsReady

  useEffect(() => {
    async function loadFeedAsync() {
      await context.post.search.prefetch({})
      setFeedReady(true)
    }

    loadFeedAsync()
  }, [])

  useEffect(() => {
    async function loadAssetsAsync() {
      try {
        const customFonts = loadCustomFonts()
        const iconFonts = loadIconFonts()
        await Promise.all([customFonts, ...iconFonts])
      } catch (error) {
        console.warn(error)
      } finally {
        setAssetsReady(true)
      }
    }

    loadAssetsAsync()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync()
    }
  }, [appReady])

  if (!appReady) {
    return null
  }

  return (
    <View className="h-full" onLayout={onLayoutRootView}>
      {children}
    </View>
  )
}

import { RootNavigator } from 'app/navigation/native'
import { Provider } from 'app/provider'
import { useCallback } from 'react'
import { useFonts, Cormorant_700Bold } from '@expo-google-fonts/cormorant'
import { View } from 'app/design/core'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({ Cormorant_700Bold })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
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

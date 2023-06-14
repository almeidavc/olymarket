import { RootNavigator } from 'app/navigation/native'
import { Provider } from 'app/provider'
import { SplashScreenManager } from './SplashScreen'

export default function App() {
  return (
    <Provider>
      <SplashScreenManager>
        <RootNavigator />
      </SplashScreenManager>
    </Provider>
  )
}

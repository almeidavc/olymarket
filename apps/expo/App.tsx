import { RootNavigator } from 'app/navigation/native'
import { Provider } from 'app/provider'

export default function App() {
  return (
    <Provider>
      <RootNavigator />
    </Provider>
  )
}

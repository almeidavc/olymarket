import { NavigationProvider } from './navigation'
import { TRPCProvider } from './trpc'
import { SafeArea } from './safe-area'
import { ClerkProvider } from './clerk'

// react-native-root-toast
import { RootSiblingParent } from 'react-native-root-siblings'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <RootSiblingParent>
      <SafeArea>
        <ClerkProvider>
          <TRPCProvider>
            <NavigationProvider>{children}</NavigationProvider>
          </TRPCProvider>
        </ClerkProvider>
      </SafeArea>
    </RootSiblingParent>
  )
}

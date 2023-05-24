import { NavigationProvider } from './navigation'
import { TRPCProvider } from './trpc'
import { SafeArea } from './safe-area'
import { ClerkProvider } from './clerk'
import { MenuProvider } from 'react-native-popup-menu'

// react-native-root-toast
import { RootSiblingParent } from 'react-native-root-siblings'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <RootSiblingParent>
      <SafeArea>
        <ClerkProvider>
          <NavigationProvider>
            <MenuProvider>
              <TRPCProvider>{children}</TRPCProvider>
            </MenuProvider>
          </NavigationProvider>
        </ClerkProvider>
      </SafeArea>
    </RootSiblingParent>
  )
}

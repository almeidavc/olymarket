import { NavigationProvider } from './navigation'
import { TRPCProvider } from './trpc'
import { SafeArea } from './safe-area'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SafeArea>
      <TRPCProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </TRPCProvider>
    </SafeArea>
  )
}

import { ClerkProvider as _ClerkProvider } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'

const getToken = async (key: string) => {
  try {
    return SecureStore.getItemAsync(key)
  } catch {}
}

const saveToken = async (key: string, value: string) => {
  try {
    return SecureStore.setItemAsync(key, value)
  } catch {}
}

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <_ClerkProvider
      publishableKey={process.env.CLERK_PUBLISHABLE_KEY}
      tokenCache={{ getToken, saveToken }}
    >
      {children}
    </_ClerkProvider>
  )
}

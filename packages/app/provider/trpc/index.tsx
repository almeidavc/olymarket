import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { trpc } from 'app/utils/trpc'
import { useAuth } from '@clerk/clerk-expo'

function getApiUrl() {
  const serverUrl = process.env.SERVER_URL
  if (!serverUrl) {
    throw new Error('Server url is not set, please configure it manually')
  }
  return `${serverUrl}/trpc`
}

export function TRPCProvider({ children }) {
  const { getToken } = useAuth()

  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getApiUrl(),
          async headers() {
            const authToken = await getToken()
            return {
              Authorization: authToken ?? undefined,
            }
          },
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

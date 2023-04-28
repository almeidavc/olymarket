import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { trpc } from 'app/utils/trpc'

function getBaseUrl() {
  const apiBaseUrl = process.env.TRPC_SERVER_URL_DEV
  if (!apiBaseUrl) {
    throw new Error('TRPC server url is not set, please configure it manually')
  }
  return apiBaseUrl
}

export function TRPCProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getBaseUrl(),
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

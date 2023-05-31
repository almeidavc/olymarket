import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import { SignedInNavigator } from './signed-in'
import { SignedOutNavigator } from './signed-out'
import { useEffect } from 'react'
import { trpc } from 'app/utils/trpc'

export function RootNavigator() {
  const context = trpc.useContext()

  useEffect(() => {
    context.post.list.prefetch()
  }, [])

  return (
    <>
      <SignedIn>
        <SignedInNavigator />
      </SignedIn>
      <SignedOut>
        <SignedOutNavigator />
      </SignedOut>
    </>
  )
}

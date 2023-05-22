import { SignedIn, SignedOut } from '@clerk/clerk-expo'
import { SignedInNavigator } from './signed-in'
import { SignedOutNavigator } from './signed-out'

export function RootNavigator() {
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

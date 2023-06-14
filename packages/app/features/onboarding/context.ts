import { createContext } from 'react'

interface OnboardingContextI {
  onOnboard: () => void
}

export const OnboardingContext = createContext<OnboardingContextI>(
  {} as OnboardingContextI
)

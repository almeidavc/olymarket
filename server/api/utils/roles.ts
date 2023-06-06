import clerk from '@clerk/clerk-sdk-node'
import { TRPCError } from '@trpc/server'

export const isModerator = async (userId: string) => {
  const user = await clerk.users.getUser(userId)
  return user.publicMetadata.isModerator
}

export const assertIsModerator = async (userId: string) => {
  if (!(await isModerator(userId))) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
}

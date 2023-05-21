import { router } from '../trpc'
import { postRouter } from './post'
import { userRouter } from './user'
import { chatRouter } from './chat'

export const appRouter = router({
  post: postRouter,
  user: userRouter,
  chat: chatRouter,
})

export type AppRouter = typeof appRouter

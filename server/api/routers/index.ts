import { router } from '../trpc'
import { postRouter } from './post'
import { userRouter } from './user'
import { chatRouter } from './chat'
import { feedbackRouter } from './feedback'

export const appRouter = router({
  post: postRouter,
  user: userRouter,
  chat: chatRouter,
  feedback: feedbackRouter,
})

export type AppRouter = typeof appRouter

import { router, publicProcedure } from '../trpc'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import { logger } from '../../utils/logger'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FEEDBACK_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
})

const send = publicProcedure
  .input(z.object({ content: z.string() }))
  .mutation(async ({ ctx, input }) => {
    try {
      await transporter.sendMail({
        from: process.env.FEEDBACK_EMAIL,
        to: process.env.FEEDBACK_EMAIL,
        subject: `Olymarket feedback - ${ctx.auth?.userId || 'anonymous'}`,
        text: input.content,
      })
    } catch (error) {
      logger.error('Error while sending email', error)
    }
  })

export const feedbackRouter = router({
  send,
})

import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'

const completeConversation = Prisma.validator<Prisma.ConversationArgs>()({
  include: {
    messages: true,
    post: true,
    participants: true,
  },
})

type CompleteConversation = Prisma.ConversationGetPayload<
  typeof completeConversation
>

function findPartnerInParticipants(
  conversation: CompleteConversation,
  me: string
) {
  return conversation?.participants.find((member) => member.id !== me)
}

function findMeInParticipants(conversation: CompleteConversation, me: string) {
  return conversation?.participants.find((member) => member.id === me)
}

function parseChat(conversation: CompleteConversation, me: string) {
  return {
    conversation,
    me: findMeInParticipants(conversation, me),
    partner: findPartnerInParticipants(conversation, me),
  }
}

export const chatRouter = router({
  find: protectedProcedure
    .input(z.object({ partnerId: z.string(), postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findFirst({
        where: {
          participants: {
            every: {
              id: { in: [ctx.auth.userId, input.partnerId] },
            },
          },
        },
        include: {
          participants: true,
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
          },
          post: true,
        },
      })
      return {
        conversation,
      }
    }),
  getById: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.prisma.conversation.findUnique({
        where: {
          id: input.chatId,
        },
        include: {
          participants: true,
          post: true,
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      })
      if (!conversation) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      if (
        ctx.auth.userId !== conversation?.participants[0]?.id &&
        ctx.auth.userId !== conversation?.participants[1]?.id
      ) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return parseChat(conversation, ctx.auth.userId)
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await ctx.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: ctx.auth.userId,
          },
        },
      },
      include: {
        post: true,
        participants: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    })
    return conversations.map((conversation) =>
      parseChat(conversation, ctx.auth.userId)
    )
  }),
})

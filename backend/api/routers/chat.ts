import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'
import { logger } from '@olymarket/backend-utils'

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
  me: string,
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
    post: conversation?.post,
  }
}

const getById = protectedProcedure
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
  })

const list = protectedProcedure.query(async ({ ctx }) => {
  const conversations = await ctx.prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          id: ctx.auth.userId!,
        },
      },
      messages: {
        some: {},
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
    orderBy: {
      createdAt: 'desc',
    },
  })
  return conversations.map((conversation) =>
    parseChat(conversation, ctx.auth.userId!),
  )
})

const find = protectedProcedure
  .input(z.object({ partnerId: z.string(), postId: z.string() }))
  .query(async ({ ctx, input }) => {
    const conversation = await ctx.prisma.conversation.findFirst({
      where: {
        postId: input.postId,
        participants: {
          every: {
            id: { in: [ctx.auth.userId!, input.partnerId] },
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
  })

const findOrCreate = protectedProcedure
  .input(z.object({ partnerId: z.string(), postId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    let conversation = await ctx.prisma.conversation.findFirst({
      where: {
        postId: input.postId,
        participants: {
          every: {
            id: { in: [ctx.auth.userId!, input.partnerId] },
          },
        },
      },
    })
    if (!conversation) {
      conversation = await ctx.prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: ctx.auth.userId! }, { id: input.partnerId }],
          },
          post: {
            connect: {
              id: input.postId,
            },
          },
        },
      })
    }
    return conversation
  })

const sendMessage = protectedProcedure
  .input(
    z.object({
      to: z.string(),
      content: z.string(),
      createdAt: z.date(),
      conversationId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const message = await ctx.prisma.message.create({
      data: {
        from: ctx.auth.userId,
        to: input.to,
        content: input.content,
        createdAt: input.createdAt,
        conversationId: input.conversationId,
      },
    })

    const channel = ctx.supabase.channel(input.conversationId)
    await channel.send({
      type: 'broadcast',
      event: 'message',
      payload: { message },
    })
    logger.debug('Broadcasted message successfully: ' + message.content)
    await ctx.supabase.removeChannel(channel)

    return message
  })

export const chatRouter = router({
  getById,
  list,
  find,
  findOrCreate,
  sendMessage,
})

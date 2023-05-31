import { Text } from 'app/design/typography'
import { trpc } from 'app/utils/trpc'
import React from 'react'

export const ChatScreenHeader: React.FC<{ chatId: string }> = ({ chatId }) => {
  const { data: chat } = trpc.chat.getById.useQuery({ chatId })
  return <Text className="text-xl">{chat?.partner?.username}</Text>
}

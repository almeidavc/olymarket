import { View } from 'app/design/core'
import { Text } from 'app/design/typography'
import React from 'react'

interface PlaceholderProps {
  icon: React.ReactNode
  title: string
  description: string
  extra?: React.ReactNode
}

export function Placeholder({
  icon,
  title,
  description,
  extra,
}: PlaceholderProps) {
  return (
    <View className="mt-14 flex flex-col items-center p-4">
      {React.cloneElement(icon, { size: 40 })}
      <Text className="mt-2 text-lg font-semibold">{title}</Text>
      <Text className="mt-2 text-center text-gray-600">{description}</Text>
      {extra}
    </View>
  )
}

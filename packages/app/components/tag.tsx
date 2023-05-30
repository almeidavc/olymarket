import { Text } from 'app/design/typography'
import { View } from 'app/design/core'

export type Color = 'red' | 'green'

const borderColors: { [color in Color]: string } = {
  red: 'border-red-400',
  green: 'border-green-400',
}

const backgroundColors: { [color in Color]: string } = {
  red: 'bg-red-100',
  green: 'bg-green-100',
}

const textColors: { [color in Color]: string } = {
  red: 'text-red-800',
  green: 'text-green-800',
}

export function Tag({ label, color }: { label: string; color: Color }) {
  return (
    <View
      className={`rounded-full border px-2.5 py-0.5 ${backgroundColors[color]} ${borderColors[color]}`}
    >
      <Text className={`text-xs font-medium ${textColors[color]}`}>
        {label}
      </Text>
    </View>
  )
}

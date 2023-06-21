import { Text } from 'app/design/typography'
import { View } from 'app/design/core'

export type Color = 'red' | 'green' | 'gray' | 'blue' | 'neutral'

const borderColors: { [color in Color]: string } = {
  red: 'border-red-400',
  green: 'border-green-400',
  gray: 'border-gray-500',
  blue: 'border-sky-400',
  neutral: 'border-gray-300',
}

const backgroundColors: { [color in Color]: string } = {
  red: 'bg-red-100',
  green: 'bg-green-100',
  gray: 'bg-gray-200',
  blue: 'bg-sky-100',
  neutral: 'bg-white',
}

const textColors: { [color in Color]: string } = {
  red: 'text-red-800',
  green: 'text-green-800',
  gray: 'text-gray-800',
  blue: 'text-sky-800',
  neutral: '',
}

interface TagProps {
  label: string
  color: Color
  textClassName?: string
}

export function Tag({ label, color, textClassName }: TagProps) {
  return (
    <View
      className={`rounded-full border px-2.5 py-0.5 ${backgroundColors[color]} ${borderColors[color]} ${textClassName}`}
    >
      <Text className={`text-xs font-medium ${textColors[color]}`}>
        {label}
      </Text>
    </View>
  )
}

import { Text } from 'app/design/typography'

export type Color = 'red' | 'green'

const colorVariants: { [color in Color]: string } = {
  red: 'bg-red-100 text-red-800',
  green: 'bg-green-100 text-green-800',
}

export function Tag({ label, color }: { label: string; color: Color }) {
  return (
    <Text
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorVariants[color]}`}
    >
      {label}
    </Text>
  )
}

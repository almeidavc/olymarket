import { TouchableOpacity, View } from 'app/design/core'
import { Text } from 'app/design/typography'

interface RadioButtonProps {
  label: string
  isSelected: boolean
  select: () => void
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  isSelected,
  select,
}) => {
  return (
    <TouchableOpacity
      className="flex flex-row items-center justify-between"
      onPress={select}
    >
      <Text className="py-3 text-base font-medium">{label}</Text>
      <View
        className={`flex h-6 w-6 items-center justify-center rounded-full border  ${
          isSelected ? 'border-sky-700 bg-sky-700' : 'border-gray-300'
        }`}
      >
        {isSelected && <View className="h-2 w-2 rounded-full bg-gray-100" />}
      </View>
    </TouchableOpacity>
  )
}

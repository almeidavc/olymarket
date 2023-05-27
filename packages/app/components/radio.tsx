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
    <TouchableOpacity className="flex flex-row items-center" onPress={select}>
      <View
        className={`flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 ${
          isSelected ? 'bg-blue-600' : ''
        }`}
      >
        {isSelected && <View className="h-2 w-2 rounded-full bg-gray-100" />}
      </View>
      <Text className="ml-3 w-full py-3 text-base font-medium text-gray-900 dark:text-gray-300">
        {label}
      </Text>
    </TouchableOpacity>
  )
}

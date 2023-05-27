import { TextInput, View } from 'app/design/core'
import { TextInputProps } from 'react-native'
import { Text } from 'app/design/typography'

const sizeVariants = {
  medium: 16,
  large: 18,
}

const labelVariants = {
  default: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
  invalid: 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500',
}

const inputVariants = {
  default:
    'bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
  invalid:
    'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400',
}

interface LabelProps {
  title: string
}

export const Label: React.FC<LabelProps> = ({ title }) => {
  return <Text className={labelVariants['default']}>{title}</Text>
}

interface LabeledInputProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string
  size?: 'medium' | 'large'
  className?: string
  onChangeValue?: ((value: string) => void) | undefined
  invalid?: boolean
  errorMessage?: string
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  size = 'large',
  className,
  invalid,
  errorMessage,
  onChangeValue,
  ...props
}) => {
  return (
    <View>
      <Text className={labelVariants[invalid ? 'invalid' : 'default']}>
        {label}
      </Text>
      <TextInput
        className={`${
          inputVariants[invalid ? 'invalid' : 'default']
        } ${className}`}
        style={{ fontSize: sizeVariants[size] }}
        placeholderTextColor={invalid ? '#b91c1c' : undefined}
        onChangeText={onChangeValue}
        {...props}
      />
      {invalid && (
        <Text className="mt-2 text-sm text-red-600">{errorMessage}</Text>
      )}
    </View>
  )
}

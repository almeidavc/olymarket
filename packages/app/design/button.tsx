import { Text } from './typography'
import { View } from './core'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

const buttonVariants = {
  primary:
    'text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
  secondary:
    'text-blue-700 border border-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800',
}

const textVariants = {
  primary: 'text-white font-medium text-sm text-center',
  secondary: 'text-blue-700 font-medium text-sm text-center ',
}

interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  ...props
}) => {
  return (
    <TouchableOpacity {...props}>
      <View className={buttonVariants[variant]}>
        <Text className={textVariants[variant]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

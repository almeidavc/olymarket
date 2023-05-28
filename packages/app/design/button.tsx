import React from 'react'
import { Text } from './typography'
import { View } from './core'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Icon } from '@expo/vector-icons/build/createIconSet'
import { LoadingSpinner } from 'app/components/spinner'

const buttonVariants = {
  primary:
    'inline-flex flex-row justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2',
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
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  ...props
}) => {
  return (
    <TouchableOpacity {...props}>
      <View className={buttonVariants[variant]}>
        {loading && (
          <View className="mr-3">
            <LoadingSpinner />
          </View>
        )}
        <Text className={textVariants[variant]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const iconButtonVariants = {
  primary:
    'text-white bg-blue-700 font-medium text-sm text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
  secondary:
    'text-blue-700 border border-blue-700 font-medium text-sm text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500',
}

const iconColorVariants = {
  primary: 'white',
  secondary: '#1d4ed8',
}

const iconButtonShapes = {
  circle: 'rounded-full',
  square: 'rounded-lg',
}

const iconSizes = {
  small: 16,
  medium: 22,
}

const iconButtonPaddings = {
  small: 'p-1.5',
  medium: 'p-2.5',
}

interface IconButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  icon: Icon<any, any>
  size: 'small' | 'medium'
  shape?: 'circle' | 'square'
  variant?: 'primary' | 'secondary'
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'medium',
  shape = 'circle',
  variant = 'primary',
  ...props
}) => {
  return (
    <TouchableOpacity {...props}>
      <View
        className={`${iconButtonVariants[variant]} ${iconButtonPaddings[size]} ${iconButtonShapes[shape]}`}
      >
        {React.cloneElement(icon, {
          size: iconSizes[size],
          color: iconColorVariants[variant],
        })}
      </View>
    </TouchableOpacity>
  )
}

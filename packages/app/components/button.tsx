import React from 'react'
import { Text } from '../design/typography'
import { View } from '../design/core'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Icon } from '@expo/vector-icons/build/createIconSet'
import { LoadingSpinner } from 'app/components/spinner'

const buttonVariants = {
  primary:
    'inline-flex flex-row justify-center items-center text-white bg-sky-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center',
  secondary:
    'text-sky-700 border border-sky-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center',
  danger:
    'focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
}

const textVariants = {
  primary: 'text-white font-medium text-sm text-center',
  secondary: 'text-sky-700 font-medium text-sm text-center ',
  danger: 'text-white font-medium text-sm text-center',
}

const shapeVariants = {
  rounded: 'rounded-lg',
  square: 'rounded-none',
}

interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string
  variant?: 'primary' | 'secondary' | 'danger'
  shape?: 'rounded' | 'square'
  loading?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  shape = 'rounded',
  loading = false,
  disabled,
  className,
  ...props
}) => {
  return (
    <TouchableOpacity disabled={disabled || loading} {...props}>
      <View
        className={`${buttonVariants[variant]} ${shapeVariants[shape]} ${className}`}
      >
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
    'text-white bg-sky-700 border border-transparent font-medium text-sm text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 p-2.5',
  secondary:
    'text-sky-700 border border-sky-700 font-medium text-sm text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500 p-2.5',
}

const iconColorVariants = {
  primary: 'white',
  secondary: '#0369a1',
}

const iconButtonShapes = {
  circle: 'rounded-full',
  square: 'rounded-lg',
}

interface IconButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  icon: Icon<any, any>
  size?: number
  shape?: 'circle' | 'square'
  variant?: 'primary' | 'secondary'
  textClassName?: string
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 22,
  shape = 'circle',
  variant = 'primary',
  textClassName,
  ...props
}) => {
  return (
    <TouchableOpacity {...props}>
      <View
        className={`${iconButtonVariants[variant]} ${iconButtonShapes[shape]} ${textClassName}`}
      >
        {React.cloneElement(icon, {
          size,
          color: iconColorVariants[variant],
        })}
      </View>
    </TouchableOpacity>
  )
}

import React from 'react'
import { Text } from '../design/typography'
import { View } from '../design/core'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Icon } from '@expo/vector-icons/build/createIconSet'
import { LoadingSpinner } from 'app/components/spinner'

export const buttonVariants = {
  primary:
    'inline-flex flex-row justify-center items-center text-white bg-sky-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center',
  secondary:
    'inline-flex flex-row justify-center items-center text-sky-700 border border-sky-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center',
  danger:
    'inline-flex flex-row justify-center items-center text-white bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5',
  disabled:
    'inline-flex flex-row justify-center items-center text-white bg-background font-medium rounded-lg text-sm px-5 py-2.5 text-center',
}

export const textVariants = {
  primary: 'text-white font-medium text-sm text-center',
  secondary: 'text-sky-700 font-medium text-sm text-center ',
  danger: 'text-white font-medium text-sm text-center',
  disabled: 'font-medium text-sm text-center text-gray-400',
}

export const shapeVariants = {
  rounded: 'rounded-lg',
  square: 'rounded-none',
}

interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  title: string
  variant?: 'primary' | 'secondary' | 'danger' | 'disabled'
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
            <LoadingSpinner color="white" />
          </View>
        )}
        <Text className={textVariants[variant]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

const iconButtonVariants = {
  primary:
    'bg-sky-700 border border-transparent font-medium text-sm text-center inline-flex items-center p-2.5',
  secondary:
    'border border-sky-700 font-medium text-sm text-center inline-flex items-center p-2.5',
  disabled:
    'bg-background border border-transparent font-medium text-sm text-center inline-flex items-center p-2.5',
}

export const iconColorVariants = {
  primary: 'white',
  secondary: '#0369a1',
  disabled: '#9ca3af',
}

const iconButtonShapes = {
  circle: 'rounded-full',
  square: 'rounded-lg',
}

interface IconButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  icon: Icon<any, any>
  size?: number
  shape?: 'circle' | 'square'
  variant?: 'primary' | 'secondary' | 'disabled'
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

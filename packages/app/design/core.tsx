import { StyledComponent, styled } from 'nativewind'
import {
  View as RNView,
  TouchableOpacity as RNTouchableOpacity,
  TextInput as RNTextInput,
  TouchableOpacityProps as RNTouchableOpacityProps,
} from 'react-native'
import { Text } from './typography'

export const View = styled(RNView)
export const TextInput = styled(RNTextInput)
export const TouchableOpacity = styled(RNTouchableOpacity)

interface ButtonProps extends Omit<RNTouchableOpacityProps, 'children'> {
  title: string
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  ...props
}) => {
  return (
    <StyledComponent
      component={RNTouchableOpacity}
      className={`flex h-10 items-center justify-center border ${
        variant === 'primary' ? 'bg-blue-900' : ''
      }`}
      {...props}
    >
      <Text
        className={`text-lg font-bold ${
          variant === 'primary' ? 'text-white' : ''
        }`}
      >
        {title}
      </Text>
    </StyledComponent>
  )
}

import { TextInput, View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { Controller, ControllerProps } from 'react-hook-form'
import { TextInputProps } from 'react-native'

interface FormLabelProps {
  title: string
}

export const FormLabel: React.FC<FormLabelProps> = ({ title }) => {
  return <Text className="mb-2 block text-sm font-medium">{title}</Text>
}

export const sizeVariants = {
  medium: 16,
  large: 18,
}

export const colorVariants = {
  default: '',
  invalid: 'text-red-700',
}

export const inputVariants = {
  default: 'bg-background rounded-lg p-2.5',
  invalid: 'bg-red-50 placeholder-red-700 rounded-lg p-2.5',
}

export interface FormInputProps extends Omit<ControllerProps, 'render'> {
  label: string
  size?: 'medium' | 'large'
  textInput?: TextInputProps
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  size = 'large',
  textInput,
  ...controllerProps
}) => {
  return (
    <View className={'mb-4'}>
      <Controller
        {...controllerProps}
        render={({
          field: { value, ref, onChange, onBlur },
          fieldState: { invalid, error },
        }) => (
          <View>
            <FormLabel title={label} />
            <TextInput
              ref={ref}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className={inputVariants[invalid ? 'invalid' : 'default']}
              placeholderTextColor={invalid ? '#b91c1c' : undefined}
              style={{ fontSize: sizeVariants[size] }}
              {...textInput}
            />
            {invalid && error?.message && (
              <Text className="mt-2 text-sm text-red-600">{error.message}</Text>
            )}
          </View>
        )}
      />
    </View>
  )
}

import { TextInput, View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { Controller, ControllerProps } from 'react-hook-form'
import { TextInputProps } from 'react-native'

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

interface FormLabelProps {
  title: string
  variant?: string
}

export const FormLabel: React.FC<FormLabelProps> = ({
  title,
  variant = 'default',
}) => {
  return <Text className={labelVariants[variant]}>{title}</Text>
}

interface FormInputProps extends Omit<ControllerProps, 'render'> {
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

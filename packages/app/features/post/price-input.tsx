import { TextInput, View } from 'app/design/core'
import { Text } from 'app/design/typography'
import { Controller } from 'react-hook-form'
import {
  FormLabel,
  FormInputProps,
  sizeVariants,
  colorVariants,
  inputVariants,
} from 'app/components/form'

export const PriceInput: React.FC<FormInputProps> = ({
  label,
  size = 'large',
  textInput,
  ...controllerProps
}) => {
  return (
    <View className={'mb-4'}>
      <Controller
        {...controllerProps}
        rules={{
          required: 'A price is required.',
          pattern: {
            value: /^[0-9]+$/,
            message: 'Price can only consist of digits.',
          },
          maxLength: {
            value: 4,
            message: 'The maximum price is 9999€.',
          },
        }}
        render={({
          field: { value, ref, onChange, onBlur },
          fieldState: { invalid, error },
        }) => (
          <View>
            <FormLabel title={label} />
            <View className="relative">
              <TextInput
                ref={ref}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className={inputVariants[invalid ? 'invalid' : 'default']}
                placeholderTextColor={invalid ? '#b91c1c' : undefined}
                style={{ fontSize: sizeVariants[size] }}
                placeholder="0"
                inputMode={'numeric'}
                returnKeyType={'done'}
                {...textInput}
              />
              <View className="absolute inset-y-0 right-0 flex justify-center">
                <Text
                  className={`mr-3 ${
                    colorVariants[invalid ? 'invalid' : 'default']
                  }`}
                >
                  €
                </Text>
              </View>
            </View>
            {invalid && error?.message && (
              <Text className="mt-2 text-sm text-red-600">{error.message}</Text>
            )}
          </View>
        )}
      />
    </View>
  )
}

import { useSignUp } from '@clerk/clerk-expo'
import { View } from 'app/design/core'
import { Button } from 'app/components/button'
import { Text } from 'app/design/typography'
import { useState } from 'react'
import { SafeAreaView } from 'react-native'
import { useEffect } from 'react'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'

const VerificationCodeInput = ({ code, setCode, invalid }) => {
  const ref = useBlurOnFulfill({ value: code, cellCount: 6 })

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  })

  return (
    <View>
      <CodeField
        {...props}
        ref={ref}
        autoFocus={true}
        caretHidden={true}
        contextMenuHidden={true}
        value={code}
        onChangeText={setCode}
        cellCount={6}
        rootStyle={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => {
          const borderStyle = invalid
            ? 'border-red-500'
            : isFocused
            ? 'border-blue-500'
            : 'border-gray-300'

          return (
            <View className={`h-12 w-12 border-b p-2.5 ${borderStyle}`}>
              <Text
                key={index}
                className="text-center text-lg text-gray-900"
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )
        }}
      />
    </View>
  )
}

export function VerifyEmailScreen({ navigation }) {
  const { signUp } = useSignUp()

  const [verificationCode, setVerificationCode] = useState('')
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(undefined)
    }
  }, [verificationCode])

  const onVerifyEmailPress = async () => {
    try {
      const emailVerificationResult =
        await signUp?.attemptEmailAddressVerification({
          code: verificationCode,
        })

      if (
        emailVerificationResult &&
        emailVerificationResult.unverifiedFields.length === 0
      ) {
        navigation.navigate('choose-username')
      }
    } catch (error) {
      setErrorMessage(error.errors[0].longMessage)
    }
  }

  return (
    <SafeAreaView>
      <View className="p-4">
        <Text className="mb-2 text-xl font-bold">Enter 6-digit code</Text>
        <Text className="mb-4">{`The code was sent to ${signUp?.emailAddress}.`}</Text>
        <View className=" mx-1 mb-6">
          <VerificationCodeInput
            code={verificationCode}
            setCode={setVerificationCode}
            invalid={!!errorMessage}
          />
          {errorMessage && (
            <Text className="mt-2 text-sm text-red-600">{errorMessage}</Text>
          )}
        </View>
        <Button title="Verify email" onPress={onVerifyEmailPress} />
      </View>
    </SafeAreaView>
  )
}

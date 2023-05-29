import { useSignUp } from '@clerk/clerk-expo'
import { View } from 'app/design/core'
import { Button } from 'app/components/button'
import { SafeAreaView } from 'react-native'
import { FormInput } from 'app/components/form'
import { useForm } from 'react-hook-form'

export function ChooseUsernameScreen() {
  const { signUp, setActive } = useSignUp()

  const { control, handleSubmit, setError } = useForm()

  const onSignUp = async ({ username }) => {
    try {
      const updateUsernameResult = await signUp?.update({
        username,
      })

      if (updateUsernameResult?.status === 'complete') {
        setActive?.({ session: signUp?.createdSessionId })
      }
    } catch (error) {
      setError('username', {
        message: error.errors[0].longMessage,
      })
    }
  }

  return (
    <SafeAreaView>
      <View className="p-4">
        <FormInput
          name="username"
          label="Username"
          control={control}
          rules={{
            required: 'The username cannot be empty.',
          }}
          textInput={{
            placeholder: 'Username',
            returnKeyType: 'done',
          }}
        />
        <Button title="Sign up" onPress={handleSubmit(onSignUp)} />
      </View>
    </SafeAreaView>
  )
}

import { View } from 'app/design/core'
import { trpc } from 'app/utils/trpc'
import { useRouter } from 'solito/router'
import { Button } from 'app/components/button'
import { SafeAreaView } from 'react-native'
import { FormInput } from 'app/components/form'
import { useForm } from 'react-hook-form'

export function SendFeedbackScreen() {
  const router = useRouter()

  const { control, handleSubmit } = useForm()

  const { mutate: sendFeedbackMutation, isLoading: isSendFeedbackLoading } =
    trpc.feedback.send.useMutation({
      onSuccess: () => {
        router.back()
      },
    })

  const onSendFeedbackPress = ({ content }) => {
    sendFeedbackMutation({
      content,
    })
  }

  return (
    <SafeAreaView>
      <View className="p-4">
        <FormInput
          name="content"
          label="Feedback"
          control={control}
          rules={{
            required: 'Feedback text cannot be empty.',
            maxLength: {
              value: 2 ** 16 - 1,
              message: 'Feedback text is too long.',
            },
          }}
          textInput={{
            autoFocus: true,
            multiline: true,
            style: { height: 300 },
            placeholder:
              'Are you enjoying Olymarket? We would love to hear what you think.',
          }}
        />
        <Button
          title="Submit feedback"
          loading={isSendFeedbackLoading}
          onPress={handleSubmit(onSendFeedbackPress)}
        />
      </View>
    </SafeAreaView>
  )
}

import { View } from 'app/design/core'
import { trpc } from 'app/utils/trpc'
import { useRouter } from 'solito/router'
import { Button } from 'app/components/button'
import { SafeAreaView } from 'react-native'
import { FormInput } from 'app/components/form'
import { useForm } from 'react-hook-form'

export function ReportPostScreen({ route }) {
  const router = useRouter()

  const { postId } = route.params

  const { control, handleSubmit } = useForm()

  const { mutate: reportPostMutation, isLoading: isReportPostLoading } =
    trpc.post.report.useMutation({
      onSuccess: () => {
        router.back()
      },
    })

  const onReportPress = ({ reason }) => {
    reportPostMutation({
      postId,
      reason,
    })
  }

  return (
    <SafeAreaView>
      <View className="p-4">
        <FormInput
          name="reason"
          label="Reason"
          control={control}
          rules={{
            required: 'The reason for report cannot be empty.',
            maxLength: {
              value: 2 ** 16 - 1,
              message: 'The reason is too long.',
            },
          }}
          textInput={{
            autoFocus: true,
            multiline: true,
            style: { height: 300 },
            placeholder: 'Reason',
          }}
        />
        <Button
          title="Report"
          loading={isReportPostLoading}
          onPress={handleSubmit(onReportPress)}
        />
      </View>
    </SafeAreaView>
  )
}

import { HBChangePasswordFormItem } from '@hasty-bazar/auth'
import { Alert, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useFormContext } from 'react-hook-form'

type ChangePasswordStepProps = {
  changeState: () => void
  cancelStep: () => void
  formName?: string
  headerSubTitle?: string
  headerTitle?: string
}
const ChangePasswordStep: FC<ChangePasswordStepProps> = (props: ChangePasswordStepProps) => {
  const {
    changeState,
    cancelStep,
    formName = 'changePassword',
    headerSubTitle,
    headerTitle,
  } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const {
    formState: { errors, isValid },
    getValues,
    setValue,
  } = useFormContext()

  const { executeRecaptcha } = useGoogleReCaptcha()

  return (
    <HBChangePasswordFormItem
      headerSubTitle={headerSubTitle}
      headerTitle={headerTitle}
      formName={formName}
      secondBtnOnclick={cancelStep}
      firstBtnLoading={loading}
      firstBtnDisable={!isValid}
      firstBtnOnclick={async () => {
        if (errors[formName]?.message) return
        setLoading(true)
        const newPassword = getValues(formName)
        const userName = getValues('username')
        const otpToken = sessionStorage.getItem('changePasswordToken')
        const googleToken = (await executeRecaptcha?.()) || 'google-captcha-response'

        fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_CREDENTIAL_AUTHORIZATION_URL}/api/Auth/SetPassword`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              otpToken,
              newPassword,
              userName,
              captcha: 'google-captcha-response',
            }),
          },
        )
          .then((response) => response.json())
          .then(({ success, error }) => {
            if (success) {
              setValue(formName, '')
              changeState()
            } else setErrorMessage(error)
          })
          .catch((error) => setErrorMessage('خطا در دریافت اطلاعات'))
          .finally(() => setLoading(false))
      }}
    >
      {errorMessage && (
        <Alert variant="filled" severity="error">
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
    </HBChangePasswordFormItem>
  )
}

export default ChangePasswordStep

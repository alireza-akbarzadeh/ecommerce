import { HBEmailPhoneNumberFormItem } from '@hasty-bazar/auth'
import { HBClassesType } from '@hasty-bazar/core'
import { Alert, Button, Grid, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useFormContext } from 'react-hook-form'
import { AuthCurrentState } from '../AuthPage'

const CreateOTPForLogin = `${process.env.NEXT_PUBLIC_NEXTAUTH_CREDENTIAL_AUTHORIZATION_URL}/api/Auth/CreateOTPForChangePassword`

type PhoneEmailStateProps = {
  changeState: (newState: AuthCurrentState) => void
  headerTitle?: string
  headerSubTitle?: string
  showChild?: boolean
  formName?: string
}

const classes: HBClassesType<'common'> = {
  common: {
    mt: 10,
  },
}
const PhoneEmailStep: FC<PhoneEmailStateProps> = (props: PhoneEmailStateProps) => {
  const { changeState, headerTitle, headerSubTitle, showChild, formName = 'username' } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const {
    formState: { errors },
    getValues,
  } = useFormContext()
  return (
    <HBEmailPhoneNumberFormItem
      formName={formName}
      headerTitle={headerTitle}
      headerSubTitle={headerSubTitle}
      secondBtnOnclick={() => changeState('login')}
      firstBtnLoading={loading}
      firstBtnDisable={!!errors?.[formName as keyof typeof errors]?.message}
      firstBtnOnclick={async () => {
        if (errors[formName]?.message) return
        setLoading(true)
        const user = getValues(formName)
        const googleToken = (await executeRecaptcha?.()) || 'google-captcha-response'

        fetch(CreateOTPForLogin, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user,
            captcha: 'google-captcha-response',
          }),
        })
          .then((response) => response.json())
          .then(({ otpToken }) => {
            if (otpToken) {
              sessionStorage.setItem('otpToken', otpToken)
              changeState('authenticate')
            } else {
              setErrorMessage('شما مجاز به انجام این کار نمی باشید')
            }
          })
          .catch((error) => {
            setErrorMessage('خطا در دریافت اطلاعات')
          })
          .finally(() => setLoading(false))
      }}
    >
      {showChild && (
        <Grid container justifyContent={'center'} sx={classes.common}>
          <Button color="info" onClick={() => changeState('login')}>
            ورود با رمز عبور
          </Button>
        </Grid>
      )}
      {errorMessage && (
        <Alert variant="filled" severity="error" sx={classes.common}>
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
    </HBEmailPhoneNumberFormItem>
  )
}

export default PhoneEmailStep

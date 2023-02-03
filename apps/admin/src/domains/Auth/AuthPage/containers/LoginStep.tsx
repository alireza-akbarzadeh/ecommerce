import { HBLoginFormItem } from '@hasty-bazar/auth'
import { HBClassesType } from '@hasty-bazar/core'
import { Alert, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useFormContext } from 'react-hook-form'
import useSignIn from '../../AuthServices/common/useSignIn'
import { AuthCurrentState } from '../AuthPage'

type LoginStepProps = {
  changeState: (newState: AuthCurrentState) => void
}

const classes: HBClassesType<'common'> = {
  common: { mt: 8 },
}

const LoginStep: FC<LoginStepProps> = (props: LoginStepProps) => {
  const { changeState } = props
  const { push } = useRouter()
  const signInMutation = useSignIn()
  const { getValues, formState } = useFormContext()
  const { isValid, errors } = formState
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const { executeRecaptcha } = useGoogleReCaptcha()

  return (
    <HBLoginFormItem
      secondLinkOnclick={() => changeState('forgetPassword')}
      // firstLinkOnclick={() => changeState('loginWithOTP')}
      emailFormName="username"
      passwordFormName="password"
      firstBtnDisable={!isValid && Object.keys(errors).length > 0}
      firstBtnLoading={loading}
      firstBtnOnclick={async () => {
        const { username: userError, password: passwordError } = formState.errors
        if (userError || passwordError) return
        setLoading(true)
        const username = getValues('username')
        const password = getValues('password')
        const googleToken = (await executeRecaptcha?.()) || 'google-captcha-response'

        signInMutation({
          username,
          password,
          captcha: 'google-captcha-response',
        })
          .then((res) => {
            setErrorMessage(undefined)
            setLoading(false)
            push('/')
          })
          .catch((error) => {
            setErrorMessage(error || 'نام کاربری یا کلمه عبور اشتباه است')
            setLoading(false)
          })
      }}
    >
      {errorMessage && (
        <Alert sx={classes.common} severity="error" variant="filled">
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
    </HBLoginFormItem>
  )
}

export default LoginStep

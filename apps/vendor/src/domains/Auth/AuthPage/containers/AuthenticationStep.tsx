import { HBAuthenticationFormItem } from '@hasty-bazar/auth'
import { Alert, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useFormContext } from 'react-hook-form'
import useSignIn from '../../AuthServices/common/useSignIn'
import { AuthCurrentState } from '../AuthPage'

type AuthenticationStepProps = {
  changeState: (newState: AuthCurrentState) => void
  backBtn?: () => void
  flow: 'login' | 'forgetPassword' | 'loginWithOTP'
}
type AuthenticationOnSubmitType = (props: { otpCode: number; otpToken: string }) => void

const AuthenticationStep: FC<AuthenticationStepProps> = (props: AuthenticationStepProps) => {
  const { push } = useRouter()
  const signInMutation = useSignIn()
  const { backBtn, flow, changeState } = props
  const { getValues, formState, setValue } = useFormContext()
  const { isValid } = formState
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const username = getValues('username')
  const { executeRecaptcha } = useGoogleReCaptcha()

  const getTimeOut = new Date().getTime() + 1000 * 60 * 2
  const loginWithOTP: AuthenticationOnSubmitType = async ({ otpCode, otpToken }) => {
    const googleToken = (await executeRecaptcha?.()) || 'google-captcha-response'

    const body = {
      username,
      captcha: 'google-captcha-response',
      loginType: 'otp',
      otpCode,
      otpToken,
    }
    setLoading(true)
    signInMutation(body)
      .then((res) => {
        sessionStorage.removeItem('otpToken')
        push('/')
      })
      .catch((error) => {
        setErrorMessage('خطا در دریافت اطلاعات')
      })
      .finally(() => setLoading(false))
  }

  const changePasswordCheckOTP: AuthenticationOnSubmitType = async ({
    otpCode: OTPCode,
    otpToken,
  }) => {
    fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_CREDENTIAL_AUTHORIZATION_URL}/api/Auth/ValidateOTPForForgotPassword`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          OTPCode,
          otpToken,
        }),
      },
    )
      .then((response) => response.json())
      .then(({ success, error, changePasswordToken }) => {
        if (success) {
          sessionStorage.removeItem('otpToken')
          sessionStorage.setItem('changePasswordToken', changePasswordToken)
          changeState('changePassword')
        } else {
          setErrorMessage(error ?? 'خطا در دریافت اطلاعات')
        }
      })
      .catch((error) => {
        setErrorMessage('خطا در دریافت اطلاعات')
      })
      .finally(() => setLoading(false))
  }
  const resendOTP = async () => {
    const googleToken = (await executeRecaptcha?.()) || 'google-captcha-response'

    fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_CREDENTIAL_AUTHORIZATION_URL}/api/Auth/CreateOTPForLogin`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: username,
          captcha: 'google-captcha-response',
        }),
      },
    )
      .then((response) => response.json())
      .then(({ otpToken }) => {
        if (otpToken) {
          sessionStorage.setItem('otpToken', otpToken)
          setTime(getTimeOut)
        } else {
          setErrorMessage('شما مجاز به انجام این کار نمی باشید')
        }
      })
      .catch((error) => {
        setErrorMessage('خطا در دریافت اطلاعات')
      })
      .finally(() => setLoading(false))
  }
  const [time, setTime] = useState<number>(getTimeOut)
  useEffect(() => {
    setTime(getTimeOut)
    setValue('OTP', '')
  }, [])

  return (
    <HBAuthenticationFormItem
      inputMask="00000000"
      verificationCodeTime={time}
      formName="OTP"
      headerSubTitle={`کد ارسال شده به ${username} را وارد کنید`}
      firstBtnOnclick={() => {
        if (formState.errors['OTP']) return
        const otpToken = sessionStorage.getItem('otpToken') as string
        const otpCode = getValues('OTP') as number
        if (flow === 'loginWithOTP') loginWithOTP({ otpToken, otpCode })
        else changePasswordCheckOTP({ otpToken, otpCode })
      }}
      buttonType="button"
      firstBtnLoading={loading}
      secondBtnOnclick={backBtn}
      firstBtnDisable={!isValid}
      timeoutBtnCallBack={resendOTP}
    >
      {errorMessage && (
        <Alert variant="filled" severity="error">
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
    </HBAuthenticationFormItem>
  )
}

export default AuthenticationStep

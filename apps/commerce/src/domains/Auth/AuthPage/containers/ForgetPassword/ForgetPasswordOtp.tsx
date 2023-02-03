import {
  usePostIdsForgotPasswordMutation,
  usePostIdsValidateOTPForForgotPasswordMutation,
} from '@hasty-bazar-commerce/core/utils/IdsApi'
import { HBFormHeader, HBTextFieldController } from '@hasty-bazar/auth'
import { HBCountDownTimer, HBSubmitButton } from '@hasty-bazar/core'
import { Alert, Box, inputBaseClasses, Stack, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { AuthStateProps } from '../../AuthPage'
import AuthPageMessages from '../../AuthPage.messages'
import { SignUpSetPasswordActionStyle } from '../SignUp/SignUpOtp.styles'

const ForgetPasswordOtp: FC<AuthStateProps> = (props) => {
  const [time, setTime] = useState<number>(props.delayTimeForDataEntry)
  const { formatMessage } = useIntl()
  const { onChangeState } = props
  const { watch, setValue } = useFormContext()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const username = watch('username')
  const OTPCode = watch('otp')
  const [forgetPasswordMutate, { isLoading: otpIsLoading }] = usePostIdsForgotPasswordMutation()
  const [validateOTPForForgotPasswordMutate, { isLoading }] =
    usePostIdsValidateOTPForForgotPasswordMutation()

  const handleResendOTP = () => {
    forgetPasswordMutate({
      user: username,
    })
      .unwrap()
      .then(({ data }) => {
        if (data?.otpToken) {
          sessionStorage.setItem('otpToken', data?.otpToken)
          setTime(props.delayTimeForDataEntry)
        } else {
          setErrorMessage(
            data?.message || formatMessage(AuthPageMessages.forgetPasswordOtpErrorMessage),
          )
        }
      })
      .catch((error) => {
        setErrorMessage(error)
      })
  }

  const handleForgetPassword = () => {
    setErrorMessage(undefined)
    const otpToken = sessionStorage.getItem('otpToken')

    validateOTPForForgotPasswordMutate({
      otpToken: otpToken!,
      OTPCode,
    })
      .unwrap()
      .then(({ data }) => {
        if (data?.success) {
          sessionStorage.setItem('otpToken', data?.changePasswordToken)
          onChangeState('forgetPasswordSetPassword')
        } else {
          setErrorMessage(data?.error)
        }
      })
      .catch((error) => {
        setErrorMessage(error)
      })
  }

  useEffect(() => {
    setTime(props.delayTimeForDataEntry)
  }, [props.delayTimeForDataEntry])

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(undefined)
    }
  }, [OTPCode])

  return (
    <Box>
      <HBFormHeader
        title={formatMessage(AuthPageMessages.forgetPassword)}
        subTitle={
          <Typography variant="overline" component="p">
            {formatMessage(AuthPageMessages.forgetPasswordSubTitle, {
              username: (
                <Typography component="span" sx={{ color: 'grey.900' }} variant="subtitle2">
                  {username}
                </Typography>
              ),
            })}
          </Typography>
        }
      />
      <HBTextFieldController
        name="otp"
        label="کد تایید"
        mask={props.otpMask}
        sx={{
          [`& .${inputBaseClasses.input}`]: {
            direction: 'rtl',
          },
        }}
      />

      <Stack alignItems="flex-start" mt={6}>
        <HBCountDownTimer
          targetDate={time}
          disabledButton={otpIsLoading}
          linkText={formatMessage(AuthPageMessages.resendOtp)}
          extraTimerText={formatMessage(AuthPageMessages.extraTimerText)}
          onClick={handleResendOTP}
          maximumShowed="minute"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& h5,& p': (theme) => ({
              ...theme.typography.body1,
              marginRight: theme.spacing(0),
            }),
          }}
        />
      </Stack>
      {errorMessage && (
        <Alert variant="filled" severity="error" sx={{ mt: 8 }}>
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
      <SignUpSetPasswordActionStyle>
        <HBSubmitButton
          buttonText={formatMessage(AuthPageMessages.confirm)}
          backButtonText={formatMessage(AuthPageMessages.back)}
          buttonOnClick={handleForgetPassword}
          backButtonOnclick={() => {
            setValue('otp', undefined)
            onChangeState(props.prevState)
          }}
          buttonLoading={isLoading}
          buttonType={'submit'}
          sx={{
            mt: 8,
          }}
          firstBtnDisable={
            OTPCode?.length !== (props.otpSettings?.numberOfOtpDigit || 6) || !!errorMessage
          }
        />
      </SignUpSetPasswordActionStyle>
    </Box>
  )
}

export default ForgetPasswordOtp

import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import { usePostIdsCreateOTPForLoginMutation } from '@hasty-bazar-commerce/core/utils/IdsApi'
import useSignIn from '@hasty-bazar-commerce/domains/Auth/AuthServices/common/useSignIn'
import { HBFormHeader, HBTextFieldController } from '@hasty-bazar/auth'
import { HBCountDownTimer, HBIcon, HBSubmitButton } from '@hasty-bazar/core'
import { Alert, Box, inputBaseClasses, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { AuthStateProps } from '../../AuthPage'
import AuthPageMessages from '../../AuthPage.messages'

const SignInOtp: FC<AuthStateProps> = (props) => {
  const recentSearches = localStorage.getItem('recentSearches')
  const refactoredRecentSearches = recentSearches?.split(',').length
    ? recentSearches?.split(',')?.reverse()?.toString()
    : ''
  const { formatMessage } = useIntl()
  const [time, setTime] = useState<number>(props.delayTimeForDataEntry)
  const { onChangeState } = props
  const { push, query } = useRouter()
  const signInMutation = useSignIn()
  const clientSessionId = useClientSession()
  const {
    getValues,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { isValid, errors },
  } = useFormContext()
  const [loading, setLoading] = useState(false)
  const username = getValues('username')
  const otpCode = watch('otp')
  const [createOTPForLoginMutate, { isLoading }] = usePostIdsCreateOTPForLoginMutation()

  const handleResendOTP = () => {
    setValue('otp', '')
    createOTPForLoginMutate({
      user: username,
    })
      .unwrap()
      .then(({ data }) => {
        if (data?.otpToken) {
          sessionStorage.setItem('otpToken', data?.otpToken)
          setTime(props.delayTimeForDataEntry)
        } else {
          setError('otpError', {
            message: data?.message || formatMessage(AuthPageMessages.userCannotAccess),
          })
        }
      })
      .catch((error) => {
        setError('otpError', { message: error })
      })
  }

  const handleSignIn = () => {
    setLoading(true)

    clearErrors('otpError')
    const username = watch('username')
    const otpToken = sessionStorage.getItem('otpToken') as string
    signInMutation({
      username,
      loginType: 'otp',
      otpToken,
      otpCode,
      clientSessionId: clientSessionId!,
      recentSearches: refactoredRecentSearches,
    })
      .then(() => {
        sessionStorage.removeItem('otpToken')

        setLoading(false)

        if (query.callbackUrl) push(query.callbackUrl as string)
        else push('/')
      })
      .catch((error) => {
        setValue('otp', '')
        setError('otpError', { message: error })
        setLoading(false)
      })
  }

  useEffect(() => {
    setTime(props.delayTimeForDataEntry)
  }, [props.delayTimeForDataEntry])

  return (
    <Box>
      <HBFormHeader
        title={formatMessage(AuthPageMessages.signInOtpTitle)}
        subTitle={formatMessage(AuthPageMessages.signInOtpSubTitle, {
          username: getValues('username'),
        })}
      />
      <HBTextFieldController
        name="otp"
        label={formatMessage(AuthPageMessages.otpCode)}
        mask={props.otpMask}
        formRules={{ maxLength: props.otpSettings?.numberOfOtpDigit || 6, required: true }}
        sx={{
          [`& .${inputBaseClasses.input}`]: {
            direction: 'rtl',
          },
        }}
      />
      <Box mt={6} display="flex" justifyContent={'space-between'} alignItems="center">
        <HBCountDownTimer
          targetDate={time}
          disabledButton={isLoading}
          linkText={formatMessage(AuthPageMessages.resendOtpCode)}
          extraTimerText={formatMessage(AuthPageMessages.untilResendOtpCode)}
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
        <Typography
          variant="button"
          color="info.main"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            setValue('otp', undefined)
            onChangeState(props.prevState)
          }}
        >
          <FormattedMessage {...AuthPageMessages.signInWithPassword} />
        </Typography>
      </Box>
      {!!errors?.otpError?.message && (
        <Alert
          variant="filled"
          severity="error"
          icon={
            <HBIcon
              type="ban"
              sx={{
                color: 'common.white',
              }}
              size="small"
            />
          }
          sx={{ mt: 8 }}
        >
          <Typography>{errors?.otpError?.message as string}</Typography>
        </Alert>
      )}
      <HBSubmitButton
        buttonText={formatMessage(AuthPageMessages.enter)}
        backButtonText={formatMessage(AuthPageMessages.backStep)}
        buttonOnClick={handleSignIn}
        backButtonOnclick={() => {
          setValue('otp', undefined)
          onChangeState(props.prevState)
        }}
        buttonLoading={loading}
        buttonType={'submit'}
        sx={{
          mt: 8,
        }}
        firstBtnDisable={!isValid}
      />
    </Box>
  )
}

export default SignInOtp

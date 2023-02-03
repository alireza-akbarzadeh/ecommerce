import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import {
  usePostIdsCreateOTPForLoginMutation,
  usePostIdsForgotPasswordMutation,
} from '@hasty-bazar-commerce/core/utils/IdsApi'
import useSignIn from '@hasty-bazar-commerce/domains/Auth/AuthServices/common/useSignIn'
import { HBFormHeader, HBPasswordController, PasswordLevel } from '@hasty-bazar/auth'
import { HBSubmitButton } from '@hasty-bazar/core'
import { Alert, Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { AuthStateProps } from '../../AuthPage'
import AuthPageMessages from '../../AuthPage.messages'
import { SignUpSetPasswordActionStyle } from '../SignUp/SignUpOtp.styles'

const SignInPassword: FC<AuthStateProps> = (props) => {
  const recentSearches = localStorage.getItem('recentSearches')
  const refactoredRecentSearches = recentSearches?.split(',').length
    ? recentSearches?.split(',')?.reverse()?.toString()
    : ''
  const { formatMessage } = useIntl()
  const { onChangeState } = props
  const { push, query } = useRouter()
  const signInMutation = useSignIn()
  const {
    watch,
    setValue,
    formState: { isValid },
  } = useFormContext()
  const [loading, setLoading] = useState(false)
  const clientSessionId = useClientSession()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const watchValues = watch('newPassword')
  const [createOtpMutate, { isLoading }] = usePostIdsCreateOTPForLoginMutation()
  const [forgetPasswordMutate, { isLoading: forgetPasswordLoading }] =
    usePostIdsForgotPasswordMutation()

  const username = watch('username')
  const handleSignIn = () => {
    setErrorMessage(undefined)
    setLoading(true)
    const password = watch('newPassword')
    signInMutation({
      username,
      password,
      clientSessionId: clientSessionId!,
      // @ts-ignore
      recentSearches: refactoredRecentSearches,
    })
      .then(() => {
        setErrorMessage(undefined)
        setLoading(false)
        if (query.callbackUrl) push(query.callbackUrl as string)
        else push('/')
      })
      .catch((error) => {
        setErrorMessage(error)
        setLoading(false)
      })
  }

  const handleSignInOtpClick = () => {
    setValue('password', undefined)
    createOtpMutate({
      user: username,
    })
      .unwrap()
      .then(({ data }) => {
        if (data?.otpToken) {
          sessionStorage.setItem('otpToken', data?.otpToken)
          onChangeState('signInOtp')
        } else {
          setErrorMessage(data?.message || formatMessage(AuthPageMessages.userCannotAccess))
        }
      })
      .catch((error) => {
        setErrorMessage(
          error?.data?.messages?.[0]?.message || formatMessage(AuthPageMessages.faultMessage),
        )
      })
  }

  const handleForgetPassword = () => {
    setValue('password', undefined)
    const user = watch('username')
    forgetPasswordMutate({
      user,
    })
      .unwrap()
      .then(({ data }) => {
        if (data?.otpToken) {
          sessionStorage.setItem('otpToken', data?.otpToken)
          onChangeState('forgetPassword')
        } else {
          setErrorMessage(data?.message || formatMessage(AuthPageMessages.userCannotAccess))
        }
      })
      .catch((error) => {
        setErrorMessage(
          error?.data?.messages?.[0]?.message || formatMessage(AuthPageMessages.faultMessage),
        )
      })
  }

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(undefined)
    }
  }, [watchValues])

  const isSecondLoaded = useRef<boolean | null>(null)
  useEffect(() => {
    if (query?.forgetPassword && !forgetPasswordLoading && !isSecondLoaded.current) {
      isSecondLoaded.current = true
      handleForgetPassword()
    }
    if (query?.signInWithOtp && !isLoading && !isSecondLoaded.current) {
      isSecondLoaded.current = true
      handleSignInOtpClick()
    }
    return () => {
      setValue('newPassword', undefined)
    }
  }, [])

  return (
    <>
      <HBFormHeader
        title={formatMessage(AuthPageMessages.signInPasswordTitle)}
        subTitle={
          <Typography variant="overline">
            {formatMessage(AuthPageMessages.signInPasswordSubTitle)}
          </Typography>
        }
      />
      <HBPasswordController
        formName={'newPassword'}
        options={{
          level: PasswordLevel.Low,
          maxLength: props.otpSettings?.passwordMaxLength,
          minLength: props.otpSettings?.passwordMinLength,
        }}
        label={formatMessage(AuthPageMessages.signInPasswordTitle)}
      />

      <Grid container sx={{ mt: 6 }}>
        <Button color="info" onClick={handleSignInOtpClick}>
          <FormattedMessage {...AuthPageMessages.signInOTPPassword} />
        </Button>
      </Grid>
      <Grid container sx={{ mt: 5 }}>
        <Button color="info" onClick={handleForgetPassword}>
          <FormattedMessage {...AuthPageMessages.signInForgotPassword} />
        </Button>
      </Grid>

      {errorMessage && (
        <Alert variant="filled" severity="error" sx={{ mt: 8 }}>
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
      <SignUpSetPasswordActionStyle>
        <HBSubmitButton
          sx={{ mt: 8 }}
          buttonLoading={loading}
          buttonText={formatMessage(AuthPageMessages.enter)}
          backButtonText={formatMessage(AuthPageMessages.backStep)}
          buttonOnClick={handleSignIn}
          backButtonOnclick={() => onChangeState('checkUserExistStep')}
          firstBtnDisable={!isValid || !!errorMessage}
        />
      </SignUpSetPasswordActionStyle>
    </>
  )
}

export default SignInPassword

import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import useSignIn from '@hasty-bazar-commerce/domains/Auth/AuthServices/common/useSignIn'
import { usePostWebIdrCustomersMutation } from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBFormHeader, HBPasswordController, PasswordLevel } from '@hasty-bazar/auth'
import { HBIcon, HBSubmitButton } from '@hasty-bazar/core'
import { Alert, Box, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { AuthStateProps } from '../../AuthPage'
import AuthPageMessages from '../../AuthPage.messages'
import { SignUpSetPasswordActionStyle } from './SignUpOtp.styles'

const SignUpSetPassword: FC<AuthStateProps> = (props) => {
  const { formatMessage } = useIntl()
  const { onChangeState } = props
  const {
    getValues,
    setValue,
    formState: { isValid, errors },
    reset,
  } = useFormContext()
  const signInMutation = useSignIn()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [saveMutate] = usePostWebIdrCustomersMutation()
  const clientSessionId = useClientSession()

  const handleSetPassword = () => {
    try {
      setLoading(true)
      const { newPasswordSignup, username, firstName, lastName } = getValues()
      const otpToken = sessionStorage.getItem('changePasswordToken')
      saveMutate({
        ...ApiConstants,
        registerCustomerModel: {
          mobile: username,
          firstName,
          lastName,
          password: newPasswordSignup,
          otpToken: otpToken!,
        },
      })
        .unwrap()
        .then(({ success }) => {
          if (success) {
            signInMutation({
              username,
              password: newPasswordSignup,
              clientSessionId: clientSessionId!,
            })
              .then(() => {
                sessionStorage.removeItem('changePasswordToken')
                sessionStorage.removeItem('otpToken')
                onChangeState('signUpSuccess')
                reset()
              })
              .catch((error) => {
                setLoading(false)
                throw error
              })
          } else {
            setLoading(false)
            setErrorMessage(formatMessage(AuthPageMessages.faultMessage))
          }
        })
        .catch((error) => {
          setLoading(false)
          throw error
        })
    } catch (error) {
      setErrorMessage(error)
    }
  }

  useEffect(() => {
    return () => setValue('newPasswordSignup', undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <HBFormHeader
        title={formatMessage(AuthPageMessages.signUpSetPasswordTitle)}
        subTitle={
          <Typography variant="overline" component="p">
            {formatMessage(AuthPageMessages.signUpSetPasswordSubTitle)}
          </Typography>
        }
      />

      <HBPasswordController
        formName={'newPasswordSignup'}
        label={formatMessage(AuthPageMessages.signInPasswordTitle)}
        options={{
          level: props.otpSettings?.passwordLevel,
          maxLength: props.otpSettings?.passwordMaxLength,
          minLength: props.otpSettings?.passwordMinLength,
        }}
      />

      <Box mt={2} display="flex" alignItems="center" sx={{ display: 'flex', alignItems: 'start' }}>
        <HBIcon
          type="exclamationCircle"
          sx={{ mr: 2, color: isValid ? 'success.main' : 'text.secondary' }}
          size="small"
        />
        <Typography
          variant="caption"
          component="p"
          color={isValid ? 'success.main' : 'text.secondary'}
        >
          <Typography
            variant="caption"
            component="p"
            color={isValid ? 'success.main' : 'text.secondary'}
          >
            {formatMessage(AuthPageMessages.signUpSetPasswordDescLength, {
              length: props.otpSettings?.passwordMinLength || 8,
            })}
          </Typography>
          <Typography
            variant="caption"
            component="p"
            color={isValid ? 'success.main' : 'text.secondary'}
          >
            {formatMessage(AuthPageMessages.signUpSetPasswordDescMaxLength, {
              length: props.otpSettings?.passwordMaxLength || 12,
            })}
          </Typography>
          {props.otpSettings?.passwordLevel === PasswordLevel.Medium && (
            <>
              <Typography
                variant="caption"
                component="p"
                color={isValid ? 'success.main' : 'text.secondary'}
              >
                {formatMessage(AuthPageMessages.containsOneEnglishCharacter)}
              </Typography>
              <Typography
                variant="caption"
                component="p"
                color={isValid ? 'success.main' : 'text.secondary'}
              >
                {formatMessage(AuthPageMessages.signUpSetPasswordDescUpperCase)}
              </Typography>
            </>
          )}
          {props.otpSettings?.passwordLevel === PasswordLevel.High && (
            <>
              <Typography
                variant="caption"
                component="p"
                color={isValid ? 'success.main' : 'text.secondary'}
              >
                {formatMessage(AuthPageMessages.signUpSetPasswordDescLowerCase)}
              </Typography>
              <Typography
                variant="caption"
                component="p"
                color={isValid ? 'success.main' : 'text.secondary'}
              >
                {formatMessage(AuthPageMessages.signUpSetPasswordDescChar)}
              </Typography>
            </>
          )}
        </Typography>
      </Box>
      {errorMessage && (
        <Alert variant="filled" severity="error" sx={{ mt: 8 }}>
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
      <SignUpSetPasswordActionStyle>
        <HBSubmitButton
          buttonText={formatMessage(AuthPageMessages.accept)}
          backButtonText={formatMessage(AuthPageMessages.backStep)}
          buttonOnClick={handleSetPassword}
          backButtonOnclick={() => {
            reset({ username: getValues('username') })
            onChangeState(props.prevState)
          }}
          buttonLoading={loading}
          buttonType={'submit'}
          sx={{ mt: 8 }}
          firstBtnDisable={!isValid}
        />
      </SignUpSetPasswordActionStyle>
    </Box>
  )
}

export default SignUpSetPassword

import { usePostIdsSetPasswordMutation } from '@hasty-bazar-commerce/core/utils/IdsApi'
import { HBFormHeader, HBPasswordController, PasswordLevel } from '@hasty-bazar/auth'
import { HBIcon, HBSubmitButton } from '@hasty-bazar/core'
import { Alert, Box, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { AuthStateProps } from '../../AuthPage'
import AuthPageMessages from '../../AuthPage.messages'
import { SignUpSetPasswordActionStyle } from '../SignUp/SignUpOtp.styles'

const ForgetPasswordSetPassword: FC<AuthStateProps> = (props) => {
  const { formatMessage } = useIntl()
  const { onChangeState } = props
  const {
    getValues,
    setValue,
    formState: { isValid },
    reset,
    watch,
  } = useFormContext()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const newPasswordWatch = watch('newPassword')
  const [setPasswordMutate, { isLoading }] = usePostIdsSetPasswordMutation()

  const handleSetPassword = () => {
    setErrorMessage(undefined)
    const { newPassword, username } = getValues()
    const otpToken = sessionStorage.getItem('otpToken')

    setPasswordMutate({
      newPassword,
      userName: username,
      otpToken: otpToken!,
    })
      .unwrap()
      .then(({ data }) => {
        if (data?.success) {
          reset()
          sessionStorage.removeItem('otpToken')
          onChangeState('forgetPasswordSuccess')
        } else {
          setErrorMessage(data?.error)
        }
      })
      .catch((error) => {
        setErrorMessage(error)
      })
  }

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage(undefined)
    }
  }, [newPasswordWatch])

  useEffect(() => {
    return () => {
      setValue('newPassword', undefined)
    }
  }, [])

  return (
    <Box>
      <HBFormHeader
        title={formatMessage(AuthPageMessages.setPassword)}
        subTitle={
          <Typography variant="overline" component="p">
            {formatMessage(AuthPageMessages.setPasswordSubTitle)}
          </Typography>
        }
      />

      <HBPasswordController
        formName={'newPassword'}
        label={formatMessage(AuthPageMessages.password)}
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
          buttonText={formatMessage(AuthPageMessages.confirm)}
          backButtonText={formatMessage(AuthPageMessages.back)}
          buttonOnClick={handleSetPassword}
          backButtonOnclick={() => {
            reset({ username: getValues('username') })
            onChangeState('checkUserExistStep')
          }}
          buttonLoading={isLoading}
          buttonType={'submit'}
          sx={{ mt: 8 }}
          firstBtnDisable={!isValid || !!errorMessage}
        />
      </SignUpSetPasswordActionStyle>
    </Box>
  )
}

export default ForgetPasswordSetPassword

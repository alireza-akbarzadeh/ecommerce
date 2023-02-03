import {
  usePostIdsCreateOtpForRegisterMutation,
  usePostIdsValidateOTPForRegisterMutation,
} from '@hasty-bazar-commerce/core/utils/IdsApi'
import { HBFormHeader, HBTextFieldController } from '@hasty-bazar/auth'
import { HBCountDownTimer, HBIcon, HBSubmitButton } from '@hasty-bazar/core'
import { Alert, Box, inputBaseClasses, Stack, Typography, useTheme } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { AuthStateProps } from '../../AuthPage'
import AuthPageMessages from '../../AuthPage.messages'
import { ActionStyle } from './SignUpOtp.styles'

const SignUpOtp: FC<AuthStateProps> = (props) => {
  const theme = useTheme()
  const { formatMessage } = useIntl()
  const [time, setTime] = useState<number>(props.delayTimeForDataEntry)
  const { onChangeState } = props
  const { getValues, setValue, watch } = useFormContext()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const username = getValues('username')
  const otpWatch = watch('otp')
  const [createOtpMutate] = usePostIdsCreateOtpForRegisterMutation()
  const [validateOtpMutate, { isLoading }] = usePostIdsValidateOTPForRegisterMutation()

  const handleResendOTP = () => {
    setErrorMessage(undefined)
    setValue('otp', '')
    createOtpMutate({
      user: username,
    })
      .unwrap()
      .then(({ data }) => {
        if (data?.otpToken) {
          setTime(props.delayTimeForDataEntry)
          sessionStorage.setItem('otpToken', data.otpToken)
        } else {
          setErrorMessage(data?.message || formatMessage(AuthPageMessages.userCannotAccess))
        }
      })
      .catch((error) => {
        setErrorMessage(formatMessage(AuthPageMessages.faultMessage))
      })
  }

  const handleOtpCheck = async () => {
    setErrorMessage(undefined)
    const otpToken = sessionStorage.getItem('otpToken')
    const OTPCode = getValues('otp')
    validateOtpMutate({
      OTPCode,
      otpToken: otpToken!,
    })
      .unwrap()
      .then(({ data }) => {
        if (data?.success) {
          sessionStorage.setItem('changePasswordToken', data?.changePasswordToken)
          onChangeState('signUpInfo')
        } else {
          setErrorMessage(data?.error)
          setValue('otp', '')
        }
      })
  }

  useEffect(() => {
    if (!!errorMessage && otpWatch?.length > 1) {
      setErrorMessage(undefined)
    }
  }, [otpWatch])

  useEffect(() => {
    setTime(props.delayTimeForDataEntry)
  }, [props.delayTimeForDataEntry])

  return (
    <Box>
      <HBFormHeader
        title={formatMessage(AuthPageMessages.signUpOtpTitle)}
        subTitle={
          <Typography variant="overline" component="p">
            {formatMessage(AuthPageMessages.signUpOtpSubTitle, {
              username: (
                <Typography component="span" sx={{ color: 'grey.900' }} variant="subtitle2">
                  {getValues('username')}
                </Typography>
              ),
            })}
          </Typography>
        }
      />
      <HBTextFieldController
        name="otp"
        label={formatMessage(AuthPageMessages.otpCode)}
        mask={props.otpMask}
        sx={{
          [`& .${inputBaseClasses.input}`]: {
            direction: 'rtl',
          },
        }}
      />

      <Stack alignItems="flex-start" mt={6}>
        <HBCountDownTimer
          maximumShowed="minute"
          targetDate={time}
          linkText={formatMessage(AuthPageMessages.resendOtpCode)}
          extraTimerText={formatMessage(AuthPageMessages.untilResendOtpCode)}
          onClick={handleResendOTP}
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
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
      <ActionStyle>
        <HBSubmitButton
          buttonText={formatMessage(AuthPageMessages.nextStep)}
          backButtonText={formatMessage(AuthPageMessages.editNumber)}
          buttonOnClick={handleOtpCheck}
          backButtonOnclick={() => {
            setValue('otp', undefined)
            onChangeState('checkUserExistStep')
          }}
          buttonLoading={isLoading}
          buttonType={'submit'}
          sx={{ mt: 8 }}
          firstBtnDisable={watch('otp')?.length !== 6 || !!errorMessage}
          hasBackButtonIcon={false}
        />
      </ActionStyle>
    </Box>
  )
}

export default SignUpOtp

import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBCountDownTimer } from '@hasty-bazar/core'
import { Alert, Box, Grid, inputAdornmentClasses, Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import AccountMessages from '../../account.messages'
import { IChangeMobileNumberForm } from './ChangePhoneNumberDialog'

interface ICurrentMobileNumberOtpProps {
  close: () => void
  requestSuccess: () => void
  sendRequestFlag: number
}

const CurrentMobileNumberOtp: FC<ICurrentMobileNumberOtpProps> = (props) => {
  const { formatMessage } = useIntl()
  const getTimeOut = new Date().getTime() + 1000 * 60 * 2
  const { requestSuccess, close, sendRequestFlag } = props
  const { control, watch, setValue } = useFormContext<IChangeMobileNumberForm>()
  const [time, setTime] = useState<number>(getTimeOut)
  const [loading, setLoading] = useState<boolean>(false)
  const { data } = useSession()
  const user = data?.user ?? null
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    setValue('currentMobileNumberOtp', '')
  }, [])

  const sendRequest = () => {
    setErrorMessage('')
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_IDS}/api/AuthCustomer/ChangeUsernameValidateOTP`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        OTPCode: watch('currentMobileNumberOtp'),
        otpToken: sessionStorage.getItem('currentOtpToken')!,
        newMobileNo: `09${watch('newMobileNumber')}`,
      }),
    })
      .then((response) => response.json())
      .then(({ otpToken, error }) => {
        if (otpToken) {
          sessionStorage.setItem('newOtptpToken', otpToken)
          requestSuccess()
        } else {
          setErrorMessage(error)
          setValue('currentMobileNumberOtp', '')
        }
      })
      .catch((error) => {})
      .finally(() => setLoading(false))
  }

  const resendCodeHandler = () => {
    fetch(`${process.env.NEXT_PUBLIC_IDS}/api/AuthCustomer/CreateOtpForRegister`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        User: user?.userName,
      }),
    })
      .then((response) => response.json())
      .then(({ otpToken }) => {
        setTime(getTimeOut)
        if (otpToken) {
          sessionStorage.setItem('currentOtpToken', otpToken)
        } else {
        }
      })
      .catch((error) => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (sendRequestFlag) {
      sendRequest()
    }
  }, [sendRequestFlag])

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" color="text.primary">
        {formatMessage(AccountMessages.confirmCurrentPhoneNumber)}
      </Typography>
      <Typography color="text.secondary" variant="caption">
        {formatMessage(AccountMessages.toChangeToNewNumberShouldConfirmCurrentNumber)}
      </Typography>
      <Box />
      <HBTextFieldController
        name="currentMobileNumberOtp"
        label={formatMessage(AccountMessages.confirmCode)}
        mask="000000"
        type="number"
        sx={{
          '& input': { direction: 'rtl' },
          [`& .${inputAdornmentClasses.root}`]: {
            marginLeft: 0,
          },
        }}
      />
      <Box mt={6} display="flex" justifyContent={'space-between'} alignItems="center">
        <HBCountDownTimer
          targetDate={time}
          linkText={formatMessage(AccountMessages.sendCodeAgain)}
          extraTimerText={formatMessage(AccountMessages.untilReRequestingTheCode)}
          onClick={() => resendCodeHandler()}
          maximumShowed="minute"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& h5,& p': (theme) => ({
              ...theme.typography.body1,
              marginRight: 0,
            }),
          }}
        />
      </Box>
      <Box />
      {errorMessage && (
        <Alert variant="filled" severity="error">
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
      <Grid rowSpacing={1} container alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={6} sx={{ pr: { sm: 1, xs: 0 } }}>
          <HBButton fullWidth onClick={() => close()} variant="outlined" size="medium">
            {formatMessage(AccountMessages.cancel)}
          </HBButton>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ pl: { sm: 1, xs: 0 } }}>
          <HBButton
            fullWidth
            loading={loading}
            disabled={
              !watch('currentMobileNumberOtp') ||
              watch('currentMobileNumberOtp').length < 6 ||
              loading ||
              time === 0
            }
            type="submit"
            sx={{ fontSize: 14 }}
          >
            {formatMessage(AccountMessages.continue)}
          </HBButton>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default CurrentMobileNumberOtp

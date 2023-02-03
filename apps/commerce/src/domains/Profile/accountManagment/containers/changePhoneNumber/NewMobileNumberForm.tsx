import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton } from '@hasty-bazar/core'
import { Box, Grid, inputAdornmentClasses, Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import AccountMessages from '../../account.messages'
import { IChangeMobileNumberForm } from './ChangePhoneNumberDialog'

interface INewMobileNumberFormProps {
  requestSuccess: () => void
  close: () => void
  sendRequestFlag: number
}

const NewMobileNumberForm: FC<INewMobileNumberFormProps> = (props) => {
  const { formatMessage } = useIntl()
  const { requestSuccess, close, sendRequestFlag } = props
  const { data } = useSession()
  const user = data?.user ?? null

  const [loading, setLoading] = useState<boolean>(false)
  const { control, watch, setValue } = useFormContext<IChangeMobileNumberForm>()
  useEffect(() => {
    setValue('newMobileNumber', '')
  }, [])

  const sendRequest = () => {
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_IDS}/api/AuthCustomer/CreateOtpForRegister`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        User: user?.userName,
      }),
    })
      .then((response) => response.json())
      .then(({ otpToken }) => {
        if (otpToken) {
          sessionStorage.setItem('currentOtpToken', otpToken)
          requestSuccess()
        } else {
        }
      })
      .catch((error) => {})
      .finally(() => setLoading(false))
  }

  const handleDisable = useMemo(() => {
    if (!watch('newMobileNumber') || watch('newMobileNumber').length < 11 || loading) return true
  }, [watch('newMobileNumber'), watch('newMobileNumber'), loading])

  useEffect(() => {
    if (sendRequestFlag) {
      sendRequest()
    }
  }, [sendRequestFlag])

  return (
    <Box
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !handleDisable) {
          sendRequest()
        }
      }}
    >
      <Stack spacing={2}>
        <Typography variant="subtitle1" color="text.primary">
          {formatMessage(AccountMessages.editPhoneNumber)}
        </Typography>
        <Typography color="text.secondary" variant="caption">
          {formatMessage(AccountMessages.toEditPhoneNumberShouldConfirmNewAndCurrentPhoneNumber)}
        </Typography>
        <Box />
        <HBTextFieldController
          name="newMobileNumber"
          label={formatMessage(AccountMessages.newPhoneNumber)}
          mask="00000000000"
          type="number"
          sx={{
            '& input': { direction: 'rtl' },
            [`& .${inputAdornmentClasses.root}`]: {
              marginLeft: 0,
            },
          }}
        />
        <Box />
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
              disabled={handleDisable}
              sx={{ fontSize: 14 }}
              type="submit"
            >
              {formatMessage(AccountMessages.getConfirmCodeAndChangeNumber)}
            </HBButton>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}

export default NewMobileNumberForm

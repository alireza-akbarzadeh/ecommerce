import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { FC, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { AuthStateProps } from '../../AuthPage'
import AuthPageMessages from '../../AuthPage.messages'

const ForgetPasswordSuccess: FC<AuthStateProps> = (props) => {
  const { onChangeState } = props

  useEffect(() => {
    setTimeout(() => onChangeState('checkUserExistStep'), 3000)
  }, [])

  return (
    <Stack alignItems="center">
      <Typography color="success.main" variant="h4">
        <FormattedMessage {...AuthPageMessages.changePassSuccessfull} />
      </Typography>
      <Box sx={{ my: 8 }}>
        <HBIcon type="shieldCheck" size="large" sx={{ color: 'success.main' }} />
      </Box>
      <HBButton variant="text" sx={{ color: 'text.primary' }}>
        <FormattedMessage {...AuthPageMessages.goToSignInPage} />
      </HBButton>
    </Stack>
  )
}

export default ForgetPasswordSuccess

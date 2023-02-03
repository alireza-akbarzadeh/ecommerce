import { HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import AuthPageMessages from '../../AuthPage.messages'

const SignUpSuccess = () => {
  const router = useRouter()
  let timer: NodeJS.Timeout
  useEffect(() => {
    timer = setTimeout(() => router.push('/'), 6000)
  }, [])

  return (
    <Stack alignItems="center">
      <Typography color="success.main" variant="h4" className="success-signup">
        <FormattedMessage {...AuthPageMessages.signUpSuccessfull} />
      </Typography>
      <Typography color="text.primary" variant="body1" mt={6}>
        <FormattedMessage {...AuthPageMessages.goingBackStep} />
      </Typography>
      <Box sx={{ my: 8 }}>
        <HBIcon type="shieldCheck" size="large" sx={{ color: 'success.main' }} />
      </Box>

      <Typography
        variant="button"
        color="info.main"
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          clearTimeout(timer)
          router.push('/profile/managment')
        }}
      >
        <FormattedMessage {...AuthPageMessages.completeProfile} />
      </Typography>
    </Stack>
  )
}

export default SignUpSuccess

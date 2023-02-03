import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import useSignIn from '@hasty-bazar-commerce/domains/Auth/AuthServices/common/useSignIn'
import { HBLoginFormItem } from '@hasty-bazar/auth'
import { HBDialog, HBForm } from '@hasty-bazar/core'
import { Alert, Box, Typography } from '@mui/material'
import { FormPatternsEnums } from 'libs/core/src/enums'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import AuthPageMessages from '../../AuthPage.messages'

type LoginFormType = {
  password: string
  username: string
}

interface SignInModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const SignInModal: FC<SignInModalProps> = (props) => {
  const { formatMessage } = useIntl()
  const { open, onClose, onSuccess } = props
  const router = useRouter()
  const signInMutation = useSignIn()
  const clientSessionId = useClientSession()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const handleSubmit = (values: LoginFormType) => {
    setLoading(true)
    setErrorMessage(undefined)
    signInMutation({
      ...values,
      username: values.username,
      clientSessionId: clientSessionId!,
    })
      .then((res) => {
        setErrorMessage(undefined)
        setLoading(false)
        onSuccess()
        onClose()
      })
      .catch((error) => {
        setErrorMessage(error)
        setLoading(false)
      })
  }
  return (
    <HBDialog maxWidth="sm" fullWidth open={open} onBackdropClick={onClose} onClose={onClose}>
      <Box display="flex" justifyContent="center" mb={8}>
        <Box
          component="img"
          sx={{ objectFit: 'contain' }}
          src={'/assets/logo.png'}
          width={64}
          height={64}
          alt="logo"
        />
      </Box>
      {errorMessage && (
        <Alert variant="filled" severity="error" sx={{ m: 8 }}>
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
      <HBForm<LoginFormType> onSubmit={handleSubmit}>
        <HBLoginFormItem
          sx={{
            width: '100%',
            textAlign: 'center',
            px: 8,
            '& > div:nth-of-type(4)': {
              flexDirection: 'column',
              '& > button': { justifyContent: 'unset' },
            },
          }}
          usernamePattern={new RegExp(FormPatternsEnums.mobile)}
          headerTitle={formatMessage(AuthPageMessages.signInTitle)}
          headerSubTitle={formatMessage(AuthPageMessages.signInSubTitle)}
          emailFormInputMask="00000000000"
          emailFormLabel={formatMessage(AuthPageMessages.mobileNoLabel)}
          firstLinkOnclick={() => router.push('/auth/signin')}
          secondLinkOnclick={() => router.push('/auth/signin?signInWithOtp=true')}
          firstLinkText={formatMessage(AuthPageMessages.signUpLinkText)}
          firstBtnLoading={loading}
          secondLinkText={formatMessage(AuthPageMessages.loginWithOtp)}
        />
      </HBForm>
    </HBDialog>
  )
}

export default SignInModal

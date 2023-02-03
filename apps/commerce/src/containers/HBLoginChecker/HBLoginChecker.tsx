import SignInModal from '@hasty-bazar-commerce/domains/Auth/AuthPage/containers/SignInModal'
import { Box, SxProps } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, PropsWithChildren, useState } from 'react'

type HBLoginCheckerProps = {
  onSignedInAction: () => void
  triggerSignedInActionOnSeccessSignIn?: boolean
  onSuccessSignIn?: () => void
  sx?: SxProps
  disabled?: boolean
}

const HBLoginChecker: FC<PropsWithChildren<HBLoginCheckerProps>> = ({
  onSuccessSignIn,
  onSignedInAction,
  triggerSignedInActionOnSeccessSignIn,
  children,
  sx,
  disabled = false,
}) => {
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false)
  const { data } = useSession()

  const handleCheckUser = () => {
    if (disabled) return
    if (data?.accessToken) {
      onSignedInAction()
    } else {
      setShowSignInModal(true)
    }
  }

  const handleOnSuccess = () => {
    if (triggerSignedInActionOnSeccessSignIn) return onSignedInAction()
    onSuccessSignIn && onSuccessSignIn()
  }

  return (
    <>
      <Box onClick={handleCheckUser} sx={{ cursor: disabled ? 'not-allowed' : 'pointer', ...sx }}>
        {children}
      </Box>

      {showSignInModal && (
        <SignInModal open onClose={() => setShowSignInModal(false)} onSuccess={handleOnSuccess} />
      )}
    </>
  )
}

export default HBLoginChecker

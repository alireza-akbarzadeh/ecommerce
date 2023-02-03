import { HBLoading } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, ReactNode } from 'react'

export interface AuthProviderProps {
  children?: ReactNode
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { replace, asPath } = useRouter()

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      globalThis?.sessionStorage?.setItem?.('authReturnURL', asPath)
      // replace('/auth/signin')
    },
  })

  if (status !== 'authenticated') {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <HBLoading />
      </Box>
    )
  }

  return <>{children}</>
}

export default AuthProvider

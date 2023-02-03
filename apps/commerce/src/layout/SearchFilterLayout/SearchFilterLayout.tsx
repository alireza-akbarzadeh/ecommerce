import { HBDefaultFootter } from '@hasty-bazar-commerce/components'
import { Stack } from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import { FC, PropsWithChildren, useEffect } from 'react'
import Header from '../containers/Header'

const SearchProfileFilter: FC<PropsWithChildren> = ({ children }) => {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn()
    }
  }, [session])

  return (
    <Stack spacing={{ xs: 1, sm: 3, md: 0 }}>
      <Header />

      <Stack direction="row" justifyContent="center" bgcolor="grey.100">
        {children}
      </Stack>

      <HBDefaultFootter />
    </Stack>
  )
}

export default SearchProfileFilter

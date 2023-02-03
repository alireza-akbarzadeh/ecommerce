import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBToast } from '@hasty-bazar/core'
import { Box, styled, useTheme } from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar'
import React, { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { SideBar } from './SideBar'
import CustomAppBar from './DefaultLayout/components/CustomAppBar'

const Content = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(7),
  display: 'flex',
  flexDirection: 'column',
}))

const Layout: FC<PropsWithChildren<object>> = ({ children }) => {
  const { data: session } = useSession()

  const [show, setShow] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setShow(!show)
  }
  const { formatMessage } = useIntl()
  const theme = useTheme()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn()
    }
  }, [session])

  return (
    <>
      <NextNProgress
        color={theme.palette.primary.main}
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Box sx={{ height: '100vh' }}>
        <Head>
          <title>{formatMessage(phrasesMessages.hastiBazar)}</title>
        </Head>
        <CustomAppBar handleClick={handleClick} />

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', height: '100%' }}>
          <Box
            sx={{
              height: 'calc(100vh - 60px)',
              overflowY: 'auto',
              width: 300,
              mt: 15,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <SideBar searchValue={searchValue} onSearch={setSearchValue} />
          </Box>
          {show && (
            <Box
              sx={{
                height: 'calc(100vh - 60px)',
                overflowY: 'auto',
                width: 300,
                mt: 15,
                position: 'fixed',
                display: show ? 'block' : 'none',
                zIndex: (theme) => theme.zIndex.tooltip,
              }}
            >
              <SideBar searchValue={searchValue} onSearch={setSearchValue} />
            </Box>
          )}
          <Box
            sx={{
              pt: 15,
              flex: 1,
              height: '100%',
              overflow: 'auto',
            }}
          >
            <Content>{children}</Content>
          </Box>
        </Box>
      </Box>
      <HBToast />
    </>
  )
}

export default Layout

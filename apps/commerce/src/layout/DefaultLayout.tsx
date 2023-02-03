import { HBDefaultFootter, HBMenuFootter } from '@hasty-bazar-commerce/components'
import useMutationObserver from '@hasty-bazar-commerce/hooks/useMutationObserver'
import { SectionByContentQueryResult } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { Box, Stack, Theme, useMediaQuery } from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import DefaultBottomNavigation from './containers/DefaultBottomNavigation'
import Header from './containers/Header'

interface DefaultLayoutProps {
  topBanner?: SectionByContentQueryResult | null
  children?: ReactNode | undefined
  hideFooter?: boolean
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ children, hideFooter }) => {
  const { data: session } = useSession()
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const ref = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState('')

  const calculateHeight = () => {
    if (ref.current)
      setHeight(`${ref.current.children?.[0]?.getBoundingClientRect()?.height ?? 0}px`)
  }
  useMutationObserver(ref, calculateHeight)
  useEffect(() => {
    calculateHeight()
  }, [ref.current])

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn()
    }
  }, [session])

  return (
    <Stack
      sx={{
        marginBottom: isSmallScreen ? height : 0,
      }}
    >
      <Header />
      <Stack direction="row" justifyContent="center" bgcolor="grey.100">
        {children}
      </Stack>
      {!hideFooter && (
        <>
          <HBMenuFootter />
          <HBDefaultFootter />
        </>
      )}
      <Box ref={ref}>{isSmallScreen && <DefaultBottomNavigation />}</Box>
    </Stack>
  )
}

export default DefaultLayout

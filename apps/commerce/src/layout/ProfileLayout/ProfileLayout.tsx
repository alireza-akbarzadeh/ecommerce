import { HBDefaultFootter } from '@hasty-bazar-commerce/components'
import ResponsiveBackHeader from '@hasty-bazar-commerce/components/ResponsiveBackHeader/ResponsiveBackHeader'
import { ProfileBodyType } from '@hasty-bazar-commerce/domains/Profile/components/ProfileBody'
import SideBarMessages from '@hasty-bazar-commerce/domains/Profile/sideBar/SideBar.messages'
import useMutationObserver from '@hasty-bazar-commerce/hooks/useMutationObserver'
import { Box, Stack, Theme, useMediaQuery, useTheme } from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import DefaultBottomNavigation from '../containers/DefaultBottomNavigation'
import Header from '../containers/Header'

const ProfileLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: session } = useSession()
  const { query } = useRouter()
  const theme = useTheme()
  const { formatMessage } = useIntl()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const bigScreen = useMediaQuery(theme.breakpoints.up('md'))
  const profileQuery: ProfileBodyType | null = query?.profile?.[0] as ProfileBodyType

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

  const profileBody = {
    managment: formatMessage(SideBarMessages.accountManagment),
    address: formatMessage(SideBarMessages.address),
    favorite: formatMessage(SideBarMessages.favorites),
    saved: formatMessage(SideBarMessages.saved),
    wallet: formatMessage(SideBarMessages.wallet),
    voucher: formatMessage(SideBarMessages.voucher),
    'order-tracking': formatMessage(SideBarMessages.orders),
    comments: formatMessage(SideBarMessages.comments),
    ticketing: formatMessage(SideBarMessages.notes),
    'ticketing-create': formatMessage(SideBarMessages.notes),
    'ticketing-ticket': formatMessage(SideBarMessages.notes),
  }

  return (
    <Stack
      spacing={
        !profileQuery ? 0 : !!profileQuery && isMobile ? 1 : !!profileQuery && isTablet ? 4 : 0
      }
    >
      {!profileQuery || bigScreen ? <Header /> : <ResponsiveBackHeader />}

      <Stack
        direction="row"
        justifyContent="center"
        bgcolor="grey.100"
        mt={(theme) => ({
          sm: `0 !important`,
          xs: `${theme.spacing(0.5)} !important`,
        })}
        mb={{ xs: 13, sm: 13, md: 6 }}
      >
        {children}
      </Stack>

      {!isSmallScreen && <HBDefaultFootter />}
      <Box ref={ref}>{isSmallScreen && <DefaultBottomNavigation />}</Box>
    </Stack>
  )
}

export default ProfileLayout

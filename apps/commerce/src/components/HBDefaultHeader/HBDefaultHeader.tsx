import useGetMinimal from '@hasty-bazar-commerce/core/hook/useGetMinimal'
import { QuickBasket } from '@hasty-bazar-commerce/domains/Basket/quick-basket'
import AccountPopover from '@hasty-bazar-commerce/layout/containers/AccountPopover'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Badge, Box, Stack, styled } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import CommerceIconButton from '../CommerceIconButton'
import HBLink from '../HBLink'
import DefaultHeaderMessges from './DefaultHeader.messages'
import FavoriteButton from './FavoriteButton'

const HeaderStyle = styled('header')(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(4, 0, 0),
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: `${theme.breakpoints.values.lg}px`,
  margin: '0 auto',
  [theme.breakpoints.down(1163)]: {
    width: `calc(100% - ${theme.spacing(12)})`,
  },
}))

const HBLinkStyle = styled(HBLink)(({ theme }) => ({
  underline: 'none',
  color: theme.palette.text.secondary,
  padding: theme.spacing(2, 3),
  borderRadius: theme.spacing(2),
  '&:hover': {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.secondary.lighter,
  },
}))

const HBDefaultHeader: FC = () => {
  const session = useSession()
  const { push } = useRouter()
  const router = useRouter()

  const [openQuickBasket, setOpenQuickBasket] = useState<boolean>(false)

  const { data: minimalBasket } = useGetMinimal()

  return (
    <Box bgcolor="common.white" mb={-0.25} width="100%" order={1}>
      <HeaderStyle id="header">
        <Stack alignItems="center" columnGap={2} direction="row">
          <FavoriteButton />
        </Stack>
        <Stack spacing={9.5} direction="row" alignItems="center">
          <HBLink
            shallow
            href="/seller-landing"
            variant="subtitle2"
            underline="none"
            color="info.main"
          >
            <FormattedMessage {...DefaultHeaderMessges.saleInHit} />
          </HBLink>
          <HBLinkStyle shallow href="/discountDay" variant="subtitle2">
            <Stack alignItems="center" columnGap={2} direction="row">
              {router.pathname === '/discountDay' && (
                <Box sx={{ bgcolor: 'error.main', width: 8, height: 8, borderRadius: '50%' }} />
              )}
              <FormattedMessage {...DefaultHeaderMessges.dayDiscount} />
            </Stack>
          </HBLinkStyle>
          <HBLinkStyle shallow href="/best-sellers" variant="subtitle2">
            <Stack alignItems="center" columnGap={2} direction="row">
              {router.pathname === '/best-sellers' && (
                <Box sx={{ bgcolor: 'error.main', width: 8, height: 8, borderRadius: '50%' }} />
              )}
              <FormattedMessage {...DefaultHeaderMessges.mostSale} />
            </Stack>
          </HBLinkStyle>
          <HBLinkStyle shallow href="/faq" variant="subtitle2">
            <Stack alignItems="center" columnGap={2} direction="row">
              {router.pathname === '/faq' && (
                <Box sx={{ bgcolor: 'error.main', width: 8, height: 8, borderRadius: '50%' }} />
              )}
              <FormattedMessage {...DefaultHeaderMessges.help} />
            </Stack>
          </HBLinkStyle>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={3}>
          {minimalBasket?.totalCount ? (
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              max={999}
              badgeContent={minimalBasket?.totalCount ? minimalBasket?.totalCount.toString() : ''}
              color="error"
            >
              <CommerceIconButton
                onClick={() => setOpenQuickBasket(true)}
                icon={<HBIcon type="shoppingCart" sx={{ color: 'text.secondary' }} />}
              />
            </Badge>
          ) : (
            <CommerceIconButton
              onClick={() => setOpenQuickBasket(true)}
              icon={<HBIcon type="shoppingCart" sx={{ color: 'text.secondary' }} />}
            />
          )}

          {!session?.data?.accessToken ? (
            <HBButton
              onClick={() => push('/auth/signin')}
              variant="outlined"
              sx={{ minWidth: 'min-content' }}
            >
              <HBIcon type="user" sx={{ color: 'grey.500' }} />
            </HBButton>
          ) : (
            <AccountPopover />
          )}
        </Stack>
      </HeaderStyle>
      {openQuickBasket && (
        <QuickBasket open={openQuickBasket} setClose={() => setOpenQuickBasket(false)} />
      )}
    </Box>
  )
}

export default HBDefaultHeader

import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebIdrCustomersByMobileQuery } from '@hasty-bazar-commerce/layout/ProfileLayout/profile.enhanced'
import { useGetWebPaymentWalletBalanceQuery } from '@hasty-bazar-commerce/Service-Enhancers/PaymentApi.enhanced'
import { BasketSubjectFuncs } from '@hasty-bazar-commerce/subjects/BasketSubjects'
import { commafy, HBButton } from '@hasty-bazar/core'
import { Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { ProfileAvatar } from '../components'
import { ProfileBodyType } from '../components/ProfileBody'
import DepositDialog from '../wallet/containers/DepositDialog'
import SideBarMessages from './SideBar.messages'
import SideBarItem from './SideBarItem'

interface ProfileSideBarProps {
  isSmallWidth: boolean
}

const ProfileSideBar: FC<ProfileSideBarProps> = ({ isSmallWidth }) => {
  const { data } = useSession()
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const { data: userData } = useGetWebIdrCustomersByMobileQuery({
    ...ApiConstants,
    mobile: data?.user?.userName!,
  })
  const user = userData?.data ?? null
  const { query } = useRouter()
  const [profileBody, setProfileBody] = useState<ProfileBodyType | null>(null)
  const [openDeposit, setOpenDeposit] = useState<boolean>(false)

  const { data: walletData } = useGetWebPaymentWalletBalanceQuery(
    {
      ...ApiConstants,
    },
    { skip: !user?.partyId },
  )
  useEffect(() => {
    if (query?.profile?.[0]) {
      setProfileBody(query.profile[0] as ProfileBodyType)
    } else if (!(query?.profile?.[0] as ProfileBodyType) && !isSmallWidth) {
      setProfileBody('managment')
    } else {
      setProfileBody('')
    }
  }, [query, isSmallWidth])

  const isActive = (body: ProfileBodyType) => {
    if (body === profileBody) {
      return true
    }
    return false
  }

  return (
    <Stack spacing={4} sx={{ width: !isSmallWidth ? 264 : '100%' }}>
      <Stack
        sx={{ bgcolor: 'background.paper', borderRadius: 2, py: 6, width: '100%', px: 4 }}
        alignItems="center"
        spacing={6}
      >
        <ProfileAvatar />
        <Typography variant="h6" color="grey.700">
          {`${user?.firstName} ${user?.lastName}`}
        </Typography>

        <Stack spacing={3} alignItems="center">
          <Stack direction="row" alignItems="center">
            <Typography sx={{ mr: 1 }} variant="subtitle2" color="text.secondary">
              <FormattedMessage {...SideBarMessages.accountBalanceTitle} />
            </Typography>
            <Typography variant="subtitle2" color="info.main">
              <FormattedMessage
                {...SideBarMessages.accountBalanceValue}
                values={{
                  value: commafy(walletData?.data?.value),
                  unit: walletData?.data?.currencyTitle,
                }}
              />
            </Typography>
          </Stack>
          <HBButton variant="outlined" size="small" onClick={() => setOpenDeposit(true)}>
            <Typography variant="overline">
              <FormattedMessage {...SideBarMessages.addCredit} />
            </Typography>
          </HBButton>
        </Stack>
      </Stack>
      <Stack
        sx={{ bgcolor: 'background.paper', borderRadius: 2, width: '100%', py: 4 }}
        spacing={4}
      >
        <SideBarItem
          bodyLink="managment"
          active={isActive('managment')}
          icon="user"
          title={<FormattedMessage {...SideBarMessages.accountManagment} />}
          hasDivider
        />
        <SideBarItem
          bodyLink="wallet"
          active={isActive('wallet')}
          icon="moneyWithdraw"
          title={<FormattedMessage {...SideBarMessages.wallet} />}
          hasDivider
        />
        <SideBarItem
          icon="shoppingBag"
          title={<FormattedMessage {...SideBarMessages.orders} />}
          hasDivider
          bodyLink="order-tracking"
          active={isActive('order-tracking')}
        />
        <SideBarItem
          icon="locationPoint"
          title={<FormattedMessage {...SideBarMessages.address} />}
          hasDivider
          active={isActive('address')}
          bodyLink="address"
        />
        {breakpointDownMd && (
          <>
            <SideBarItem
              icon="tagAlt"
              title={<FormattedMessage {...SideBarMessages.favorites} />}
              hasDivider
              active={isActive('favorite')}
              bodyLink="favorite"
            />
            <SideBarItem
              icon="heart"
              title={<FormattedMessage {...SideBarMessages.saved} />}
              hasDivider
              active={isActive('saved')}
              bodyLink="saved"
            />
          </>
        )}
        <SideBarItem
          bodyLink="comments"
          icon="chat"
          title={<FormattedMessage {...SideBarMessages.comments} />}
          hasDivider
          active={isActive('comments')}
        />
        <SideBarItem
          bodyLink="voucher"
          icon="label"
          title={<FormattedMessage {...SideBarMessages.voucher} />}
          hasDivider
          active={isActive('voucher')}
        />
        <SideBarItem
          active={isActive('ticketing')}
          bodyLink="ticketing"
          icon="notes"
          title={<FormattedMessage {...SideBarMessages.notes} />}
          hasDivider
        />
        {/* <SideBarItem
          active={false}
          icon="setting"
          title={<FormattedMessage {...SideBarMessages.setting} />}
          hasDivider
        /> */}
        <SideBarItem
          active={false}
          icon="export"
          title="خروج"
          onClick={async () => {
            await signOut({ redirect: false })
            BasketSubjectFuncs.signOut()
            const channel = new BroadcastChannel(process.env.HASTI_BROADCAST_NAME!)
            channel.postMessage(true)
          }}
          iconSx={{ transform: 'rotate(90deg)' }}
        />
      </Stack>
      {openDeposit && <DepositDialog onClose={() => setOpenDeposit(false)} />}
    </Stack>
  )
}

export default ProfileSideBar

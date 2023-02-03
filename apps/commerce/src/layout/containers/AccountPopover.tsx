import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCmsContentsByEntityTypeIdAndEntityIdQuery } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { useGetWebGeneralDataRecentSearchQuery } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { useGetWebIdrCustomersByMobileQuery } from '@hasty-bazar-commerce/services/idrApi.generated'
import { useLazyGetWebPaymentWalletBalanceQuery } from '@hasty-bazar-commerce/services/paymentApi.generated'
import { BasketSubjectFuncs } from '@hasty-bazar-commerce/subjects/BasketSubjects'
import { UserAvatarSubjectFuncs } from '@hasty-bazar-commerce/subjects/UserAvatarSubject'
import { HBIcon, HBMenu } from '@hasty-bazar/core'
import { Avatar, Box, listClasses, menuClasses, Stack, styled, Typography } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import AccountPopoverMessages from './AccountPopover.messages'

const ItemStackStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  width: '100%',
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
}))

export default function AccountPopover() {
  const { formatMessage } = useIntl()
  const { push, replace } = useRouter()
  const { status: userLoginStatus, data } = useSession({ required: true })
  const user = data?.user ?? null
  const [filePath, setFilePath] = useState<string>('')

  const { data: userData } = useGetWebIdrCustomersByMobileQuery({
    ...ApiConstants,
    mobile: data?.user?.userName!,
  })

  const { data: { data: { queries: recentSuggestions = [] } = {} } = {} } =
    useGetWebGeneralDataRecentSearchQuery({
      ...ApiConstants,
    })

  const { refetch, data: contents } = useGetWebCmsContentsByEntityTypeIdAndEntityIdQuery(
    {
      ...ApiConstants,
      entityId: user?.partyId!,
      entityTypeId: 3001,
      factor: 'ProfileImage',
    },
    { skip: !user },
  )

  const [getWalletBalance, { data: walletData }] = useLazyGetWebPaymentWalletBalanceQuery()

  useEffect(() => {
    refetch()
    const subscription = UserAvatarSubjectFuncs.getCreatedAvatar().subscribe((res: string) => {
      setFilePath(res)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (contents?.data?.items) {
      const tempContents = contents?.data?.items
      const lastFile = contents.data?.items[tempContents.length - 1]
      if (lastFile) {
        setFilePath(`${process.env.NEXT_PUBLIC_CDN}${lastFile.value!}`)
      }
    }
  }, [contents])

  const handleWalletBalance = () => {
    getWalletBalance({
      ...ApiConstants,
    })
  }

  return (
    <HBMenu
      elevation={9}
      contentComponentType="div"
      sx={{ height: 56, minWidth: 'max-content' }}
      menuSx={{
        [`& .${menuClasses.paper}`]: { minWidth: 220, '& li': { py: 0 } },
        [`& .${listClasses.root}`]: { py: 0 },
      }}
      BackdropProps={{
        sx: { backgroundColor: 'transparent' },
      }}
      content={
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          sx={{ cursor: 'pointer' }}
          onClick={handleWalletBalance}
        >
          <Avatar
            src={filePath || ''}
            sx={{
              '& img': {
                objectPosition: 'center',
              },
            }}
          />
          <Typography variant="subtitle2" color="text.primary">
            {userData?.data?.firstName + ' '} {userData?.data?.lastName}
          </Typography>
          <HBIcon sx={{ color: 'grey.500' }} type="angleDown" />
        </Stack>
      }
      menus={[
        {
          content: (
            <ItemStackStyle direction="row" alignItems="center" spacing={3}>
              <Avatar
                src={filePath || ''}
                sx={{
                  width: 30,
                  height: 30,
                  '& img': {
                    objectPosition: 'center',
                  },
                }}
              />
              <Typography variant="subtitle2" color="grey.700">
                {userData?.data?.firstName} {userData?.data?.lastName}
              </Typography>
            </ItemStackStyle>
          ),
          onClick: () => push('/profile'),
        },
        {
          content: (
            <ItemStackStyle
              direction="row"
              alignItems="center"
              spacing={3}
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Box color="grey.500">
                  <HBIcon type="moneyWithdraw" />
                </Box>
                <Typography variant="subtitle2" color="grey.700">
                  {formatMessage(AccountPopoverMessages.wallet)}
                </Typography>
              </Stack>
              <Typography variant="subtitle2" color="info.main">
                <FormattedMessage
                  {...AccountPopoverMessages.walletBalance}
                  values={{
                    balance: (walletData?.data?.value ?? 0).toLocaleString(),
                    currency: walletData?.data?.currencyTitle,
                  }}
                />
              </Typography>
            </ItemStackStyle>
          ),
          onClick: () => push('/profile/wallet'),
        },
        {
          content: (
            <ItemStackStyle direction="row" alignItems="center" spacing={3}>
              <Image src="/assets/svg/shoppingBag.svg" width={24} height={24} />
              <Typography variant="subtitle2" color="grey.700">
                {formatMessage(AccountPopoverMessages.orders)}
              </Typography>
            </ItemStackStyle>
          ),
          onClick: () => push('/profile/order-tracking/current'),
        },
        {
          content: (
            <ItemStackStyle direction="row" alignItems="center" spacing={3}>
              <Box color="grey.500">
                <HBIcon type="chat" />
              </Box>
              <Typography variant="subtitle2" color="grey.700">
                {formatMessage(AccountPopoverMessages.comments)}
              </Typography>
            </ItemStackStyle>
          ),
          onClick: () => push('/profile/comments'),
        },
        {
          content: (
            <ItemStackStyle direction="row" alignItems="center" spacing={3}>
              <Image src="/assets/svg/logOut.svg" width={24} height={24} />
              <Typography variant="subtitle2" color="grey.700">
                {formatMessage(AccountPopoverMessages.logoutFromSystem)}
              </Typography>
            </ItemStackStyle>
          ),
          onClick: async () => {
            let everyRecentSuggestion: string[] = []
            recentSuggestions?.forEach((item) => {
              everyRecentSuggestion.push(item?.title!)
            })

            const joinedRecentSuggestions = everyRecentSuggestion.join(',')

            localStorage.setItem('recentSearches', joinedRecentSuggestions?.toString())

            await signOut({ redirect: false })
            BasketSubjectFuncs.signOut()
            const channel = new BroadcastChannel(process.env.HASTI_BROADCAST_NAME!)
            channel.postMessage(true)
          },
        },
      ]}
    />
  )
}

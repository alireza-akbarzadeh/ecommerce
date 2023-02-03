import { CommerceTabs, ICommerceTabItem, Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebSaleVoucherPartyByPartyIdQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { Stack, styled, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import VoucherMessages from './Voucher.messages'
import VoucherItem from './VoucherItem'

const ContainerStyle = styled(Stack)({
  height: '100vh',
  overflowY: 'scroll',
  msOverflowStyle: 'none',
  // '-ms-overflow-style': 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

const Voucher: FC = () => {
  const { data } = useSession()
  const { data: voucherData, refetch } = useGetWebSaleVoucherPartyByPartyIdQuery(
    {
      ...ApiConstants,
      partyId: data?.user.partyId ?? '',
    },
    { skip: !data?.user.partyId },
  )

  useEffect(() => {
    refetch()
  }, [data?.user.partyId])

  const activeVouchers = useMemo(
    () => voucherData?.data?.items && voucherData?.data?.items?.filter((item) => item?.isActive),
    [voucherData],
  )
  const deActiveVouchers = useMemo(
    () => voucherData?.data?.items && voucherData?.data?.items?.filter((item) => !item?.isActive),
    [voucherData],
  )

  const tabs: ICommerceTabItem[] = [
    {
      tabLabel: (
        <Typography variant="button">
          <FormattedMessage {...VoucherMessages.activeVouchers} />
        </Typography>
      ),
      tabIcon: 'searchAlt',
      tabPanel: (
        <ContainerStyle spacing={6} py={8}>
          {activeVouchers?.length ? (
            activeVouchers.map((item) => {
              return <VoucherItem key={item.id} content={item} />
            })
          ) : (
            <Nothing />
          )}
        </ContainerStyle>
      ),
    },
    {
      tabLabel: (
        <Typography variant="button">
          <FormattedMessage {...VoucherMessages.deActiveVouchers} />
        </Typography>
      ),
      tabIcon: 'store',
      tabPanel: (
        <ContainerStyle spacing={6} py={8}>
          {deActiveVouchers?.length ? (
            deActiveVouchers.map((item) => {
              return <VoucherItem key={item.id} content={item} expire />
            })
          ) : (
            <Nothing />
          )}
        </ContainerStyle>
      ),
    },
  ]

  return <CommerceTabs tabs={tabs} />
}

export default Voucher

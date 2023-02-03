import { CommerceIconButton, Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebSaleOrdersSearchByFilterKeyQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBButton, HBIcon, HBLoading, HBTextField } from '@hasty-bazar/core'
import { InputAdornment, Stack, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { OrderTrackingDetailBodyHOC } from '../components'
import { CommerceSection } from '../OrderTracking'
import OrderTrackingMessages from '../orderTracking.messages'
import { OrderTrackingConsignmentBodyStyles } from '../OrderTracking.styles'
import {
  RenderCanceledList,
  RenderCurrentList,
  RenderDeliveredList,
  RenderRefundedList,
} from './render-items'

const OrderTrackingSearch: FC = () => {
  const { back, query, replace } = useRouter()
  const { formatMessage } = useIntl()
  const {
    isFetching,
    data: searchedData,
    error: searchedError,
  } = useGetWebSaleOrdersSearchByFilterKeyQuery(
    {
      ...ApiConstants,
      filterKey: (query.search as string) ?? '',
    },
    { skip: !query.search },
  )
  const [filterKey, setFilterKey] = useState<string>((query.search as string) ?? '')
  const { data } = useSession()

  const handleSearch = () => {
    if (!data?.user.partyId) return
    replace(
      { pathname: '/profile/order-tracking/search', query: { search: filterKey } },
      `/profile/order-tracking/search?search=${filterKey}`,
      { shallow: true },
    )
  }

  const hasData = useMemo(() => {
    return searchedData?.data?.searchResult?.flatMap((i) => i.result).some((i) => i)
  }, [searchedData?.data?.searchResult])

  const currentData = useMemo(() => {
    return (
      searchedData?.data?.searchResult?.find((i) => i.section === CommerceSection.current)
        ?.result ?? []
    )
  }, [searchedData?.data?.searchResult])

  const cancelData = useMemo(() => {
    return (
      searchedData?.data?.searchResult?.find((i) => i.section === CommerceSection.canceled)
        ?.result ?? []
    )
  }, [searchedData?.data?.searchResult])

  const deliverData = useMemo(() => {
    return (
      searchedData?.data?.searchResult?.find((i) => i.section === CommerceSection.delivered)
        ?.result ?? []
    )
  }, [searchedData?.data?.searchResult])

  const refundData = useMemo(() => {
    return (
      searchedData?.data?.searchResult?.find((i) => i.section === CommerceSection.refunded)
        ?.result ?? []
    )
  }, [searchedData?.data?.searchResult])

  return (
    <OrderTrackingDetailBodyHOC>
      <OrderTrackingConsignmentBodyStyles
        sx={{ backgroundColor: 'common.white', border: 'none!important' }}
        spacing={3}
      >
        <Stack direction="row" justifyContent="flex-end">
          <HBButton onClick={() => back()} variant="text" sx={{ gap: 3, color: 'grey.700' }}>
            <Typography variant="button">
              <FormattedMessage {...OrderTrackingMessages.back} />
            </Typography>
            <HBIcon type="arrowLeft" />
          </HBButton>
        </Stack>
        <HBTextField
          sx={{ width: '100%', fontSize: 14 }}
          placeholder={formatMessage({ ...OrderTrackingMessages.idOrProductName })}
          variant="outlined"
          value={filterKey}
          onChange={(e) => setFilterKey(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <CommerceIconButton
                  onClick={() => handleSearch()}
                  icon={
                    <HBIcon
                      sx={{ color: (theme) => `${theme.palette.grey[900]}!important` }}
                      type="searchAlt"
                    />
                  }
                />
              </InputAdornment>
            ),
          }}
        />

        {!isFetching && (
          <>
            <RenderCurrentList orders={currentData} />
            <RenderDeliveredList orders={deliverData} />
            <RenderRefundedList orders={refundData} />
            <RenderCanceledList orders={cancelData} />
          </>
        )}

        {!isFetching && (!!searchedError || !hasData) && (
          <Stack alignItems="center" justifyContent="center">
            <Nothing />
          </Stack>
        )}

        {isFetching && (
          <Stack alignItems="center" justifyContent="center">
            <HBLoading />
          </Stack>
        )}
      </OrderTrackingConsignmentBodyStyles>
    </OrderTrackingDetailBodyHOC>
  )
}

export default OrderTrackingSearch

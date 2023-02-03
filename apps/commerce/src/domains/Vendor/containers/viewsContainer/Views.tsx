import { CommerceLoading } from '@hasty-bazar-commerce/components'
import { HBInfiniteScroll } from '@hasty-bazar-commerce/components/HBInfiniteScroll'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { IFilterParams } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { useGetWebCatalogVendorsByIdSellerPageUserCommentsQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { useGetWebSocialCommentsSellerPageCommentsQuery } from '@hasty-bazar-commerce/services/socialApi.generated'
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Pagination from 'libs/core/src/components/HBAgGrid/HBAgGridPagination'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import VendorMessages from '../../Vendor.messages'
import Comment from './components/Comment'
import Info from './components/Info'
import Score from './components/Score'

const PAGE_SIZE = 10

function Views() {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const params: Partial<IFilterParams> = Object.entries(router.query).reduce(
    (prev, [key, value]) => {
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        prev = { ...prev, [key]: JSON.parse(value) }
      } else prev = { ...prev, [key]: value }
      return prev
    },
    {},
  )
  const vendorId = params?.baseFilter?.vendors?.[0] ?? ''
  const breakpointSmUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  const [pageNumber, setPageNumber] = useState(0)

  const handlePagination = (page: number) => {
    setPageNumber(page - 1)
  }

  const {
    data: sellerPageComments,
    refetch: refetchComment,
    isLoading,
  } = useGetWebSocialCommentsSellerPageCommentsQuery({
    ...ApiConstants,
    vendorId,
    pageSize: PAGE_SIZE,
    pageNumber,
  })

  const { data: sellerPageUserComments } = useGetWebCatalogVendorsByIdSellerPageUserCommentsQuery(
    {
      ...ApiConstants,
      id: vendorId,
    },
    {
      skip: !vendorId,
    },
  )

  const sellerPageUserCommentsChartItems = useMemo(() => {
    return sellerPageUserComments?.data?.chartItems?.map(({ title, percentage }) => ({
      title,
      value: percentage,
    })) as Array<{ title: string; value: number }>
  }, [sellerPageUserComments?.data?.chartItems])

  const smUpDataMapping = () => {
    return (
      <Grid item xs={12}>
        {sellerPageComments?.data?.items?.map((comment) => (
          <Comment key={comment.id} commentData={comment} refetch={refetchComment} />
        ))}

        {!sellerPageComments?.data?.items?.length && (
          <Typography sx={{ mt: 10 }}> {formatMessage(VendorMessages.noComment)} </Typography>
        )}
      </Grid>
    )
  }

  if (isLoading) return <CommerceLoading />
  return (
    <Grid
      container
      xs={12}
      spacing={4}
      m={'auto'}
      sx={{ backgroundColor: 'common.white', p: 6, mb: 6, borderRadius: { md: 2, xs: 0 } }}
    >
      {/* FIXME commented for current state of product */}
      {/* <Grid item container xs={12} sm={9} p={`${0} !important`}>
        <Grid item xs={12} sm={4}>
          <Score
            captionNumber={sellerPageUserComments?.data?.commentCount ?? 0}
            score={sellerPageUserComments?.data?.rate ?? 0}
            storeName={sellerPageUserComments?.data?.storeName ?? ''}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <HBProgresses progresses={sellerPageUserCommentsChartItems} />
        </Grid>
        <Divider sx={{ borderColor: 'grey.200', width: '100%', height: 0 }} />
      </Grid> */}

      <Grid container xs={12} sm={9}>
        <Grid item xs={12} sm={4} pl={`${0} !important`} pr={{ sm: 6, xs: 0 }}>
          <Stack gap={4} mt={4}>
            <Score
              captionNumber={sellerPageUserComments?.data?.commentCount ?? 0}
              score={sellerPageUserComments?.data?.rate ?? 0}
              storeName={sellerPageUserComments?.data?.storeName ?? ''}
            />
            {/* FIXME commented for current state of product */}
            {/* <Score
              captionNumber={sellerPageUserComments?.data?.satisfiedWithTheSeller || 0}
              isSeller
              score={sellerPageUserComments?.data?.vendorRate || 0}
              storeName={sellerPageUserComments?.data?.storeName ?? ''}
            /> */}

            <Divider sx={{ borderColor: 'grey.200', width: '100%', height: 0 }} />

            <Info
              registerDate={sellerPageUserComments?.data?.vendorStoreInHastiBazar?.storeCreateDate!}
              storeTitle={sellerPageUserComments?.data?.storeName!}
              buyersNumber={
                String(sellerPageUserComments?.data?.vendorStoreInHastiBazar?.customerCount || 0)!
              }
              readyToSellProductsNumber={
                String(
                  sellerPageUserComments?.data?.vendorStoreInHastiBazar?.salableProductCount || 0,
                )!
              }
              validSellNumber={
                String(sellerPageUserComments?.data?.vendorStoreInHastiBazar?.successfulOrder || 0)!
              }
            />

            {/* <Divider sx={{ borderColor: 'grey.200', width: '100%', height: 0 }} />

              <Contact
                storeTitle={sellerPageUserComments?.storeName!}
                connection={sellerPageUserComments?.connection ?? {}}
              /> */}
          </Stack>
        </Grid>
        <Grid container xs={12} sm={8}>
          {!breakpointSmUp ? (
            <HBInfiniteScroll
              allCount={(sellerPageComments?.data?.totalItems as number) ?? 0}
              refetchCallback={(p) => handlePagination(p)}
              customLoading={<CircularProgress />}
              scrollUntilPage={(sellerPageComments?.data?.totalItems as number) > 12 ? 2 : 1}
              pageNum={sellerPageComments?.data?.pageNumber}
            >
              {smUpDataMapping()}
            </HBInfiniteScroll>
          ) : (
            <>
              {smUpDataMapping()}
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                {!!sellerPageComments?.data?.items?.length && (
                  <Pagination
                    totalRows={sellerPageComments?.data?.totalItems ?? 0}
                    onChange={handlePagination}
                    onChangeClient={(_, page) => handlePagination(page)}
                    options={{ hideselectPage: true }}
                    pageSize={PAGE_SIZE}
                    wrapperSx={{ border: 'none' }}
                  />
                )}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Views

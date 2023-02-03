import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { IFilterParams } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { TabType } from '@hasty-bazar-commerce/domains/Vendor/VendorPage'
import { useGetWebCatalogVendorsByIdSellerPageDescQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBButton } from '@hasty-bazar/core'
import { Box, Divider, Grid, Paper, Stack, Theme, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import VendorMessages from '../../../Vendor.messages'
import HBProgresses from '../../viewsContainer/components/HBProgresses'

interface VendorVitrinDescProps {
  isActive?: boolean
  onChangeTab: (tab: TabType) => void
}

export const VendorVitrinDesc = ({ isActive = false, onChangeTab }: VendorVitrinDescProps) => {
  const router = useRouter()
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
  const { data } = useGetWebCatalogVendorsByIdSellerPageDescQuery({
    ...ApiConstants,
    id: vendorId,
  })

  const breakpointSmUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const sellerChartItems = useMemo(() => {
    return data?.data?.chartItems?.map(({ title, percentage }) => ({
      title,
      value: percentage,
    })) as Array<{ title: string; value: number }>
  }, [data?.data?.chartItems])
  return (
    <Box maxWidth="lg" sx={{ p: 0, m: 0 }}>
      <Stack
        width={'100%'}
        component={Paper}
        elevation={0}
        alignContent="center"
        p={{ sm: 6, xs: 4 }}
        borderRadius={{ md: 2, xs: 0 }}
        mb={{ md: 4, xs: 2 }}
        flexDirection={{ sm: 'row' }}
        gap={6}
      >
        <Box width={'100%'}>
          <Box
            marginBottom={5}
            width={'100%'}
            height={200}
            overflow={'hidden'}
            position={'relative'}
          >
            <Box
              component={'div'}
              dangerouslySetInnerHTML={{ __html: data?.data?.textOnlyDescription || '' }}
            ></Box>
            <Box
              sx={{
                height: 60,
                width: '100%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,1))',
                mt: -3,
                position: 'absolute',
                bottom: 0,
              }}
            />
          </Box>
          {data?.data?.textOnlyDescription && (
            <HBButton
              variant="outlined"
              size="small"
              onClick={() => {
                onChangeTab('store')
              }}
              sx={(theme) => ({
                color: `${theme.palette.info.main} !important`,
                borderColor: `${theme.palette.info.main} !important`,
              })}
            >
              <FormattedMessage {...VendorMessages.viewStore} />
            </HBButton>
          )}
        </Box>
        <Divider
          sx={{ borderColor: 'grey.200', width: !breakpointSmUp ? '100%' : 'unset' }}
          orientation={breakpointSmUp ? 'vertical' : 'horizontal'}
          flexItem
        />
        <Grid item md={8} xs={12}>
          <HBProgresses progresses={sellerChartItems} />
        </Grid>
      </Stack>
    </Box>
  )
}

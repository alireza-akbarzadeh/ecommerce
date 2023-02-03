import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { IFilter, IFilterParams } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { useGetWebCatalogVendorsByIdSellerPageHeaderQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBBadge, HBIcon, HBIconButton } from '@hasty-bazar/core'
import {
  Box,
  debounce,
  Grid,
  inputBaseClasses,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useRouter } from 'next/router'
import { parseUrl } from 'query-string'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import VendorMessages from '../../Vendor.messages'
import { HBVendorStyledTextField } from '../../VendorToolbar/VendorToolbar.styles'

interface IProps {
  totalResultQty: number
  setDrawerOpen(v: boolean): void
  setSortDrawerOpen(v: boolean): void
  sortDrawerOpen: boolean
  sortBy: string
  filterItems: IFilter[]
}
const VendorSearch = ({
  setSortDrawerOpen,
  filterItems,
  sortBy,
  setDrawerOpen,
  totalResultQty,
}: IProps) => {
  const breakpointUpSm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const breakpointUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { formatMessage } = useIntl()

  const params: IFilterParams = parseUrl(decodeURIComponent(router.asPath), {
    arrayFormat: 'index',
  }).query as any
  const vendorId = JSON.parse(params?.baseFilter as string)?.vendors?.[0]
  useEffect(() => {
    if (!breakpointUpSm) {
      params.query ? setShowSearch(true) : setShowSearch(false)
    }
  }, [params.query])

  const handleShowSearch = () => {
    searchRef.current?.focus()
    setShowSearch(!showSearch)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(
      {
        pathname: `/vendor/`,
        query: {
          ...(e.target.value ? { query: e.target.value } : {}),
          baseFilter: params?.baseFilter as any,
        },
      },
      undefined,
      { shallow: true },
    )
  }
  const { data: { data } = {} } = useGetWebCatalogVendorsByIdSellerPageHeaderQuery({
    ...ApiConstants,
    id: vendorId,
  })
  return (
    <Grid
      container
      alignItems="center"
      px={{ sm: 4, md: 0 }}
      sx={{
        justifyContent: { xs: 'space-between', sm: 'space-between', md: 'flex-start' },
        gap: 4,
        height: '100%',
      }}
    >
      <Stack
        flexDirection={'row'}
        flex={{ xs: showSearch ? 1 : 1, sm: 1 }}
        gap={breakpointUpSm ? 2 : 0}
        height={'100%'}
      >
        <Box
          position={'relative'}
          flex={{ xs: showSearch ? 1 : 0, sm: 1 }}
          alignItems={'center'}
          height={'100%'}
          display={'flex'}
          justifyContent={{ xs: !showSearch ? 'center' : 'normal', sm: 'flex-start' }}
        >
          {!breakpointUpSm ? (
            <HBIconButton
              sx={{
                color: (theme) => theme.palette.common.black,
                opacity: { xs: showSearch ? 0 : 1, sm: 1 },
                border: 'none',
                zIndex: 2,
              }}
              onClick={handleShowSearch}
              icon="searchAlt"
            />
          ) : null}
          <HBVendorStyledTextField
            inputRef={searchRef}
            isShowSearch={showSearch}
            sx={{
              flex: { xs: `${showSearch ? 1 : 1}`, sm: 1 },
              display: { xs: showSearch ? 'flex' : '', sm: 'flex' },
              width: { xs: showSearch ? '100%' : 0, sm: '100%' },
              opacity: { xs: showSearch ? 1 : 0, sm: 1 },
              height: '100%',
              justifyContent: 'center',
              [`& .${inputBaseClasses.input}`]: {
                width: { xs: !showSearch ? 0 : '100%', sm: '100%' },
                transition: 'flex 0.2s',
              },
            }}
            onBlur={() => setShowSearch(false)}
            defaultValue={params.query}
            placeholder={formatMessage(VendorMessages.searchPlaceholder)}
            onChange={debounce(handleOnChange, 500)}
            InputProps={{
              endAdornment: (
                <Box
                  p={`${0} !important`}
                  sx={{ cursor: 'auto', color: 'common.black' }}
                  display={'flex'}
                  alignItems={'center'}
                  onClick={() => {
                    searchRef && searchRef.current?.focus()
                  }}
                >
                  <HBIcon size="small" type="searchAlt" />
                </Box>
              ),
            }}
          />
        </Box>
        <Box
          sx={{
            display: { xs: `${showSearch ? 'none' : 'flex'}`, sm: 'flex' },
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
            pl: 2,
            flex: 1,
          }}
        >
          <Typography variant="h6">{totalResultQty}</Typography>
          <Typography variant="subtitle2">
            {params?.query
              ? formatMessage(VendorMessages.resultFor)
              : formatMessage(VendorMessages.result)}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              width: { xs: 100, sm: 240, md: 180 },
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {params.query || data?.storeName}
          </Typography>
        </Box>
      </Stack>
      {!breakpointUpMd && (
        <Stack flexDirection={'row'} gap={2}>
          <HBBadge
            color="error"
            variant="dot"
            onClick={() => setSortDrawerOpen(true)}
            invisible={!sortBy}
          >
            <HBIcon type="sortAmountDown" sx={{ color: 'grey.500' }} />
          </HBBadge>
          <HBBadge
            color="error"
            variant="dot"
            sx={{ ml: 1 }}
            onClick={() => setDrawerOpen(true)}
            invisible={filterItems?.length > 0}
          >
            <HBIcon type="filter" sx={{ color: 'grey.500' }} />
          </HBBadge>
        </Stack>
      )}
    </Grid>
  )
}

export default VendorSearch

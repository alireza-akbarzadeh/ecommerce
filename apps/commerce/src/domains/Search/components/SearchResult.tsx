import SignInModal from '@hasty-bazar-commerce/domains/Auth/AuthPage/containers/SignInModal'
import CardWidgetCustom from '@hasty-bazar-commerce/domains/Landing/components/CardWidgetCustom'
import ProductCardSkeleton from '@hasty-bazar-commerce/domains/Landing/loadingPage/components/productCardSkeleton'
import VendorSearch from '@hasty-bazar-commerce/domains/Vendor/containers/storeContainer/VendorSearch'
import { DolphinSavedSearchQueryResultListApiResult } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { CollectionData, HBButton, HBIcon, HBLoading } from '@hasty-bazar/core'
import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Pagination from 'libs/core/src/components/HBAgGrid/HBAgGridPagination'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import SearchMessages from '../Search.messages'
import { IFilter, IFilterParams } from '../searchFilterModels'
import ShowResult from './ShowResult'
import SortFilter from './SortFilter'

interface IProps {
  data: CollectionData[] | undefined
  pageSize: number
  handlePagination(page: number, p?: 'infinite' | 'pagination'): void
  totalResultQty: number
  handleModifyQuery(id?: string): void
  setDrawerOpen(v: boolean): void
  handleSorting(value: string): void
  sortingItems: { title: string; value: string | number }[]
  page: number
  setSortDrawerOpen(v: boolean): void
  sortDrawerOpen: boolean
  savedQueryData?: DolphinSavedSearchQueryResultListApiResult
  modifyQueryLoading: boolean
  filterLoading: boolean
  sortBy: string
  filterItems: IFilter[]
  params: IFilterParams
  setPaginationMode: Dispatch<SetStateAction<'infinite' | 'pagination'>>
  paginationMode: 'infinite' | 'pagination'
}
const SearchResult: FC<IProps> = ({
  data,
  pageSize,
  handlePagination,
  totalResultQty,
  handleModifyQuery,
  handleSorting,
  sortingItems,
  page,
  setSortDrawerOpen,
  sortDrawerOpen,
  savedQueryData,
  modifyQueryLoading,
  filterLoading,
  sortBy,
  filterItems,
  setDrawerOpen,
  params,
  setPaginationMode,
  paginationMode,
}) => {
  const breakpointSmUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const { formatMessage } = useIntl()
  const { spacing } = useTheme()
  const router = useRouter()
  const isVendor = useMemo(() => router?.pathname?.includes('vendor'), [])
  const { status } = useSession()
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const queryId = useRef<string>()

  const savedQuery = useMemo(() => {
    return savedQueryData?.data?.find((item) => item.query === router.asPath)
  }, [router.asPath, savedQueryData])

  const handleQuery = () => {
    if (status === 'unauthenticated') setOpenLoginModal(true)
    handleModifyQuery(queryId.current)
  }

  const resultSkeleton = useMemo(() => {
    return (
      filterLoading &&
      (paginationMode === 'pagination' || page === 1) &&
      Array.from({ length: 12 }).map?.((_, idx) => (
        <Grid item xs={12} sm={4} md={4} key={idx} container justifyContent="center">
          <ProductCardSkeleton />
        </Grid>
      ))
    )
  }, [filterLoading])

  const resultMapping =
    resultSkeleton ||
    data?.map?.((item, index) => (
      <Grid
        item
        xs={12}
        sm={4}
        md={4}
        key={(item?.id ?? '') + index}
        sx={({ palette }) => ({
          pb: 5,
          borderBottom: `1px solid ${palette.grey[100]}`,
        })}
      >
        <CardWidgetCustom
          data={{ ...item, imageUrl: process.env.NEXT_PUBLIC_CDN! + item?.imageUrl! }}
          type="SEARCH_AND_COLLECTION_RESULT"
          noDivider={!((index + 1) % 3)}
        />
      </Grid>
    ))

  const noResult = useMemo(() => {
    return (
      <>
        <Box
          sx={{
            mt: 10,
            mx: { xs: 2, sm: 'auto' },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Image src="/assets/noResult.png" alt="" height={83} width={100} />
        </Box>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Typography color={'grey.400'} variant="subtitle2">
            <FormattedMessage {...SearchMessages.noResult} />
          </Typography>
        </Box>
      </>
    )
  }, [])

  return (
    <>
      <Grid item xs={12} sm={12} md={9} sx={{ pr: { xs: 0, sm: 0, md: 4, lg: 0 } }}>
        <Stack
          id="searchResultHeader"
          justifyContent={{ xs: 'center', md: 'space-between' }}
          alignItems={{ xs: isVendor ? 'center' : 'start', md: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          gap={4}
          height={{ xs: isVendor ? 60 : 44, md: 60 }}
          sx={{
            backgroundColor: 'common.white',
            borderRadius: { xs: 0, md: spacing(2) },
            mb: { xs: 2, sm: 2, md: isVendor ? 2 : 14, lg: 2 },
            px: { xs: 3, sm: 0, md: isVendor ? 4 : 6, lg: isVendor ? 4 : 6 },
          }}
        >
          {isVendor && (
            <VendorSearch
              filterItems={filterItems}
              setDrawerOpen={setDrawerOpen}
              setSortDrawerOpen={setSortDrawerOpen}
              sortBy={sortBy}
              sortDrawerOpen={sortDrawerOpen}
              totalResultQty={totalResultQty}
            />
          )}
          {!isVendor && (
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                justifyContent: { xs: 'space-between', sm: 'space-between', md: 'flex-start' },
                gap: 4,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  pl: 2,
                }}
              >
                {filterLoading ? (
                  <Skeleton width={150} height={40} variant="text" />
                ) : (
                  <>
                    <Typography variant="h6">{totalResultQty}</Typography>
                    {router.asPath.startsWith('/search') ? (
                      <>
                        <Typography variant="subtitle2">
                          {formatMessage(SearchMessages.resultFor)}
                        </Typography>
                        <Typography variant="h6">
                          {params?.query?.replace?.(/['"]+/g, '')}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="subtitle2">
                        {formatMessage(SearchMessages.result)}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
              {router.asPath.startsWith('/search') &&
                (filterLoading ? (
                  <Skeleton width={200} height={40} variant="text" />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                    }}
                  >
                    {modifyQueryLoading ? (
                      <HBLoading />
                    ) : (
                      <HBButton
                        variant="text"
                        startIcon={
                          savedQuery ? (
                            <Image
                              width={14}
                              height={20}
                              src="/assets/svg/orangeFilledBookmark.svg"
                              alt=""
                            />
                          ) : (
                            <HBIcon type="bookmark" sx={{ color: 'primary.main' }} />
                          )
                        }
                        onClick={() => {
                          queryId.current = savedQuery?.id
                          handleQuery()
                        }}
                        sx={{ borderRadius: spacing(1), ml: 3 }}
                      >
                        <Typography sx={{ color: 'primary.main' }}>
                          {savedQuery ? (
                            <FormattedMessage {...SearchMessages.savedSearch} />
                          ) : (
                            <FormattedMessage {...SearchMessages.saveSearchFilter} />
                          )}
                        </Typography>
                      </HBButton>
                    )}
                  </Box>
                ))}
            </Stack>
          )}
          <SortFilter
            {...{
              sortingItems,
              handleSorting,
              sortDrawerOpen,
              setSortDrawerOpen,
              sortBy,
            }}
          />
        </Stack>
        <Box
          sx={{
            backgroundColor: 'common.white',
            borderRadius: { xs: 0, sm: 0, md: spacing(2), lg: spacing(2) },
            pb: 6,
            mb: { xs: 2, sm: 2, md: 10, lg: 10 },
            pt: { xs: 4, md: 0 },
          }}
        >
          {+totalResultQty > 0 && (
            <ShowResult
              {...{
                pageSize,
                handlePagination,
                totalResultQty,
                page,
                paginationMode,
                resultMapping,
              }}
            />
          )}
          {+totalResultQty > 0 &&
            !filterLoading &&
            Boolean(data) &&
            (page >= 3 || paginationMode === 'pagination') && (
              <Box
                sx={{
                  mt: 10,
                  mx: { xs: 2, sm: 'auto' },
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  '& #gridPaginationWrapper': {
                    border: 'none',
                  },
                }}
              >
                <Pagination
                  totalRows={+totalResultQty}
                  onChange={(page) => {
                    setPaginationMode('pagination')
                    handlePagination(page, 'pagination')
                  }}
                  options={{ hideselectPage: true, hideGoto: !breakpointSmUp }}
                  pageSize={pageSize}
                  pageNumber={page}
                />
              </Box>
            )}
          {+totalResultQty === 0 && !filterLoading && data?.length === 0 ? (
            noResult
          ) : (
            <Grid
              container
              rowGap={{ xs: 5, sm: 10 }}
              sx={{ p: { md: 4 }, px: { xs: 4, md: 'unset' }, mt: { xs: 0, md: 'unset' } }}
            >
              {resultSkeleton}
            </Grid>
          )}
        </Box>
      </Grid>
      <SignInModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onSuccess={() => handleQuery()}
      />
    </>
  )
}

export default SearchResult

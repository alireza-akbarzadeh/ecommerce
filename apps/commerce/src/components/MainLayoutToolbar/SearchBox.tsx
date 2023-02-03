import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import RenderDynamicSection from '@hasty-bazar-commerce/domains/Landing/components/RenderDynamicSection'
import useToast from '@hasty-bazar-commerce/hooks/useToast'
import {
  DolphinSavedSearchQueryResult,
  Suggest,
  useDeleteWebCatalogSaveSearchMutation,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { useGetWebCmsPagesPlatformTypeByPlatformTypeNameAndNameQuery } from '@hasty-bazar-commerce/services/cmsApi.generated'
import {
  QueryResult,
  useDeleteWebGeneralDataRecentSearchMutation,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { recentSearchesStorage } from '@hasty-bazar-commerce/utils/recentSearchesStorage'
import { HBDialog, HBIcon, HBLoading } from '@hasty-bazar/core'
import { Box, Grid, Popper, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { forwardRef, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import MainLayoutToolbarMessages from './MainLayoutToolbar.messages'
import { SEARCH_LENGTH } from './MainLayoutToolbarSearch'

type SearchBoxProps = {
  allItems: boolean
  menuItemId: any
  searchValue: string
  cursor: number
  suggestionList: Suggest | null
  recentSuggestions: QueryResult[] | null
  savedSearch: DolphinSavedSearchQueryResult[] | null
  recentSuggestionRefetch: VoidFunction
  savedSearchRefetch: VoidFunction
  suggestionListIsFetching: boolean
}

const SearchBox = forwardRef(
  (
    {
      allItems,
      menuItemId,
      searchValue = '',
      cursor,
      suggestionList,
      recentSuggestions,
      savedSearch,
      recentSuggestionRefetch,
      savedSearchRefetch,
      suggestionListIsFetching,
    }: SearchBoxProps,
    ref,
  ) => {
    const { showToast } = useToast()
    const router = useRouter()
    const routeCategories = router.query?.baseFilter
      ? JSON.parse(router.query?.baseFilter! as string)?.categories?.[0]
      : ''
    const { formatMessage } = useIntl()
    const { palette } = useTheme()
    const { status: userLoginStatus, data: userData } = useSession()

    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    useEffect(() => {
      setAnchorEl(ref as unknown as HTMLElement | null)
    }, [ref])

    const openSearchBox = Boolean(anchorEl)

    const [removeSavedSearchItem, setRemoveSavedSearchItem] = useState<string>('')
    const [savedSearchItemName, setSavedSearchItemName] = useState<string>('')
    const [deleteSavedSearchMutation] = useDeleteWebCatalogSaveSearchMutation()
    const [deleteRecentSearchMutation] = useDeleteWebGeneralDataRecentSearchMutation()

    const handleSavedSearchDelete = async (id: string) => {
      try {
        await deleteSavedSearchMutation({
          ...ApiConstants,
          id,
        }).unwrap()
        showToast(
          formatMessage(MainLayoutToolbarMessages.removedText, { type: 'جستجو پین شده' }),
          'success',
        )
        savedSearchRefetch()
      } catch {}
    }

    const [recentSearches, setRecentSearches] = useState<string[]>([])

    const handleRecentSearchDelete = async (item: string, type: 'localStorage' | 'serverSide') => {
      if (type === 'localStorage') {
        const recentSearches = localStorage.getItem('recentSearches')
        const recentSearchesArray = recentSearches?.length ? recentSearches?.split(',') : []
        const index = recentSearchesArray.indexOf(item)
        recentSearchesArray.splice(index, 1)
        localStorage.setItem('recentSearches', recentSearchesArray.toString())
        setRecentSearches(recentSearchesArray)
      } else if (type === 'serverSide') {
        try {
          await deleteRecentSearchMutation({
            ...ApiConstants,
            id: item,
          }).unwrap()
          showToast(
            formatMessage(MainLayoutToolbarMessages.removedText, {
              type: formatMessage(MainLayoutToolbarMessages.searchHistory),
            }),
            'success',
          )
          recentSuggestionRefetch()
        } catch {}
      }
    }

    useEffect(() => {
      const recentSearches = localStorage.getItem('recentSearches')
      const recentSearchesArray = recentSearches?.length ? recentSearches?.split(',') : []
      const includedRecentSearchesArray = recentSearchesArray.filter((recentSearch) =>
        recentSearch.includes(searchValue),
      )
      setRecentSearches(includedRecentSearchesArray)
    }, [router.query.query, searchValue])

    const { data: searchBoxSections } = useGetWebCmsPagesPlatformTypeByPlatformTypeNameAndNameQuery(
      {
        ...ApiConstants,
        name: 'Header_Search',
        platformType: 1021001,
      },
    )

    return (
      <Popper
        sx={{
          position: 'relative',
          zIndex: 1000,
          width: mdUp
            ? Number(anchorEl?.clientWidth) + (searchValue?.length > 0 ? 45 : 20)
            : '100%',
        }}
        open={openSearchBox}
        anchorEl={anchorEl}
        placement={'bottom-start'}
      >
        <Box
          sx={{
            p: 5,
            mt: 1,
            bgcolor: 'common.white',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            boxShadow: ' 0px 16px 32px rgba(0, 0, 0, 0.08)',
            height: 'auto',
            maxHeight: '50vh',
            overflowY: 'auto',
          }}
        >
          {/**
           * TODO: Login Status
           */}
          {userLoginStatus !== 'authenticated' && (
            <Typography
              sx={{
                mb: 4,
                color: palette.info.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexDirection: 'row',
                cursor: 'pointer',
              }}
              onClick={() => router.push('/auth/signin/')}
            >
              <HBIcon type="userCheck" />
              {formatMessage(MainLayoutToolbarMessages.registerText)}
            </Typography>
          )}

          {/**
           * TODO: Recent Searches
           */}
          <Box
            sx={{
              borderBottom:
                userLoginStatus !== 'authenticated' && recentSearches?.length
                  ? 1
                  : userLoginStatus === 'authenticated' && recentSuggestions?.length
                  ? 1
                  : 0,
              borderBottomColor: 'grey.200',
              pb:
                userLoginStatus !== 'authenticated' && recentSearches?.length
                  ? 4
                  : userLoginStatus === 'authenticated' && recentSuggestions?.length
                  ? 4
                  : 0,
            }}
          >
            {userLoginStatus !== 'authenticated' && recentSearches?.length ? (
              <Typography color={'gray'} sx={{ mb: 4 }}>
                {formatMessage(MainLayoutToolbarMessages.recentSearchesText)}
              </Typography>
            ) : userLoginStatus === 'authenticated' && recentSuggestions?.length ? (
              <Typography color={'gray'} sx={{ mb: 4 }}>
                {formatMessage(MainLayoutToolbarMessages.recentSearchesText)}
              </Typography>
            ) : null}

            {userLoginStatus !== 'authenticated' &&
              recentSearches?.map((item, index) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 4,
                    my: 2,
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: ({ spacing }) => spacing(1),
                    backgroundColor: cursor === index ? 'grey.100' : 'Transparent',
                  }}
                >
                  <Box
                    onClick={() => {
                      router.push({
                        pathname: '/search',
                        query: {
                          query: JSON.stringify(item),
                          ...(menuItemId
                            ? {
                                baseFilter: JSON.stringify({
                                  categories: [menuItemId?.id],
                                }),
                              }
                            : routeCategories && !allItems && router.pathname.startsWith('search')
                            ? {
                                baseFilter: JSON.stringify({
                                  categories: [routeCategories],
                                }),
                              }
                            : {}),
                        },
                      })

                      setAnchorEl(null)
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <HBIcon type={'clock'} sx={{ color: 'grey.500' }} />
                      <Typography>{item}</Typography>
                    </Box>
                  </Box>

                  <Box onClick={() => handleRecentSearchDelete(item, 'localStorage')}>
                    <HBIcon type={'times'} sx={{ color: 'grey.500' }} />
                  </Box>
                </Box>
              ))}

            {userLoginStatus === 'authenticated' &&
              recentSuggestions?.map((item, index) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 4,
                    my: 2,
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: ({ spacing }) => spacing(1),
                    backgroundColor: cursor === index ? 'grey.100' : 'Transparent',
                  }}
                >
                  <Box
                    onClick={() => {
                      router.push({
                        pathname: '/search',
                        query: {
                          query: JSON.stringify(item?.title!),
                          ...(menuItemId
                            ? {
                                baseFilter: JSON.stringify({
                                  categories: [menuItemId?.id],
                                }),
                              }
                            : routeCategories && !allItems && router.pathname.startsWith('search')
                            ? {
                                baseFilter: JSON.stringify({
                                  categories: [routeCategories],
                                }),
                              }
                            : {}),
                        },
                      })

                      setAnchorEl(null)
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}
                    >
                      <HBIcon type={'clock'} sx={{ color: 'grey.500' }} />
                      <Typography>{item?.title!}</Typography>
                    </Box>
                  </Box>

                  <Box onClick={() => handleRecentSearchDelete(item?.id!, 'serverSide')}>
                    <HBIcon type={'times'} sx={{ color: 'grey.500' }} />
                  </Box>
                </Box>
              ))}
          </Box>

          {/**
           * Pinned Searches
           */}
          {userLoginStatus === 'authenticated' && (
            <Box
              sx={{
                borderBottom: userLoginStatus === 'authenticated' && savedSearch?.length ? 1 : 0,
                borderBottomColor: 'grey.200',
                pb: 4,
                mt:
                  userLoginStatus !== 'authenticated' && recentSearches?.length
                    ? 4
                    : userLoginStatus === 'authenticated' && recentSuggestions?.length
                    ? 4
                    : 0,
              }}
            >
              {userLoginStatus === 'authenticated' && savedSearch?.length ? (
                <Typography color={'gray'} sx={{ mb: 4 }}>
                  {formatMessage(MainLayoutToolbarMessages.pinnedQueriesText)}
                </Typography>
              ) : null}

              {savedSearch?.map((item, index) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 4,
                    my: 2,
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: ({ spacing }) => spacing(1),
                    backgroundColor:
                      cursor ===
                      index +
                        (userLoginStatus !== 'authenticated'
                          ? recentSearches?.length!
                          : recentSuggestions?.length!)
                        ? 'grey.100'
                        : 'Transparent',
                  }}
                >
                  <Box
                    onClick={() => {
                      if (userLoginStatus !== 'authenticated') recentSearchesStorage(item?.title!)

                      router.push(item?.query!)

                      setAnchorEl(null)
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <HBIcon type={'heart'} sx={{ color: 'grey.500' }} />
                      <Typography>{item?.title}</Typography>
                    </Box>
                  </Box>

                  <Box
                    onClick={() => {
                      setRemoveSavedSearchItem(item?.id!)
                      setSavedSearchItemName(item?.title!)
                    }}
                  >
                    <HBIcon type={'times'} sx={{ color: 'grey.500' }} />
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/**
           * TODO: In Products & Categories
           */}
          {searchValue.toString().length > SEARCH_LENGTH && (
            <Grid container>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  borderBottom: 1,
                  borderBottomColor: 'grey.200',
                  borderRight: mdUp ? 1 : 0,
                  borderRightColor: 'grey.200',
                }}
              >
                <Box sx={{ p: 4 }}>
                  <Typography sx={{ mb: 4, textAlign: 'center', fontWeight: 'medium' }}>
                    {formatMessage(MainLayoutToolbarMessages.inProductsText)}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {suggestionListIsFetching && <HBLoading sx={{ mb: 4 }} />}
                  </Box>

                  {suggestionList?.querysuggestions?.map((item, index) => (
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: ({ spacing }) => spacing(1),
                        backgroundColor:
                          cursor ===
                          index +
                            (userLoginStatus !== 'authenticated'
                              ? recentSearches?.length!
                              : recentSuggestions?.length!) +
                            savedSearch?.length!
                            ? 'grey.100'
                            : 'Transparent',
                      }}
                      onClick={() => {
                        if (userLoginStatus !== 'authenticated')
                          recentSearchesStorage(item?.expression!)

                        router.push({
                          pathname: '/search',
                          query: {
                            query: JSON.stringify(item?.expression),
                            ...(menuItemId
                              ? {
                                  baseFilter: JSON.stringify({
                                    categories: [menuItemId?.id],
                                  }),
                                }
                              : routeCategories && !allItems && router.pathname.startsWith('search')
                              ? {
                                  baseFilter: JSON.stringify({
                                    categories: [routeCategories],
                                  }),
                                }
                              : {}),
                          },
                        })

                        setAnchorEl(null)
                      }}
                    >
                      <Box sx={{ my: 2, cursor: 'pointer' }}>
                        <Typography component="span" sx={{ mr: 1 }}>
                          {item?.expression}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  {suggestionList?.categories?.map((item, index) => (
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: ({ spacing }) => spacing(1),
                      }}
                      onClick={() => {
                        if (userLoginStatus !== 'authenticated') recentSearchesStorage(searchValue)

                        router.push({
                          pathname: '/search',
                          query: {
                            query: suggestionList.bestkeyword
                              ? JSON.stringify(suggestionList.bestkeyword)
                              : JSON.stringify(searchValue),
                            baseFilter: JSON.stringify({ categories: [item?.id] }),
                          },
                        })

                        setAnchorEl(null)
                      }}
                    >
                      <Box
                        sx={{
                          my: 2,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography>
                          {`${
                            suggestionList.bestkeyword ? suggestionList.bestkeyword : searchValue
                          } ${formatMessage(MainLayoutToolbarMessages.inCategory)}`}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'info.main' }}>
                          {item?.title}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  borderBottom: 1,
                  borderBottomColor: 'grey.200',
                }}
              >
                <Box sx={{ p: 4 }}>
                  <Typography sx={{ mb: 4, textAlign: 'center', fontWeight: 'medium' }}>
                    {formatMessage(MainLayoutToolbarMessages.inCategoriesText)}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {suggestionListIsFetching && <HBLoading sx={{ mb: 4 }} />}
                  </Box>

                  {suggestionList?.categories?.map((item, index) => (
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: ({ spacing }) => spacing(1),
                      }}
                      onClick={() => {
                        router.push({
                          pathname: '/collection',
                          query: {
                            baseFilter: JSON.stringify({ categories: [item?.id] }),
                          },
                        })

                        setAnchorEl(null)
                      }}
                    >
                      <Box sx={{ my: 2, cursor: 'pointer' }}>
                        <Typography>{item?.title}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}

          {/**
           * TODO: Banner
           */}
          {searchBoxSections?.data?.pageParts?.[0]?.sections?.length && (
            <RenderDynamicSection sections={searchBoxSections?.data?.pageParts?.[0]?.sections} />
          )}
        </Box>

        <HBDialog
          content={formatMessage(MainLayoutToolbarMessages.dialogTitle, {
            type: formatMessage(MainLayoutToolbarMessages.pin),
            searchItem: savedSearchItemName,
          })}
          onAccept={() => {
            handleSavedSearchDelete(removeSavedSearchItem)
            setRemoveSavedSearchItem('')
          }}
          onReject={() => {
            setRemoveSavedSearchItem('')
          }}
          open={Boolean(removeSavedSearchItem)}
          onClose={() => setRemoveSavedSearchItem('')}
          acceptBtn={formatMessage(MainLayoutToolbarMessages.acceptText)}
          rejectBtn={formatMessage(MainLayoutToolbarMessages.rejectText)}
        />
      </Popper>
    )
  },
)

export default SearchBox

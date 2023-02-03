import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { IFilterParams } from '@hasty-bazar-commerce/domains/Search/searchFilterModels'
import { useSpeechRecognition } from '@hasty-bazar-commerce/hooks/useSpeechRecognition'
import {
  GetCategoriesQueryResult,
  useGetWebCatalogCategoriesGetAllCategoriesForCommerceQuery,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { SectionByContentQueryResult } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { recentSearchesStorage } from '@hasty-bazar-commerce/utils/recentSearchesStorage'
import { HBButton, HBIcon, HBTextField, openToast } from '@hasty-bazar/core'
import {
  Box,
  ClickAwayListener,
  MenuItem,
  outlinedInputClasses,
  Stack,
  textFieldClasses,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { parseUrl } from 'query-string'
import { Ref, useEffect, useMemo, useState, useRef } from 'react'
import { useIntl } from 'react-intl'
import MainLayoutToolbarMessages from './MainLayoutToolbar.messages'
import { HBButtonStyle, MenuStyle, Styles } from './MainLayoutToolbarSearch.style'
import SearchBox from './SearchBox'
import { useSearchBoxData } from './useSearchBoxData'

export const SEARCH_LENGTH = 2

const { info } = console

type MainLayoutToolbarSearchProps = {
  sections: SectionByContentQueryResult[] | null
}

const MainLayoutToolbarSearch = ({ sections }: MainLayoutToolbarSearchProps) => {
  const router = useRouter()

  const { formatMessage } = useIntl()
  const breakpointUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const { data } = useGetWebCatalogCategoriesGetAllCategoriesForCommerceQuery(
    {
      ...ApiConstants,
      pageSize: 1000,
    },
    { skip: !breakpointUpMd },
  )

  const parentCategories = data?.data?.items?.filter(
    (_) => !_.parentId,
  ) as GetCategoriesQueryResult[]

  /**
   *
   *
   * TODO: Search
   *
   *
   */

  const params: IFilterParams = parseUrl(decodeURIComponent(router.asPath), {
    arrayFormat: 'index',
  }).query as any
  const searchQuery = params.query?.replace?.(/['"]+/g, '')

  const [search, setSearch] = useState<string>('')
  const [searchValue, setSearchValue] = useState<string>('')
  const [searchBoxRef, setSearchBoxRef] = useState<HTMLElement | null>(null)
  const [menuItem, setMenuItem] = useState<string>('')
  const [allItems, setAllItems] = useState<boolean>(false)

  const textFieldRef = useRef(null)

  const { status: userLoginStatus } = useSession()

  const routeCategories = router.query?.baseFilter
    ? JSON.parse(router.query?.baseFilter! as string)?.categories?.[0]
    : ''

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      setSearchValue(search!)
    }, 300)

    return () => clearTimeout(debounceSearch)
  }, [search])

  const [openSearchBox, setOpenSearchBox] = useState<boolean>(false)
  const [cursor, setCursor] = useState<number>(-1)

  useEffect(() => {
    if (searchBoxRef === null) setCursor(-1)
  }, [searchBoxRef])

  const [searchResult, setSearchResult] = useState<Array<string>>([])

  const {
    suggestionList,
    suggestionListIsFetching,
    recentSuggestions,
    recentSuggestionsIsFetching,
    recentSuggestionRefetch,
    savedSearch,
    savedSearchIsFetching,
    savedSearchRefetch,
  } = useSearchBoxData({
    searchValue,
  })

  useEffect(() => {
    const recentSearches = localStorage.getItem('recentSearches')
    const recentSearchesArray = recentSearches?.length ? recentSearches?.split(',') : []
    const includedRecentSearchesArray = recentSearchesArray.filter((recentSearch) =>
      recentSearch.includes(searchValue),
    )
    let querySuggestions: Array<string> = []
    suggestionList?.querysuggestions?.forEach((i) => querySuggestions.push(i?.expression!))

    if (userLoginStatus !== 'authenticated') {
      if (searchValue?.toString()?.length > SEARCH_LENGTH) {
        setSearchResult([...includedRecentSearchesArray, ...querySuggestions])
      } else {
        setSearchResult([...includedRecentSearchesArray])
      }
    }

    if (userLoginStatus === 'authenticated') {
      let serverRecentSuggestions: Array<string> = []
      recentSuggestions?.forEach((i) => serverRecentSuggestions.push(i?.title!))
      let serverSavedSearches: Array<string> = []
      savedSearch?.forEach((i) => serverSavedSearches.push(i?.title!))

      if (searchValue?.toString()?.length > SEARCH_LENGTH) {
        setSearchResult([...serverRecentSuggestions, ...serverSavedSearches, ...querySuggestions])
      } else {
        setSearchResult([...serverRecentSuggestions, ...serverSavedSearches])
      }
    }
  }, [searchValue, suggestionListIsFetching, recentSuggestionsIsFetching, savedSearchIsFetching])

  const menuItemId: any = useMemo(() => {
    return parentCategories?.find((_) => _?.name === menuItem)
  }, [menuItem])

  useEffect(() => {
    if (!router.asPath.startsWith('/vendor')) setSearch(searchQuery!)
  }, [searchQuery])

  const isSearchPage = router.asPath?.includes('search')
  useEffect(() => {
    if (data?.data?.items?.length) {
      if (routeCategories && isSearchPage) {
        const foundCategory = data?.data?.items?.find((category) => category.id === routeCategories)
        const isParentCategory = foundCategory?.parentId === null
        if (!isParentCategory) {
          const parentCategory = data?.data?.items?.find(
            (category) => category.id === foundCategory?.parentId,
          )
          if (parentCategory?.name) {
            setMenuItem(parentCategory?.name)
          }
        }
      }
    }
  }, [routeCategories, data?.data?.items, isSearchPage])

  /**
   *
   *
   * FIXME: Speech Recognition
   *
   *
   */

  const [speechRecognitionConstructor, speechRecognitionState] = useSpeechRecognition()

  if (speechRecognitionState) {
    speechRecognitionConstructor.onerror = function (event: any) {
      openToast({
        message: formatMessage(MainLayoutToolbarMessages.tryAgain),
        type: 'error',
      })

      // TODO: Check Speech Recognition Error on Some Devices
      info(event)
    }

    speechRecognitionConstructor.onresult = function (event: any) {
      let content = ''
      content += event.results[event.resultIndex][0].transcript

      setSearch(content)
      setSearchBoxRef(textFieldRef.current!)
      setOpenSearchBox(true)
    }
  }

  const startMic = (event: any) => {
    event.preventDefault()
    event.stopPropagation()

    if (speechRecognitionState) {
      speechRecognitionConstructor.start()
    }
  }

  return (
    <Stack direction="row" sx={{ flex: 1 }}>
      {breakpointUpMd && (
        <>
          <HBButton size="large" sx={Styles.hbMenu} onClick={handleClick} variant="text">
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                gap: (theme) => theme.spacing(2),
              }}
            >
              <Typography variant="caption" color="text.primary">
                {menuItem.length
                  ? menuItem
                  : routeCategories && isSearchPage
                  ? parentCategories?.find((i) => i.id === routeCategories)?.name
                  : formatMessage(MainLayoutToolbarMessages.category)}
              </Typography>
              <HBIcon sx={{ color: 'grey.500', mt: 2 }} type="angleDown" size="small" />
            </Stack>
          </HBButton>
          <MenuStyle
            disableScrollLock
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 300,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setMenuItem('همه موارد')
                setAllItems(true)
                handleClose()
              }}
            >
              <Typography variant={'subtitle2'} color={'grey.700'}>
                {formatMessage(MainLayoutToolbarMessages.selectAll)}
              </Typography>
            </MenuItem>

            {parentCategories?.map((item) => (
              <MenuItem
                onClick={() => {
                  setMenuItem(item?.name!)
                  setAllItems(false)
                  handleClose()
                }}
                className={item.parentId ? 'item' : ''}
                key={item.id}
              >
                <Typography variant={'subtitle2'} color={'grey.700'}>
                  {item.name}
                </Typography>
              </MenuItem>
            ))}
          </MenuStyle>
        </>
      )}
      <ClickAwayListener
        onClickAway={() => {
          setOpenSearchBox(false)
          setSearchBoxRef(null)
        }}
      >
        <Box sx={{ width: '100%' }}>
          <HBTextField
            ref={textFieldRef}
            autoComplete="off"
            onKeyDown={(event) => {
              if (event?.key === 'ArrowUp') {
                if (cursor !== -1) setCursor((prevState) => prevState - 1)
              } else if (event?.key === 'ArrowDown') {
                if (cursor === -1) setCursor(0)
                else if (cursor >= 0 && cursor < searchResult?.length! - 1)
                  setCursor((prevState) => prevState + 1)
              }
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter' && search.length > 0) {
                setSearchBoxRef(null)
                setOpenSearchBox(false)
                if (userLoginStatus !== 'authenticated') recentSearchesStorage(search)

                router.push({
                  pathname: `/search`,
                  query: {
                    query: cursor === -1 ? search : searchResult[cursor],
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
              }
            }}
            placeholder={formatMessage(MainLayoutToolbarMessages.searchInHastiBazaarText)}
            size="small"
            fullWidth
            onClick={(event) => {
              if (openSearchBox) {
                setOpenSearchBox(false)
                setSearchBoxRef(null)
              } else {
                setOpenSearchBox(true)
                setSearchBoxRef(event.nativeEvent?.target as HTMLElement)
              }
            }}
            onChange={(event) => {
              setSearch(event.target.value)
              setCursor(-1)
              setSearchBoxRef(event.target.value ? event.currentTarget : null)

              if (String(event.target.value)?.length === 0) return setOpenSearchBox(false)
            }}
            sx={{
              [`& .${outlinedInputClasses.root}`]: {
                borderRadius: { xs: 2, md: 0 },
              },
              [`&.${textFieldClasses.root}`]: {
                '& input': {
                  padding: (theme) => ({ xs: theme.spacing(1.1, 0), md: theme.spacing(3.1, 3) }),
                  // paddingBottom: (theme) => ({ xs: theme.spacing(1), md: theme.spacing(3.1) }),
                },
              },
              [`& .${outlinedInputClasses.notchedOutline}`]: breakpointUpMd
                ? {
                    left: (theme) => theme.spacing(-0.25),
                    borderColor: 'grey.300',
                  }
                : {},
            }}
            value={searchResult[cursor] || search}
            InputProps={{
              startAdornment: !breakpointUpMd && (
                <HBIcon type="searchAlt" sx={{ color: 'grey.500', display: 'flex' }} size="small" />
              ),
              endAdornment: (
                <>
                  {Boolean(search) && (
                    <Box
                      sx={{ cursor: 'pointer', mt: breakpointUpMd ? 0.5 : 0 }}
                      onClick={(event) => {
                        event.stopPropagation()
                        event.preventDefault()
                        setSearch('')
                        setSearchBoxRef(null)
                        setOpenSearchBox(false)
                      }}
                    >
                      <HBIcon
                        type={'times'}
                        size={!breakpointUpMd ? 'small' : 'medium'}
                        sx={{ display: 'flex' }}
                      />
                    </Box>
                  )}
                  {!breakpointUpMd && speechRecognitionState ? (
                    <Box sx={{ cursor: 'pointer', mt: 1 }} onClick={startMic}>
                      <HBIcon type="microphone" sx={{ color: 'grey.500' }} size="small" />
                    </Box>
                  ) : null}
                </>
              ),
            }}
          />

          <SearchBox
            allItems={allItems}
            menuItemId={menuItemId}
            searchValue={searchValue!}
            ref={searchBoxRef as unknown as Ref<unknown> | undefined}
            cursor={cursor}
            suggestionList={suggestionList}
            recentSuggestions={recentSuggestions}
            savedSearch={savedSearch}
            recentSuggestionRefetch={recentSuggestionRefetch}
            savedSearchRefetch={savedSearchRefetch}
            suggestionListIsFetching={suggestionListIsFetching}
          />
        </Box>
      </ClickAwayListener>

      {breakpointUpMd && (
        <HBButtonStyle
          size="large"
          onClick={() => {
            if (search?.length > 0) {
              setSearchBoxRef(null)
              setOpenSearchBox(false)
              if (userLoginStatus !== 'authenticated') recentSearchesStorage(search)
              router.push({
                pathname: `/search`,
                query: {
                  query: cursor === -1 ? search : searchResult[cursor],
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
            }
          }}
        >
          <Typography variant="button" fontWeight="500">
            {formatMessage(MainLayoutToolbarMessages.searchText)}
          </Typography>
        </HBButtonStyle>
      )}
    </Stack>
  )
}

export default MainLayoutToolbarSearch

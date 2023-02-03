import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import phrasesMessages from '@hasty-bazar-commerce/core/translations/phrases.messages'
import { localityApi } from '@hasty-bazar-commerce/services/localityApi.generated'
import { HBIcon, HBTextField } from '@hasty-bazar/core'
import {
  Box,
  ClickAwayListener,
  debounce,
  List,
  ListItemButton,
  outlinedInputClasses,
  SxProps,
  Theme,
  Typography,
} from '@mui/material'
import { KeyboardEvent, useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

export type SearchBoxPosition = 'top' | 'bottom'
export type SearchBoxProps = {
  searchPlaceholder?: string
  searchPosition?: SearchBoxPosition
  searchSx?: SxProps<Theme>
  onSearchMounted?: (ref: any) => void
  address?: string
}

export type searchType = {
  id: string
  address?: string
  location?: {
    bb: {
      ne?: string
      sw?: string
    }
    center?: string
  }
  name?: string
  nameEn?: string
}
export default function SearchBox({
  searchPosition = 'top',
  searchPlaceholder,
  searchSx,
  onSearchMounted,
  address,
}: SearchBoxProps) {
  const { formatMessage } = useIntl()
  const [searchValue, setSearchValue] = useState('')
  const [searchList, setSearchList] = useState<searchType[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeSearchListItem, setActiveSearchListItem] = useState<number | null>(null)
  const [getSearch, { isFetching }] = localityApi.useLazyGetWebLocalityMapsGetStreetsQuery({
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  const handleSearch = (value: string) => {
    if (!value) return
    resetActiveSearchListItem()
    setSearchList([])
    getSearch({
      ...ApiConstants,
      limit: 20,
      street: value,
    })
      .then((res: any) => {
        setIsOpen(true)
        setSearchList(
          res?.data?.data?.results?.map((item: any) => {
            return {
              id: item.id,
              address: item.address,
              location: item.location,
              name: item.name,
              nameEn: item.nameEn,
            }
          }),
        )
      })
      .catch((err) => {})
  }

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), [])

  const handleSelectSearch = (item: searchType) => {
    resetActiveSearchListItem()
    onSearchMounted?.(item)
    setIsOpen(false)
  }

  useEffect(() => {
    if (address) {
      setSearchValue(address)
    }
  }, [address])

  const handleArrows = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter') && isOpen) {
      event.stopPropagation()
      event.preventDefault()
      switch (event.key) {
        case 'ArrowDown':
          if (activeSearchListItem === null) {
            setActiveSearchListItem(0)
          } else if (activeSearchListItem === 4) {
            setActiveSearchListItem(0)
          } else {
            setActiveSearchListItem((prev) => prev! + 1)
          }
          break
        case 'ArrowUp':
          if (activeSearchListItem === null) {
            setActiveSearchListItem(4)
          } else if (activeSearchListItem === 0) {
            setActiveSearchListItem(4)
          } else {
            setActiveSearchListItem((prev) => prev! - 1)
          }
          break
        case 'Enter':
          if (activeSearchListItem !== null) {
            handleSelectSearch(searchList[activeSearchListItem])
            handleListClosing()
          }
          break
        default:
          break
      }
    }
  }

  const resetActiveSearchListItem = () => {
    setActiveSearchListItem(null)
  }

  const handleListClosing = () => {
    setIsOpen(false)
    setActiveSearchListItem(null)
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        handleListClosing()
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        p={3}
        width="100%"
        height={50}
        sx={{
          position: 'absolute',
          zIndex: (theme) => theme.zIndex.drawer,
          top: searchPosition === 'top' ? 12 : 'auto',
          bottom: searchPosition === 'bottom' ? 12 : 'auto',
          left: 0,

          ...searchSx,
        }}
      >
        <Box display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}>
          <HBTextField
            placeholder={searchPlaceholder ?? formatMessage(phrasesMessages.search)}
            onChange={(e) => {
              setSearchValue(e.target.value)
              debouncedHandleSearch(e.target.value)
            }}
            value={searchValue}
            sx={{
              width: '100%',
              backgroundColor: (theme) => theme.palette.common.white,
              borderRadius: 2,

              [`& .${outlinedInputClasses.root}`]: {
                fieldset: {
                  border: 'none!important',
                },
              },
            }}
            onKeyDown={handleArrows}
            InputProps={{
              startAdornment: (
                <HBIcon
                  type="searchAlt"
                  size="small"
                  sx={{ mr: 2, color: ({ palette }) => palette.grey[300] }}
                />
              ),
            }}
          />
        </Box>
        {isFetching && (
          <Typography bgcolor="common.white" variant="subtitle1" p={2}>
            {formatMessage(phrasesMessages.searching)}
          </Typography>
        )}
        {isOpen && (
          <List
            sx={{
              width: '100%',
              backgroundColor: (theme) => theme.palette.common.white,
              borderRadius: 2,
              boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.08)',
              border: (theme) => `1px solid ${theme.palette.grey[100]}`,
            }}
          >
            {searchList?.slice(0, 5)?.map((item, index) => (
              <ListItemButton
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.grey[100]}`,
                  backgroundColor:
                    index === activeSearchListItem ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                }}
                key={item.id}
                onClick={() => handleSelectSearch(item)}
              >
                <Typography variant="subtitle2">{item.address}</Typography>
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </ClickAwayListener>
  )
}

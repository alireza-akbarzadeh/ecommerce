import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { localityApi } from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { HBIcon, HBTextField } from '@hasty-bazar/core'
import { Box, debounce, List, ListItemButton, SxProps, Theme, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'

export type SearchBoxPosition = 'top' | 'bottom'
export type SearchBoxProps = {
  searchPlaceholder?: string
  searchPosition?: SearchBoxPosition
  searchSx?: SxProps<Theme>
  onSearchMounted?: (ref: any) => void
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
}: SearchBoxProps) {
  const { formatMessage } = useIntl()
  const [searchValue, setSearchValue] = useState('')
  const [searchList, setSearchList] = useState<searchType[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [getSearch, { isFetching }] = localityApi.useLazyGetAdminLocalityMapsGetStreetsQuery({
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  const handleSearch = (value: string) => {
    if (!value) {
      setIsOpen(false)
      return
    }

    getSearch({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
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
    setSearchValue(item.address ?? '')
    onSearchMounted?.(item)
    setIsOpen(false)
  }

  return (
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
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSearchMounted?.(searchValue)
            }
          }}
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
        <List sx={{ width: '100%', backgroundColor: (theme) => theme.palette.common.white }}>
          {searchList?.map((item) => (
            <ListItemButton key={item.id} onClick={() => handleSelectSearch(item)}>
              <Typography variant="subtitle2">{item.address}</Typography>
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  )
}

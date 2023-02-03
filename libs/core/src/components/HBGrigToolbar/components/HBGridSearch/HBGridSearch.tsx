import { gridClasses, HBIcon, HBIconButton } from '@hasty-bazar/core'
import { BoxProps, InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { HBDataGridSearchStyleRoot } from './HBGridSearch.style'

export interface HBDataGridSearchWrapperProps extends BoxProps {
  isSearch?: boolean
  inputWidth?: number
  openPosition?: 'left' | 'right'
}

export type HBDataGridSearchProps = {
  onSearch?: (search: string) => void
  search?: string
  placeholder?: string
  inputWidth?: number
  openPosition?: 'left' | 'right'
  show?: boolean
  defaultShow?: boolean
  toggleShow?: boolean
  disabled?: boolean
  searchText?: string
}

export default function HBDataGridSearch({
  placeholder = 'جستجو',
  inputWidth,
  openPosition,
  disabled,
  defaultShow,
  toggleShow = true,
  show,
  searchText: searchTextProp,
  ...props
}: HBDataGridSearchProps) {
  const [showSearch, setShowSearch] = useState(defaultShow)
  const searchRef = useRef<HTMLInputElement>(null)
  const [searchText, setSearchText] = useState(props.search || searchTextProp || '')
  const [isSearch, setIsSearch] = useState(false)

  const handleShowSearch = () => {
    if (toggleShow) {
      setShowSearch(true)
      searchRef && searchRef.current?.focus()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.onSearch?.(searchText)
      setIsSearch(searchText ? true : false)
    }
  }

  useEffect(() => {
    if (searchTextProp && !isSearch) {
      setSearchText(searchTextProp)
      setIsSearch(true)
    }
  }, [searchTextProp])

  return (
    <HBDataGridSearchStyleRoot
      isSearch={showSearch}
      inputWidth={inputWidth}
      openPosition={openPosition}
    >
      <HBIconButton
        sx={{
          ...gridClasses.gridToolbarIcon,
          color: isSearch ? 'primary.main' : undefined,
        }}
        onClick={handleShowSearch}
        icon={isSearch ? 'creditCardSearch' : 'search'}
        tooltip={placeholder}
        disabled={disabled}
      />
      <TextField
        size="small"
        placeholder={placeholder}
        onBlur={() => {
          if (toggleShow) {
            setShowSearch(false)
          }
        }}
        inputRef={searchRef}
        defaultValue={props.search}
        value={searchText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <HBIcon type="search" size="small" />
            </InputAdornment>
          ),
        }}
      />
    </HBDataGridSearchStyleRoot>
  )
}

import {
  debounce,
  inputLabelClasses,
  List,
  ListItemButton,
  ListItemIcon,
  outlinedInputClasses,
  Popover,
  SxProps,
  Typography,
} from '@mui/material'
import { Theme } from '@mui/system'
import { AgGridReact } from 'ag-grid-react'
import React, { useState } from 'react'
import { HBAutoComplete } from '../HBAutoComplete'
import { MenuItemProps } from '../HBGridHeader'
import { HBIcon } from '../HBIcon'
import { HBSelectProps } from '../HBSelect'
import { HBTextField } from '../HBTextField'
import HBDataGridSearch, { HBDataGridSearchProps } from './components/HBGridSearch'
import HBGrigToolbarItem, { HBGrigToolbarItemProps } from './components/HBGrigToolbarItem'
import { HBGridToolbarStyleRoot, HBGridToolbarSubMenuWrapperStyle } from './HBGrigToolbar.styles'

export type HBDataGridToolbarCallbackProps = {
  type: 'create' | 'edit' | 'delete' | 'export' | 'search' | 'refresh' | 'more' | string
}

export type HBDataGridToolbarProps = {
  items?: MenuItemProps[]
  onClick?: (props: HBDataGridToolbarCallbackProps) => void
  onChange?: (value: number | string, type: 'search' | 'status') => void
  children?: React.ReactNode
  addProps?: HBGrigToolbarItemProps
  editProps?: HBGrigToolbarItemProps
  deleteProps?: HBGrigToolbarItemProps
  refreshProps?: HBGrigToolbarItemProps
  moreProps?: HBGrigToolbarItemProps
  searchProps?: HBDataGridSearchProps
  statusProps?: Partial<HBSelectProps> & { show?: boolean }
  sx?: SxProps<Theme>
  searchText?: string
  agGridRef?: React.RefObject<AgGridReact>
}

type SelectBoxOptionsType = HBSelectProps['menuItem']

export default function HBGridToolbar({
  items,
  onClick,
  onChange,
  children,
  addProps,
  editProps,
  deleteProps,
  refreshProps,
  moreProps,
  sx,
  searchProps = { show: true },
  statusProps = { show: true },
  searchText,
  agGridRef,
  ...props
}: HBDataGridToolbarProps) {
  const isActive = agGridRef?.current?.api?.getFilterModel()?.['isActive']?.filter || null
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [isActiveFilter, setIsActiveFilter] = useState<any>(
    isActive == 'true' || isActive == '1'
      ? { title: 'فعال', value: 1 }
      : isActive == 'false' || isActive == '0'
      ? { title: 'غیرفعال', value: 0 }
      : null,
  )
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'HBGrigToolbarPopover' : undefined

  const handleSearch = (search: string) => {
    onChange?.(search, 'search')
  }

  return (
    <HBGridToolbarStyleRoot sx={sx}>
      {children}
      <HBGrigToolbarItem
        icon="plus"
        tooltip={'ایجاد'}
        onClick={() => onClick?.({ type: 'create' })}
        sx={{
          color: (theme) =>
            addProps?.disabled ? theme.palette.grey[300] : theme.palette.primary.main,
        }}
        {...addProps}
      />
      {statusProps?.show && (
        <HBAutoComplete
          value={isActiveFilter}
          //@ts-ignore
          onChange={(event, newValue: any) => {
            setIsActiveFilter(newValue)
            onChange?.(newValue?.value ?? -1, 'status')
          }}
          options={
            statusProps?.menuItem
              ? (statusProps?.menuItem as SelectBoxOptionsType)
              : ([
                  { title: 'فعال', value: 1 },
                  { title: 'غیرفعال', value: 0 },
                ] as SelectBoxOptionsType)
          }
          getOptionLabel={(option: any) => option.title || ''}
          renderInput={(params) => (
            <HBTextField
              {...params}
              placeholder="وضعیت"
              label="وضعیت"
              sx={{
                height: 33,
                minWidth: 150,
                [`& .${inputLabelClasses.root}`]: {
                  top: -4,
                },
                [`& .${outlinedInputClasses.root}`]: {
                  height: 33,
                },
                [`& .${outlinedInputClasses.input}`]: {
                  position: 'relative',
                  top: -4,
                },
              }}
            />
          )}
          size="small"
          {...statusProps}
        />
      )}
      {searchProps?.show && (
        <HBDataGridSearch
          onSearch={debounce(handleSearch, 500)}
          {...searchProps}
          searchText={searchText}
        />
      )}
      <HBGrigToolbarItem
        icon="editAlt"
        tooltip={'ویرایش'}
        onClick={() => onClick?.({ type: 'edit' })}
        {...editProps}
      />
      <HBGrigToolbarItem
        icon="trashAlt"
        tooltip={'حذف'}
        onClick={() => onClick?.({ type: 'delete' })}
        {...deleteProps}
      />
      <HBGrigToolbarItem
        icon="sync"
        tooltip={'به روزرسانی'}
        onClick={() => onClick?.({ type: 'refresh' })}
        {...refreshProps}
      />
      <HBGrigToolbarItem
        icon="ellipsisH"
        tooltip={'بیشتر'}
        aria-describedby={id}
        onClick={handleClick}
        {...moreProps}
      />
      {items && items.length > 0 && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <HBGridToolbarSubMenuWrapperStyle>
            <List component="div" disablePadding>
              {items
                .filter(({ show = true, ...item }) => show)
                .map((item, index) => (
                  <ListItemButton
                    component="button"
                    disabled={item.disabled}
                    key={index}
                    onClick={() => {
                      item.onClick?.()
                      handleClose()
                    }}
                    {...item}
                  >
                    {item.icon && (
                      <ListItemIcon>
                        {typeof item.icon === 'string' ? (
                          <HBIcon type={item.icon} size="small" />
                        ) : (
                          item.icon
                        )}
                      </ListItemIcon>
                    )}
                    <Typography variant="body1" component="span">
                      {item.label}
                    </Typography>
                  </ListItemButton>
                ))}
            </List>
          </HBGridToolbarSubMenuWrapperStyle>
        </Popover>
      )}
    </HBGridToolbarStyleRoot>
  )
}

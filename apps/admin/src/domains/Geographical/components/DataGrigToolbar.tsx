import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBIcon, HBSelectProps, MenuItemProps } from '@hasty-bazar/core'
import { debounce, List, ListItemButton, ListItemIcon, Popover, Typography } from '@mui/material'
import HBDataGridSearch, {
  HBDataGridSearchProps,
} from 'libs/core/src/components/HBGrigToolbar/components/HBGridSearch'
import HBGrigToolbarItem, {
  HBGrigToolbarItemProps,
} from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import {
  HBGridToolbarStyleRoot,
  HBGridToolbarSubMenuWrapperStyle,
} from 'libs/core/src/components/HBGrigToolbar/HBGrigToolbar.styles'
import React from 'react'
import { useIntl } from 'react-intl'

export type DataGrigToolbarCallbackProps = {
  type: 'create' | 'edit' | 'delete' | 'export' | 'search' | 'refresh' | 'more' | string
}

export type DataGrigToolbarProps = {
  items?: MenuItemProps[]
  onClick?: (props: DataGrigToolbarCallbackProps) => void
  onChange?: (value: number | string | unknown, type: 'search' | 'status') => void
  children?: React.ReactNode
  addProps?: HBGrigToolbarItemProps
  createProps?: HBGrigToolbarItemProps
  editProps?: HBGrigToolbarItemProps
  deleteProps?: HBGrigToolbarItemProps
  refreshProps?: HBGrigToolbarItemProps
  moreProps?: HBGrigToolbarItemProps
  searchProps?: HBDataGridSearchProps
  statusProps?: Partial<HBSelectProps> & { show: boolean }
}

export default function DataGrigToolbar(props: DataGrigToolbarProps) {
  const { formatMessage } = useIntl()
  const {
    items,
    onClick,
    onChange,
    children,
    addProps,
    createProps,
    editProps,
    deleteProps,
    refreshProps,
    moreProps,
    searchProps = { show: true },
    statusProps = { show: true },
  } = props
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'HBGrigToolbarPopover' : undefined

  const handleSearch = (search: string) => {
    onChange && onChange(search, 'search')
  }

  return (
    <HBGridToolbarStyleRoot>
      {children}
      <HBGrigToolbarItem
        icon="plus"
        tooltip={formatMessage(phrasesMessages.create)}
        {...createProps}
      />
      <HBGrigToolbarItem
        icon="check"
        tooltip={formatMessage(phrasesMessages.create)}
        onClick={() => onClick && onClick({ type: 'create' })}
        {...addProps}
      />
      {searchProps?.show && (
        <HBDataGridSearch onSearch={debounce(handleSearch, 500)} {...searchProps} />
      )}
      <HBGrigToolbarItem
        icon="editAlt"
        tooltip={formatMessage(phrasesMessages.edit)}
        onClick={() => onClick && onClick({ type: 'edit' })}
        {...editProps}
      />
      <HBGrigToolbarItem
        icon="trashAlt"
        tooltip={formatMessage(phrasesMessages.delete)}
        onClick={() => onClick && onClick({ type: 'delete' })}
        {...deleteProps}
      />
      <HBGrigToolbarItem
        icon="sync"
        tooltip={formatMessage(phrasesMessages.refresh)}
        onClick={() => onClick && onClick({ type: 'refresh' })}
        {...refreshProps}
      />
      <HBGrigToolbarItem
        icon="ellipsisH"
        tooltip={formatMessage(phrasesMessages.more)}
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
                    disabled={item.disabled}
                    key={index}
                    onClick={() => {
                      item?.onClick && item.onClick()
                      handleClose()
                    }}
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

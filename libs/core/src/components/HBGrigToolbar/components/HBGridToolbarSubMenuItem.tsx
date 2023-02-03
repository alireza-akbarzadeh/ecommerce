import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  Popover,
  Typography,
} from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import { bindPopover } from 'material-ui-popup-state'
import { PopupState } from 'material-ui-popup-state/core'
import React, { useState } from 'react'
import { MenuItemProps } from '../../HBGridHeader'
import { HBIcon } from '../../HBIcon'
import { HBGridToolbarSubMenuWrapperStyle } from '../HBGrigToolbar.styles'

const HBGridToolbarSubMenuItem = ({
  item: { icon, label, children, onClick, disabled },
  gridRef,
}: {
  item: MenuItemProps
  gridRef?: React.RefObject<AgGridReact>
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Box>
      <ListItemButton
        {...(!children && { onClick: () => onClick?.(gridRef?.current!) })}
        {...(children && { onClick: () => setOpen(!open) })}
        disabled={disabled}
      >
        {icon && (
          <ListItemIcon>
            {typeof icon === 'string' ? <HBIcon type={icon} size="small" /> : icon}
          </ListItemIcon>
        )}
        <Typography variant="body1" component="span">
          {label}
        </Typography>
      </ListItemButton>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((subMenuItem, index) => (
              <HBGridToolbarSubMenuItem key={index} item={subMenuItem} gridRef={gridRef} />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  )
}

const HBGridHeaderSubMenu = ({
  children,
  popupState,
  gridRef,
}: {
  children: MenuItemProps[]
  popupState: PopupState
  gridRef?: React.RefObject<AgGridReact>
}) => {
  return (
    <Popover
      {...bindPopover(popupState)}
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
          {children.map((menuItem, index) => (
            <HBGridToolbarSubMenuItem item={menuItem} key={index} gridRef={gridRef} />
          ))}
        </List>
      </HBGridToolbarSubMenuWrapperStyle>
    </Popover>
  )
}

export default HBGridHeaderSubMenu

import { HBIcon, HBIconButton, HBIconType } from '@hasty-bazar/core'
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
  Popover,
  Typography,
} from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import React from 'react'

export type GridActionMenuItemProps = {
  label: string
  icon?: HBIconType
  onClick?: () => void
  disabled?: boolean
}

export type GridActionMenuProps = {
  label: string
  children: GridActionMenuItemProps[]
}

export interface GridActionColumnProps extends ICellRendererParams {
  menuItems: GridActionMenuProps[]
}

export default function GridActionColumn({ menuItems, ...props }: GridActionColumnProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        gap: 0.5,
        color: (theme) => theme.palette.grey[900],
      }}
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
      }}
    >
      {menuItems.length > 0 && (
        <HBIconButton
          icon="ellipsisV"
          variant="text"
          sx={{ minWidth: 10, mt: 1.5 }}
          onClick={handleClick}
        />
      )}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ minWidth: 150, minHeight: 160 }}>
          {menuItems.map((item, index) => (
            <List
              key={index}
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  {item.label}
                </ListSubheader>
              }
            >
              {item.children?.map(({ label, icon, onClick, disabled }, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => {
                    handleClose()
                    onClick?.()
                  }}
                  disabled={disabled}
                >
                  {icon && (
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <HBIcon type={icon} size="small" />
                    </ListItemIcon>
                  )}
                  <Typography variant="subtitle2">{label}</Typography>
                </ListItemButton>
              ))}
            </List>
          ))}
        </Box>
      </Popover>
    </Box>
  )
}

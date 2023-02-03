import { ButtonProps, Menu, MenuItem, MenuProps, paperClasses, SxProps, Theme } from '@mui/material'
import { Stack } from '@mui/system'
import { ForwardedRef, forwardRef, ReactNode, useState } from 'react'
import { HBButton } from '../HBButton'

export interface HBMenuProps extends Omit<MenuProps, 'open'> {
  content: ReactNode
  contentComponentType?: 'button' | 'div'
  buttonProps?: ButtonProps
  menus?: { content: ReactNode; onClick: () => void; disabled?: boolean }[]
  menuItemSx?: SxProps<Theme>
  menuSx?: SxProps<Theme>
}

const HBMenu = forwardRef(
  <T extends HTMLButtonElement>(
    {
      content,
      buttonProps,
      contentComponentType = 'button',
      menus,
      sx,
      menuItemSx,
      BackdropProps,
      menuSx,
      ...rest
    }: HBMenuProps,
    ref: ForwardedRef<T>,
  ) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
      event.stopPropagation()
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }
    return (
      <>
        {contentComponentType === 'button' ? (
          <HBButton sx={sx} {...buttonProps} ref={ref} onClick={handleClick}>
            {content}
          </HBButton>
        ) : (
          <Stack
            component="div"
            ref={ref as unknown as ForwardedRef<HTMLDivElement>}
            onClick={handleClick}
          >
            {content}
          </Stack>
        )}
        <Menu
          BackdropProps={{
            onClick: (e) => {
              e.stopPropagation()
              handleClose()
            },
            sx: { backgroundColor: 'transparent' },
            ...BackdropProps,
          }}
          anchorEl={anchorEl}
          open={open}
          sx={{
            [`& .${paperClasses.root}`]: { minWidth: anchorEl?.clientWidth },
            ...menuSx,
          }}
          PaperProps={{
            sx: {
              borderRadius: 2,
            },
          }}
          {...rest}
        >
          {menus?.map((menu, index) => (
            <MenuItem
              key={`${menu.content}-${index}`}
              onClick={(e) => {
                handleClose()
                e.stopPropagation()
                menu.onClick()
              }}
              disabled={menu.disabled}
              sx={menuItemSx}
            >
              {menu.content}
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  },
)

HBMenu.displayName = 'HBMenu'
HBMenu.defaultProps = {
  elevation: 15,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
}
export default HBMenu

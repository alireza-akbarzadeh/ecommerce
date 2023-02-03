import layoutMessages from '@hasty-bazar-admin/layout/layout.messages'
import { HBIcon } from '@hasty-bazar/core'
import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material'
import Menu, { MenuProps } from '@mui/material/Menu'
import { styled, useTheme } from '@mui/material/styles'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useIntl } from 'react-intl'
import PopUpMenuItem, { PopUpMenuItemProps } from './PopUpmenuItem'

type ProfileMenuProps = {
  profileImg?: string
  userName?: string
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(2),
    minHeight: 104,
    minWidth: 150,
    color: theme.palette.common.black,
    boxShadow: `${theme.palette.common.black} 0px  16px 32px`,
    '& .MuiMenu-list': {
      p: 0,
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        color: theme.palette.common.black,
      },
    },
  },
}))

const CustomPopUpMenu = (props: ProfileMenuProps) => {
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { replace } = useRouter()
  const { data } = useSession()

  const PopUpMenu: PopUpMenuItemProps[] = [
    {
      active: true,
      title: formatMessage(layoutMessages.profile),
      routLink: '/profile',
      iconLeftType: 'angleLeft',
      iconRightType: 'userCircle',
    },
    {
      active: true,
      title: formatMessage(layoutMessages.logout),
      onClick: () => signOut({ redirect: false }).then(() => replace('/')),
      iconLeftType: 'angleLeft',
      iconRightType: 'signOutAlt',
    },
  ]

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const user = data?.user

  return (
    <Box>
      <IconButton
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        size="small"
        edge="end"
        onClick={handleClick}
        disableRipple
        sx={{ gap: 2 }}
      >
        <Avatar
          alt={props.userName}
          //@ts-ignore
          src={user?.avatar ? `${process.env.NEXT_PUBLIC_CDN}${user.avatar}` : ''}
          sx={{ width: 32, height: 32 }}
        />
        {(user?.firstName || user?.lastName) && (
          <Typography variant="body2" color={'GrayText'}>
            {user?.firstName + ' ' + user?.lastName}
          </Typography>
        )}
        <HBIcon type="angleDown" size="small" />
      </IconButton>
      <StyledMenu
        id="profile-customized-menu"
        MenuListProps={{ 'aria-label': 'profile-customized-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {PopUpMenu.map((child, index: number) => (
          <div key={index}>
            <PopUpMenuItem {...child} />
            {(index === 0 || index !== PopUpMenu.length - 1) && (
              <Divider style={{ borderColor: theme.palette.grey[200] }} />
            )}
          </div>
        ))}
      </StyledMenu>
    </Box>
  )
}

export default CustomPopUpMenu

import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Typography, useTheme } from '@mui/material'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import * as React from 'react'

type ListItemProps = {
  active: boolean
  title: string
  iconType: HBIconType
  linkId?: number
  handleClick: () => void
}

const SideBarItem = (props: ListItemProps) => {
  const theme = useTheme()

  const handleRedirect = () => {
    props.handleClick()
  }

  return (
    <ListItemButton
      disableRipple
      onClick={handleRedirect}
      sx={({ spacing }) => ({
        p: 0,
        pr: 4,

        '&::before': {
          borderTopLeftRadius: spacing(0.5),
          borderBottomLeftRadius: spacing(0.5),
          width: 4,
          height: 65,
          p: 0,
          backgroundColor: props.active ? 'primary.main' : 'transparent',
          content: '""',
        },
      })}
    >
      <HBIcon
        type={props.iconType}
        size="medium"
        sx={{
          color: props.active ? theme.palette.primary.main : theme.palette.grey[500],
          m: 5,
        }}
      />

      <ListItemText id={`${props.linkId}`}>
        <Typography
          variant="subtitle2"
          component="span"
          sx={{ color: props.active ? theme.palette.primary.main : theme.palette.grey[500] }}
        >
          {props.title}
        </Typography>
      </ListItemText>
      <HBIcon
        type={props.active ? 'angleUp' : 'angleDown'}
        size="medium"
        sx={{
          color: props.active ? theme.palette.primary.main : theme.palette.grey[500],
          m: 0,
        }}
      />
    </ListItemButton>
  )
}

export default SideBarItem

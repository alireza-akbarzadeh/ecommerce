import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, MenuItem, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import * as React from 'react'

export type PopUpMenuItemProps = {
  active: boolean
  title: string
  routLink?: string
  onClick?(): void
  iconRightType: HBIconType
  iconLeftType: HBIconType
}

const PopUpMenuItem = (props: PopUpMenuItemProps) => {
  const { push } = useRouter()

  const handleClickOnItem = () => {
    props.routLink && push(props.routLink)
    props.onClick && props.onClick()
  }

  return (
    <MenuItem onClick={handleClickOnItem} disableRipple>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          direction: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <HBIcon type={props.iconRightType} size="small" sx={{ display: 'flex' }} />
        <Typography variant="subtitle2"> {props.title} </Typography>
        <HBIcon type={props.iconLeftType} size="medium" />
      </Box>
    </MenuItem>
  )
}

export default PopUpMenuItem

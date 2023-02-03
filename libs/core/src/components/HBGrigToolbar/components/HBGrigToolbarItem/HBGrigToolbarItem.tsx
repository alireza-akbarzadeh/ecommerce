import { gridClasses, HBIconButton, HBIconButtonProps, HBIconType } from '@hasty-bazar/core'
import React from 'react'

export interface HBGrigToolbarItemProps extends Omit<HBIconButtonProps, 'children' | 'onClick'> {
  icon?: HBIconType
  tooltip?: string
  onClick?: (props: any) => void
  show?: boolean
}

export default function HBGrigToolbarItem({
  icon,
  tooltip,
  onClick,
  show = true,
  ...props
}: HBGrigToolbarItemProps) {
  if (!show) return <></>
  return (
    <HBIconButton
      sx={gridClasses.gridToolbarIcon}
      icon={icon}
      tooltip={tooltip}
      onClick={onClick}
      {...props}
    />
  )
}

import { HBBreadcrumbs, HBIcon, HBIconType } from '@hasty-bazar/core'
import * as React from 'react'
import HBLink from '../HBLink'

type ItemProps = {
  url: string
  title: React.ReactNode
  iconName?: HBIconType
}
type CustomBreadCrumbsProps = {
  items: ItemProps[]
}

const CustomBreadCrumbs = (props: CustomBreadCrumbsProps) => {
  return (
    <HBBreadcrumbs separator={<HBIcon type="angleLeft" size="small" />}>
      {props.items.map((child: ItemProps, index: number) => (
        <HBLink key={index} underline="none" color="text.secondary" href={child.url}>
          {child.iconName && <HBIcon type={child.iconName} size="small" />}
          {child.title}
        </HBLink>
      ))}
    </HBBreadcrumbs>
  )
}

export default CustomBreadCrumbs

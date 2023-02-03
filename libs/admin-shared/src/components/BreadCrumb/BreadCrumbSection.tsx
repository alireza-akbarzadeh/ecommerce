import { HBIconType } from '@hasty-bazar/core'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import * as React from 'react'
import CustomBreadcrumbs from './BreadCrumb'

type BreadItem = {
  url: string
  title: React.ReactNode
  iconName?: HBIconType
}
interface BreadCrumbSectionProps {
  title?: string
  breadItems: BreadItem[]
}

const BreadCrumbSection = (props: BreadCrumbSectionProps) => {
  return (
    <Box
      sx={{ direction: 'column', justifyContent: 'space-between', alignItems: 'baseline', pb: 5 }}
    >
      <Typography variant="h5">{props.title}</Typography>
      <CustomBreadcrumbs items={props.breadItems} />
    </Box>
  )
}

export default BreadCrumbSection

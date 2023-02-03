import { BreadcrumbsProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBBreadcrumbsRootStyle } from './HBBreadcrumbs.styles'

export type HBBreadcrumbsProps = Omit<BreadcrumbsProps, 'ref'> & {
  children?: React.ReactNode
}

const HBBreadcrumbs = forwardRef(
  <T extends HTMLDivElement>({ children, ...props }: HBBreadcrumbsProps, ref: ForwardedRef<T>) => {
    return (
      <HBBreadcrumbsRootStyle aria-label="breadcrumb" ref={ref} {...props}>
        {children}
      </HBBreadcrumbsRootStyle>
    )
  },
)

HBBreadcrumbs.displayName = 'HBBreadcrumbs'
HBBreadcrumbs.defaultProps = {}

export default HBBreadcrumbs

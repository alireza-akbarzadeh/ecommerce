import { forwardRef } from 'react'
import { HBSkeletonRootStyle } from './HBSkeleton.styles'

export type HBSkeletonProps = object

const HBSkeleton = forwardRef<any, HBSkeletonProps>((props, ref) => {
  return <HBSkeletonRootStyle ref={ref} {...props} />
})

HBSkeleton.displayName = 'HBSkeleton'
HBSkeleton.defaultProps = {}

export default HBSkeleton

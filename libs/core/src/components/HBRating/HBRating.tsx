import { RatingProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBRatingRootStyle } from './HBRating.styles'

export type HBRatingProps = Omit<RatingProps, 'ref'>

const HBRating = forwardRef(
  <T extends HTMLButtonElement>(props: HBRatingProps, ref: ForwardedRef<T>) => {
    return <HBRatingRootStyle ref={ref} {...props} />
  },
)

HBRating.displayName = 'HBRating'
HBRating.defaultProps = {}

export default HBRating

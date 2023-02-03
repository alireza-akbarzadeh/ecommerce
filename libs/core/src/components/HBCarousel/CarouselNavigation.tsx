import { SxProps, Theme } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBIconButton } from '../HBIconButton'

interface ICarouselNavigationProps {
  varient: 'prev' | 'next'
  sx?: SxProps<Theme>
  className: string
}

const CarouselNavigation = forwardRef(
  <T extends HTMLButtonElement>(
    { varient, sx, className }: ICarouselNavigationProps,
    ref: ForwardedRef<T>,
  ) => {
    return (
      <HBIconButton
        sx={{ ...sx, borderRadius: '100%' }}
        ref={ref}
        icon={varient === 'next' ? 'angleLeft' : 'angleRight'}
        className={className}
      />
    )
  },
)

export default CarouselNavigation

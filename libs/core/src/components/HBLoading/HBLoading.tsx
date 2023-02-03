import { SxProps } from '@mui/material'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { HBLoadingCircleStyle, HBLoadingRootStyle } from './HBLoading.styles'
export interface HBLoadingProps {
  countCircle?: number
  speed?: number
  sx?: SxProps
}

const HBLoading = forwardRef(
  <T extends HTMLDivElement>(
    { countCircle = 5, speed = 450, sx, ...props }: HBLoadingProps,
    ref: ForwardedRef<T>,
  ) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const changeActiveItems = () => {
      setActiveIndex((prev) => {
        if (prev < countCircle - 1) return prev + 1
        else return 0
      })
    }

    useEffect(() => {
      const _timer = setInterval(changeActiveItems, speed)
      return () => {
        clearInterval(_timer)
      }
    }, [speed])

    return (
      <HBLoadingRootStyle ref={ref} sx={sx} {...props}>
        {new Array(countCircle).fill(null).map((item, index) => (
          <HBLoadingCircleStyle
            key={index}
            sx={{
              transition: `ease-in-out opacity ${speed * 1.1}ms`,
              opacity: index === activeIndex ? 1 : 0.3,
            }}
          />
        ))}
      </HBLoadingRootStyle>
    )
  },
)

HBLoading.displayName = 'HBLoading'
HBLoading.defaultProps = {}

export default HBLoading

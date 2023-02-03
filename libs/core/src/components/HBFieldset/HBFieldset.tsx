import { SxProps, Typography } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBFieldsetRootStyle } from './HBFieldset.styles'

export interface HBFieldsetProps {
  sx?: SxProps
  children?: React.ReactNode
  title?: string
}

const HBFieldset = forwardRef(
  <T extends HTMLFieldSetElement>(
    { sx, children, title, ...props }: HBFieldsetProps,
    ref: ForwardedRef<T>,
  ) => {
    return (
      <HBFieldsetRootStyle ref={ref} sx={sx} {...props}>
        <legend>
          <Typography variant="subtitle2">{title}</Typography>
        </legend>
        {children}
      </HBFieldsetRootStyle>
    )
  },
)

HBFieldset.displayName = 'HBFieldset'
HBFieldset.defaultProps = {}

export default HBFieldset

import { Typography } from '@mui/material'
import { ForwardedRef, forwardRef, ReactNode } from 'react'
import { HBFormHeaderRootStyle, HBTitleContainer } from './HBFormHeader.styles'

export type HBFormHeaderProps = {
  title: string
  subTitle?: ReactNode | string
}

const HBFormHeader = forwardRef(
  <T extends HTMLDivElement>(props: HBFormHeaderProps, ref: ForwardedRef<T>) => {
    return (
      <HBFormHeaderRootStyle ref={ref} {...props}>
        <HBTitleContainer>
          <Typography component="h4" variant="h4">
            {props.title}
          </Typography>
          <Typography
            sx={{
              mt: 2,
              mb: 8,
              color: 'grey.500',
            }}
            component="p"
          >
            {props.subTitle}
          </Typography>
        </HBTitleContainer>
      </HBFormHeaderRootStyle>
    )
  },
)

HBFormHeader.displayName = 'HBFormHeader'
HBFormHeader.defaultProps = {}

export default HBFormHeader

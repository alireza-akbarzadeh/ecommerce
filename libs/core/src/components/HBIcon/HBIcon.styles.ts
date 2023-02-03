import { pxToRem } from '@hasty-bazar/material-provider'
import { styled } from '@mui/material'

type HBIconStyleProps = {
  size?: 'small' | 'medium' | 'large'
}

export const HBIconRootStyle = styled('i')(({ size }: HBIconStyleProps) => {
  return {
    fontSize: size === 'small' ? pxToRem(20) : size === 'large' ? pxToRem(50) : pxToRem(25),
  }
})

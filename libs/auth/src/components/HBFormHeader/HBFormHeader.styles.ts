import { styled } from '@mui/material'
import { HBFormHeaderProps } from './HBFormHeader'

export const HBFormHeaderRootStyle = styled('div')<HBFormHeaderProps>(({ theme }) => ({
  width: '100%',
}))

export const HBLogoContainer = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '80px',
}))

export const HBLogo = styled('img')(({ theme }) => ({
  width: '64px',
  height: '64px',
}))

export const HBTitleContainer = styled('div')(({ theme }) => ({}))

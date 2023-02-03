import { styled } from '@mui/material'
import { HBVerificationCodeProps } from './HBVerificationCode'

export const HBVerificationCodeRootStyle = styled('div')<HBVerificationCodeProps>(({ theme }) => ({
  width: '100%',
}))

export const HBTokenWrapperStyle = styled('div')(({ theme }) => ({
  width: '100%',
  height: '97px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))

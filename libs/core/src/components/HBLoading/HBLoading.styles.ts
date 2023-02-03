import { styled } from '@mui/material'

export const HBLoadingRootStyle = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const HBLoadingCircleStyle = styled('span')(({ theme }) => {
  return {
    borderRadius: '50%',
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginLeft: theme.spacing(2),
    background: theme.palette.primary.main,
  }
})

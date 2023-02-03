import { Box, Grid, Stack, styled } from '@mui/material'

export const WrapperStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4, 0, 0),
  marginBottom: theme.spacing(17.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 0, 0),
    marginBottom: theme.spacing(10),
  },
}))

export const BlueBox = styled(Box)(({ theme }) => ({
  width: 102,
  height: 102,
  backgroundColor: theme.palette.info.main,
  borderRadius: theme.spacing(2),
  position: 'absolute',
  top: theme.spacing(-3),
  left: theme.spacing(-3),
  transform: 'matrix(-1, 0, 0, 1, 0, 0)',
  zIndex: 0,
}))

export const YellowBox = styled(Box)(({ theme }) => ({
  width: 170,
  height: 170,
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.spacing(2),
  position: 'absolute',
  bottom: theme.spacing(-3),
  right: theme.spacing(-3),
  transform: 'matrix(-1, 0, 0, 1, 0, 0)',
  zIndex: 0,
}))

export const CircleIcon = styled(Box)(({ theme }) => ({
  width: 22.01,
  height: 22.27,
  background: theme.palette.primary.light,
  transform: 'matrix(-1, 0, 0, 1, 0, 0)',
  position: 'absolute',
  borderRadius: '50%',
}))

export const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const InfoWrapper = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2, 3.5),
  position: 'absolute',
  width: 198,
  height: 81,
  background: theme.palette.common.white,
  borderRadius: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    width: 160,
    height: 60,
  },
  [theme.breakpoints.only('xs')]: {
    padding: theme.spacing(1),
    width: 135,
    height: 50,
  },
}))

import { Box, styled, Typography } from '@mui/material'

export const BankCardStyle = styled(Box)(({ theme }) => ({
  backgroundImage: `url('/assets/wallet-card.svg')`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: 330,
  height: 212,
  position: 'relative',
  paddingTop: theme.spacing(5.5),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: 300,
    height: 195,
  },
}))

export const TitleStyle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2.5, 4),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(2),
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  ...theme.typography.subtitle1,
}))

export const InventoryContainerStyle = styled(Box)(({ theme }) => ({
  border: `1px solid`,
  borderColor: theme.palette.grey[200],
  marginTop: theme.spacing(8),
  padding: theme.spacing(6, 0),
  borderRadius: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    border: 'none',
    padding: theme.spacing(6, 0, 4),
  },
}))

export const InnerCardStyle = styled(Box)(() => ({
  position: 'absolute',
  bottom: 8,
  left: 8,
  display: 'flex',
  alignItems: 'flex-end',
  zIndex: 1,
}))

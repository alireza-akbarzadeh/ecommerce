import { Box, styled } from '@mui/material'

export const BankCardStyle = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.info.dark,
  width: 320,
  height: 160,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.spacing(2.5),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(5.5),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  alignItems: 'flex-end',

  '&::before': {
    content: '""',
    backgroundColor: theme.palette.grey[300],
    width: 390,
    height: 390,
    display: 'block',
    borderRadius: '50%',
    position: 'absolute',
    left: -212,
    top: -13,
  },
  '&::after': {
    content: '""',
    backgroundColor: theme.palette.info.light,
    width: 340,
    height: 340,
    display: 'block',
    borderRadius: '50%',
    position: 'absolute',
    left: -175,
    top: 56,
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

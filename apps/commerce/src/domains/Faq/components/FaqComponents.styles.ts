import { Box, styled } from '@mui/material'

export const CategoryItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 146,
  height: 120,
  background: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  margin: theme.spacing(0, 1, 6),
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    width: 136,
    height: 60,
    flexDirection: 'row',
  },
}))

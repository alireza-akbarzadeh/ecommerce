import { Stack } from '@mui/material'
import { styled } from '@mui/system'

export const HBVendorStyledPaper = styled(Stack)(({ theme }) => ({
  width: 100,
  height: 100,
  position: 'relative',
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(100),
  boxShadow: '0px 10px 20px  rgba(0, 0, 0, 0.15)',
  padding: 0,
  overflow: 'hidden',
  margin: 'auto',
}))

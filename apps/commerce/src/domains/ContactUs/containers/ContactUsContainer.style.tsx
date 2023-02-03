import { Box, Stack, styled } from '@mui/material'

export const AddFileStyle = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  width: theme.spacing(15),
  height: theme.spacing(15),
  backgroundColor: theme.palette.grey[100],
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const FileCardStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  width: 'inherit',
  height: 'inherit',
  overflow: 'hidden',
}))

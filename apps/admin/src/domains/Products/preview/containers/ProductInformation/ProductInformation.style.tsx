import { Box, Stack, styled } from '@mui/material'

export const VideoCardStyle = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  zIndex: 1,
  width: 'inherit',
  backgroundColor: theme.palette.common.white,
  opacity: 0.8,
  alignItems: 'center',
  justifyContent: 'center',
}))

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

export const VideoCardContainerStyle = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
}))

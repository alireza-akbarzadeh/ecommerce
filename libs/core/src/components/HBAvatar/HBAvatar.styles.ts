import { Stack, styled } from '@mui/material'

export const ImageWrapperStyle = styled(Stack)(({ theme }) => ({
  height: 'inherit',
  width: 'inherit',
  position: 'relative',
})) as typeof Stack

export const WrapperStyle = styled(Stack)(({ theme }) => ({
  height: 136,
  width: 136,
  position: 'relative',
})) as typeof Stack

export const ChooseIconWrapper = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  backgroundColor: theme.palette.grey[200],
  cursor: 'pointer',
  borderRadius: theme.spacing(5),
  padding: theme.spacing(2),
})) as typeof Stack

export const InputStyle = styled('input')(({ theme }) => ({
  display: 'none',
})) as any

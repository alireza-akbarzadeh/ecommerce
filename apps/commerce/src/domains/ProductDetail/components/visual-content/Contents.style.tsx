import { Stack, styled } from '@mui/material'

export const MediaWrapperStyle = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  cursor: 'pointer',
  img: {
    objectFit: 'contain',
  },
}))

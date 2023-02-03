import { Box, styled } from '@mui/material'

export const BoxWrapper = styled(Box)(
  ({
    theme: {
      palette: { grey },
      spacing,
    },
  }) => ({
    padding: 8,
    borderRadius: spacing(1),
    background: grey[100],
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  }),
)

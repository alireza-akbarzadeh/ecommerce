import { styled } from '@mui/material'
import { HBPasswordControllerProps } from './HBPasswordController'

export const HBPasswordControllerRootStyle = styled('div')<HBPasswordControllerProps>(
  ({ theme }) => ({
    input: {
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px white inset',
      },
    },
  }),
)

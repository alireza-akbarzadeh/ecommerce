import { styled } from '@mui/material'
import { HBChangePasswordControllerProps } from './HBSetPasswordController'

export const HBChangePasswordControllerRootStyle = styled('div')<HBChangePasswordControllerProps>(
  ({ theme }) => ({
    input: {
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px white inset',
      },
    },
  }),
)

import { styled } from '@mui/material'
import { HBemailPhoneNumberControllerProps } from './HBemailPhoneNumberController'

export const HBemailPhoneNumberControllerRootStyle = styled(
  'div',
)<HBemailPhoneNumberControllerProps>(({ theme }) => ({
  input: {
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px white inset',
    },
  },
}))

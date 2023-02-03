import { styled } from '@mui/material'

export const ActionStyle = styled('div')(({ theme }) => ({
  div: {
    gap: theme.spacing(4),
    button: {
      '&:first-child': {
        padding: 'initial',
      },
      flexGrow: 1,
    },
  },
}))

export const SignUpSetPasswordActionStyle = styled('div')(() => ({
  div: {
    display: 'flex',
    gap: '10px',
    button: {
      '&:first-child': {
        width: 102,
        minWidth: 102,
      },
      '&:last-child': {
        width: '100%',
      },
    },
  },
}))

import { Snackbar, styled } from '@mui/material'
export type HBIconStyleProps = {
  type?: 'success' | 'error' | 'info' | 'warning'
}

export const HBToastRootStyle = styled(Snackbar)<HBIconStyleProps>(({ type, theme }) => {
  return {
    '& >div': {
      padding: 0,
      color: theme.palette.common.white,
      backgroundColor:
        type === 'success'
          ? theme.palette.success.main
          : type === 'error'
          ? theme.palette.error.main
          : type === 'warning'
          ? theme.palette.warning.main
          : theme.palette.info.main,
      borderRadius: theme.spacing(2),
      minHeight: 45,
    },
  }
})

export const HBToastBodyStyle = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    '& i': {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
  }
})

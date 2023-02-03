import { styled } from '@mui/material'

export const HBChipRootStyle = styled('span')(({ theme, color }) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
    background: color === 'secondary' ? theme.palette.grey[100] : theme.palette.primary.main,
    color:
      color === 'secondary' ? theme.palette.text.secondary : theme.palette.primary.contrastText,
    borderRadius: theme.spacing(4),
    width: 'fit-content',
    ...(color === 'secondary' && {
      borderWidth: 1,
      borderColor: theme.palette.grey[300],
      borderStyle: 'solid',
    }),
    transition: 'all 0.25s',
  }
})

export const HBBChipTextStyle = styled('span')(({ theme }) => {
  return {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  }
})

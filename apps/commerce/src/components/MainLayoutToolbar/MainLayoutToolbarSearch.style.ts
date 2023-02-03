import { HBButton, HBTextField } from '@hasty-bazar/core'
import { Menu, menuClasses, styled, SxProps, Theme } from '@mui/material'

interface ISX {
  [key: string]: SxProps<Theme>
}

export const Styles: ISX = {
  hbMenu: {
    borderRadius: (theme: Theme) => theme.spacing(2, 0, 0, 2),
    bgcolor: 'grey.100',
    border: (theme: Theme) => `1px solid ${theme.palette.grey[300]} !important`,
    borderRight: 'none',
    minWidth: 101,
    padding: 0,
  },
}

export const MenuStyle = styled(Menu)(({ theme }) => ({
  [`& .${menuClasses.paper}`]: {
    marginTop: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[100]}`,
    boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.08)',
    borderRadius: theme.spacing(2),
  },
  '& li': {
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    marginBottom: 3,
    '&.item': {
      paddingLeft: theme.spacing(9),
    },
  },
}))

export const HBTextFieldStyle = styled(HBTextField)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    height: 48,
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      height: 48,
    },
    '& fieldset': {
      borderColor: `grey[300] !important`,
    },
    flex: 1,
    marginBottom: 0,
  },
  [theme.breakpoints.down('sm')]: {
    width: '96%',
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
    },
  },
}))

export const HBButtonStyle = styled(HBButton)({
  width: 102,
  minWidth: 102,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
})

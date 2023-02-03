import {
  buttonClasses,
  Dialog,
  dialogActionsClasses,
  dialogClasses,
  dialogContentClasses,
  paperClasses,
  styled,
} from '@mui/material'

export const HBDialogRootStyle = styled(Dialog)(({ theme }) => ({
  [`& .${dialogClasses.container}`]: {
    [`& .${dialogClasses.paper}`]: {
      [`&.${paperClasses.root}`]: {
        minWidth: 376,
        minHeight: 120,
        borderRadius: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
          minWidth: 'unset',
          width: '100%',
          margin: theme.spacing(4),
        },
      },
    },
  },
  [`& .${dialogContentClasses.root}`]: {
    padding: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4),
    },
  },
  [`& .${dialogActionsClasses.root}`]: {
    padding: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4),
    },
    [`& .${buttonClasses.root}`]: {
      minWidth: 'auto',
    },
  },
}))

import { styled, Switch } from '@mui/material'

export const HBSwitchRootStyle = styled(Switch)(({ theme }) => {
  return {
    width: 48,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: theme.spacing(0.5),
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(24px)',
        color: theme.palette.common.white,
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.primary.main,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
          backgroundColor: theme.palette.primary.main,
        },
        '&:hover  + .MuiSwitch-track': {
          backgroundColor: theme.palette.primary.dark,
        },
        '&:focus  + .MuiSwitch-track': {
          border: `2px solid ${theme.palette.primary.main}`,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: theme.palette.primary.main,
        border: `6px solid ${theme.palette.common.white}`,
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 20,
      height: 20,
    },
    '& .MuiSwitch-track': {
      borderRadius: theme.spacing(4),
      backgroundColor: theme.palette.grey[300],
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
    '&:hover .MuiSwitch-track': {
      backgroundColor: theme.palette.grey[500],
    },
    '&:focus  .MuiSwitch-track': {
      border: `2px solid ${theme.palette.primary.main}`,
    },
  }
})

import { HBAgGridClasses } from '@hasty-bazar/core'
import { useTheme } from '@mui/material'

export const useStyles = () => {
  const theme = useTheme()
  const classes: HBAgGridClasses = {
    wrapper: {
      paddingBottom: 15,
      backgroundColor: `${theme.palette.common.white} !important`,
      maxHeight: 400,
      '& .ag-layout-normal .ag-header': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        border: 'unset',
      },
      '&>div:last-child': {
        padding: theme.spacing(3),
        borderRadius: 2,
        backgroundColor: theme.palette.grey[100],
      },
      '& div.ag-root-wrapper': {
        border: 'unset',
      },
    },
  }
  return { classes }
}

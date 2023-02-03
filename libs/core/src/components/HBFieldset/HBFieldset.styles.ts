import { styled } from '@mui/material'
import { HBFieldsetProps } from './HBFieldset'

export const HBFieldsetRootStyle = styled('fieldset')<HBFieldsetProps>(({ theme }) => {
  return {
    border: `solid 1px ${theme.palette.grey[400]}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    '& legend': {
      padding: theme.spacing(1, 2),
      color: theme.palette.primary.main,
    },
  }
})

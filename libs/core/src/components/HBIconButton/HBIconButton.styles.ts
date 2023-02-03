import { ButtonBase, styled } from '@mui/material'
import { HBIconButtonProps } from './HBIconButton'

export const HBIconButtonRootStyle = styled(ButtonBase)<HBIconButtonProps>(
  ({ theme, variant }) => ({
    backgroundColor: variant !== 'text' ? theme.palette.common.white : 'transparent',
    color: variant !== 'text' ? theme.palette.grey[500] : theme.palette.common.black,
    border: variant !== 'text' ? `solid 1px ${theme.palette.grey[200]}` : 0,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(2),
    transition: '0.3s',
    minWidth: 33,
    height: 33,
    '&:hover': {
      backgroundColor: variant !== 'text' ? theme.palette.primary.main : 'unset',
      color: variant !== 'text' ? theme.palette.common.white : theme.palette.grey[500],
    },
  }),
) as any

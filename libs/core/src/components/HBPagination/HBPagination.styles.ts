import {
  formControlClasses,
  inputBaseClasses,
  Pagination,
  paginationClasses,
  paginationItemClasses,
  styled,
} from '@mui/material'
import { HBButton } from '../HBButton'
import { HBTextField } from '../HBTextField'
import { HBPaginationProps } from './HBPagination'

export const HBPaginationRootStyle = styled(Pagination)<HBPaginationProps>(({ theme }) => ({
  [`& .${paginationItemClasses.selected}`]: {
    backgroundColor: `${theme.palette.primary.main} !important`,

    color: `${theme.palette.common.white} !important`,
  },
  [theme.breakpoints.down('sm')]: {
    [`& .${paginationClasses.ul}`]: {
      justifyContent: 'center',
    },
    [`& .${paginationItemClasses.root}`]: {
      marginBottom: theme.spacing(2),
    },
  },
}))

export const HBPaginationGotoInputStyle = styled(HBTextField)(({ theme: { breakpoints } }) => ({
  minWidth: 80,
  [breakpoints.down('md')]: {
    minWidth: 65,
  },
  [`& .${inputBaseClasses.root}`]: {
    height: 32,
    width: 80,
    [breakpoints.down('md')]: {
      width: 65,
    },
  },
  [`&.${formControlClasses.root}`]: {
    height: 31,
  },
}))

export const HBPaginationGotoButtonStyle = styled(HBButton)(({ theme: { breakpoints } }) => ({
  height: 32,
  minWidth: 46,
  [breakpoints.down('md')]: {
    minWidth: 36,
  },
}))

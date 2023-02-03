import { Box, List, listClasses, listItemClasses, styled } from '@mui/material'
import { HBGridHeaderProps } from './HBGridHeader'

export const HBGridHeaderRootStyle = styled(List)<HBGridHeaderProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 4,
  padding: theme.spacing(1),
  [`& .${listItemClasses.root}`]: {
    width: 33,
  },
})) as any

export const HBGridHeaderSubMenuRootStyle = styled(Box)<HBGridHeaderProps>(({ theme }) => ({
  minWidth: 200,
  minHeight: 100,
  color: theme.palette.common.black,
  [`& .${listClasses.root}`]: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[20],
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
  },
}))

import { Stack, styled, Typography } from '@mui/material'

export const OrderTrackingConsignmentBodyStyles = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRadius: theme.spacing(4),
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(6, 4),
  },
}))

export const OrderTrackingConsignmentHeaderTextWrapper = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
  display: 'flex',
}))

export const OrderTrackingConsignmentHeaderSubText = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
}))

export const OrderTrackingDetailWrappers = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
  },
}))

export const OrderTRackingBody = styled(Stack)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(6, 3),
  [theme.breakpoints.up('sm')]: {
    borderRadius: 4,
  },
}))

export const CancelConsignmentResultWrapper = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: '100%',
    width: 384,
  },
}))

export const RefundActionWrapper = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: '100%',
    width: 384,
  },
}))

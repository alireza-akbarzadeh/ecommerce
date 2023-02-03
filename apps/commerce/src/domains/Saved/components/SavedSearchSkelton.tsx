import { Skeleton, Stack, styled } from '@mui/material'
import { FC } from 'react'

const SkeltonStyle = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(2),
}))

const BorderedSkeltonStyle = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    flex: 1,
  },
  [theme.breakpoints.up('sm')]: {
    width: 360,
  },
}))

const SavedSkeltonSkelton: FC = () => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
      <BorderedSkeltonStyle height={20} variant="rectangular" />
      <SkeltonStyle width={32} height={32} variant="rectangular" />
    </Stack>
  )
}

export default SavedSkeltonSkelton

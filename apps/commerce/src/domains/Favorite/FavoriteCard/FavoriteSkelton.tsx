import { Skeleton, Stack, styled } from '@mui/material'
import { FC } from 'react'
import { EmptySpace } from './FavoriteCard'

const SkeltonStyle = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(6),
}))

const FavoriteSkelton: FC = () => {
  return (
    <Stack direction="row" gap={2} alignItems="flex-start" flexWrap="wrap">
      <SkeltonStyle sx={{ borderRadius: 1 }} variant="rectangular" width={24} height={24} />
      <EmptySpace />
      <SkeltonStyle variant="rectangular" width={160} height={160} />

      <EmptySpace />
      <EmptySpace />
      <Stack spacing={4} sx={(theme) => ({ [theme.breakpoints.down('sm')]: { mt: 6 }, flex: 1 })}>
        <Stack spacing={2} justifyContent="space-between" sx={{ flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-end">
            <SkeltonStyle variant="rectangular" width={160} height={20} />
            <SkeltonStyle variant="rectangular" width={160} height={20} />
          </Stack>

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <SkeltonStyle variant="rectangular" width={130} height={20} />
              <SkeltonStyle variant="rectangular" width={130} height={20} />
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <SkeltonStyle variant="rectangular" width={130} height={20} />
            </Stack>
          </Stack>
        </Stack>

        <SkeltonStyle variant="rectangular" width="100%" height={80} />
      </Stack>
    </Stack>
  )
}

export default FavoriteSkelton

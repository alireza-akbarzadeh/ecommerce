import { Box, Grid, Skeleton, Stack, styled } from '@mui/material'
import { FC } from 'react'

const SkeltonStyle = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}))

const BorderedSkeltonStyle = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(6),
  transform: 'unset',
}))

const BigBorderedSkeltonStyle = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(6),
  transform: 'unset',
  height: 20,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    width: 160,
  },
}))

const LittleBorderedSkeltonStyle = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.spacing(6),
  transform: 'unset',
  height: 20,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    width: 130,
  },
}))

const SavedVendorSkelton: FC = () => {
  return (
    <Grid container columns={3} rowGap={6}>
      <Grid item sm={2} xs={3}>
        <Stack direction="row" spacing={{ xs: 1.5, sm: 6 }}>
          <Stack spacing={2} alignItems="flex-start" direction="row">
            <SkeltonStyle width={24} height={24} variant="rectangular" />{' '}
            <SkeltonStyle width={144} height={144} variant="rectangular" sx={{ borderRadius: 4 }} />
          </Stack>
          <Stack spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
            <BigBorderedSkeltonStyle />
            <Box />
            <LittleBorderedSkeltonStyle />
            <LittleBorderedSkeltonStyle />
            <LittleBorderedSkeltonStyle />
            <LittleBorderedSkeltonStyle />
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={3} sm={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <BorderedSkeltonStyle sx={{ width: { xs: '100%', sm: 168 }, height: 40 }} />
      </Grid>
    </Grid>
  )
}

export default SavedVendorSkelton

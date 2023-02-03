import { Grid, Skeleton, Stack } from '@mui/material'
import { SectionItemWrapper } from '../../CheckoutPage.style'

const ShippingSkeleton = () => {
  return (
    <SectionItemWrapper>
      <Stack spacing={3}>
        <Skeleton variant="text" height={50} width={'40%'} />
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={2} width="40%">
            <Skeleton variant="text" height={60} width={'15%'} />
            <Skeleton variant="text" height={60} width={'85%'} />
          </Stack>
          <Skeleton variant="text" height={60} width={'20%'} />
        </Stack>
        <Grid container px={2} gap={15}>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={2} width="40%">
            <Skeleton variant="text" height={60} width={'15%'} />
            <Skeleton variant="text" height={60} width={'85%'} />
          </Stack>
          <Skeleton variant="text" height={60} width={'20%'} />
        </Stack>
        <Grid container px={2} gap={15}>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={150} />
          </Grid>
        </Grid>
      </Stack>
    </SectionItemWrapper>
  )
}

export default ShippingSkeleton

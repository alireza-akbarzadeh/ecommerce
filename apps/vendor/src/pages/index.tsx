import { serverSideRequests } from '@hasty-bazar-vendor/core/utils'
import { Card, CardContent, Grid } from '@mui/material'
import { GetServerSideProps } from 'next'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'

export function Index() {
  const breadcrumbs = [
    {
      url: '#',
      title: 'داشبورد',
    },
  ]

  return (
    <div>
      <BreadCrumbSection title="داشبورد" breadItems={breadcrumbs} />
      <Grid sx={{ mt: 1 }} container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 100 }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 100 }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 100 }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card sx={{ height: 300 }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 150 }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 150 }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirect } = await serverSideRequests(ctx)
  return { props, redirect }
}

export default Index

import { Box, Grid } from '@mui/material'
import { LeftCharts, RightCharts, TopSummary } from './containers'

const Dashboard = () => {
  return (
    <Box sx={{ p: (theme) => theme.spacing(6, 10) }}>
      <TopSummary />
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={5}>
          <RightCharts />
        </Grid>
        <Grid item xs={12} md={7}>
          <LeftCharts />
        </Grid>
      </Grid>
    </Box>
  )
}
export default Dashboard

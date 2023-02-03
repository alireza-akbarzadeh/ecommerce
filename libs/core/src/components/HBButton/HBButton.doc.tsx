import { Box, Link, Stack, Typography } from '@mui/material'

const HBButtonDoc = () => {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h1"> مستندات </Typography>
        <Typography variant="h6">این دکمه بر اساس دکمه متریال یوآ ساخته شده است</Typography>
        <Link href="https://mui.com/material-ui/react-button/">لینک</Link>
      </Box>
      <Typography variant="h6">
        you can pass all mui default button props + loading?: boolean
      </Typography>
      <Box>
        in this version of button, loading state synchronized with disabled state, this means when
        your button is in loading state, you see disable is true as well.
        <Typography>this help us to prevent repetitive api call.</Typography>
      </Box>
    </Stack>
  )
}

export default HBButtonDoc

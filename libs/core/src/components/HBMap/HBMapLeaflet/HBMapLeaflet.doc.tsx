import { Box, Link, Typography } from '@mui/material'

const HBMapLeafletDoc = () => {
  return (
    <Box>
      <Typography variant="h1"> مستندات </Typography>
      <Typography variant="h6">طبق مستندات React Leaflet ساخته شده است.</Typography>
      <Link href="https://react-leaflet.js.org/">لینک</Link>
      <br />
      <Typography variant="h6">مستند راه اندازی در NextJS</Typography>
      <Link href="https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr">لینک</Link>
      <Link href="https://stackoverflow.com/questions/57704196/leaflet-with-next-js">لینک</Link>
    </Box>
  )
}

export default HBMapLeafletDoc

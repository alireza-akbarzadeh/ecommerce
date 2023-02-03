import { Box, Link, Typography } from '@mui/material'

const HBDialogDoc = () => {
  return (
    <>
      <Box>
        <Typography variant="h1"> مستند </Typography>
        <Typography variant="h6">دیالوگ خطای براساس دیالوگ متریال یوآ</Typography>
        <Link href="https://mui.com/material-ui/react-dialog/">Link</Link>
      </Box>
      <Typography variant="h5">
        this component props : title?: string; content: string; rejectBtn?: string; acceptBtn?:
        string;
      </Typography>
    </>
  )
}

export default HBDialogDoc

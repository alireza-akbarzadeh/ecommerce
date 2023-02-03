import { Box } from '@mui/material'

function Border() {
  return (
    <Box
      sx={{ borderBottom: 1, borderBottomColor: ({ palette }) => palette.grey[200], my: 6 }}
    ></Box>
  )
}

export default Border

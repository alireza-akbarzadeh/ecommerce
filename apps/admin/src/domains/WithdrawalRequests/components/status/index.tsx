import { Box, Typography } from '@mui/material'

type StatusProps = {
  status?: boolean
  children?: React.ReactNode
}
const Status = (props: StatusProps) => {
  const { status, children } = props

  function renderColor() {
    if (status) return 'success'
    return 'error'
  }

  return (
    <Box
      borderRadius={2}
      padding={1}
      height={24}
      px={3}
      minWidth={'78px'}
      alignSelf="center"
      justifyContent="center"
      textAlign={'center'}
      sx={({ typography }) => ({
        fontSize: typography.caption,
        bgcolor: `${renderColor()}.lighter`,
      })}
      component="div"
    >
      <Typography color={`${renderColor()}.main`} variant="caption">
        {children}
      </Typography>
    </Box>
  )
}
export default Status

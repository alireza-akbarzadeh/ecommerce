import { Box, Typography } from '@mui/material'

type PercentageProps = {
  percentNumber: string
  percentCaption: string
}

function Percentage({ percentNumber, percentCaption }: PercentageProps) {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography
        sx={{ color: ({ palette }) => palette.info.main, fontWeight: 'bold', fontSize: 24, mb: 2 }}
      >
        {`${percentNumber}%`}
      </Typography>
      <Typography>{percentCaption}</Typography>
    </Box>
  )
}

export default Percentage

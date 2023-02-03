import { HBCountDownTimer, HBIcon } from '@hasty-bazar/core'
import { Stack, styled, Typography } from '@mui/material'

const WrapperStyle = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.spacing(2),
}))

const SpecialOffer = () => {
  return (
    <WrapperStyle direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="subtitle2" sx={{ color: 'error.dark' }}>
        پیشنهادات ویژه
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <HBIcon size="small" type="stopwatch" sx={{ color: 'error.dark' }} />
        <HBCountDownTimer
          targetDate={new Date().getTime() + 1000 * 60 * 2}
          linkText=""
          sx={{
            '& > h5': (theme) => ({
              padding: theme.spacing(0),
              color: theme.palette.error.dark,
              height: 20,
              margin: 0,
              ...theme.typography.subtitle2,
            }),
            '& > p': (theme) => ({
              color: theme.palette.error.dark,
              fontSize: 18,
              margin: theme.spacing(0, 1),
              ...theme.typography.subtitle2,
            }),
          }}
          maximumShowed="hours"
        />
      </Stack>
    </WrapperStyle>
  )
}

export default SpecialOffer

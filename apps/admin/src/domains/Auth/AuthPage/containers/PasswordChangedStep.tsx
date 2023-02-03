import { HBClassesType } from '@hasty-bazar/core'
import { Alert, Button, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'
import { AuthCurrentState } from '../AuthPage'

type PasswordChangedStepProps = {
  changeState: (newState: AuthCurrentState) => void
}
const classes: HBClassesType<'common' | 'title'> = {
  common: { mt: 11 },
  title: { mb: 11 },
}
const PasswordChangedStep: FC<PasswordChangedStepProps> = ({
  changeState,
}: PasswordChangedStepProps) => {
  return (
    <Grid container alignItems={'center'} flexDirection="column">
      <Typography variant="h4" sx={classes.title}>
        رمز عبور با موفقیت ثبت شد
      </Typography>
      <Image src={'/assets/svg/greenGuard.svg'} width={80} height={100} />
      <Alert variant="filled" sx={classes.common}>
        <Typography sx={{ pr: 10 }}>رمز عبور با موفقیت ثبت شد</Typography>
      </Alert>
      <Button variant="text" color="info" sx={classes.common} onClick={() => changeState('login')}>
        <Typography variant="h6">انتقال به صفحه ورود</Typography>
      </Button>
    </Grid>
  )
}

export default PasswordChangedStep

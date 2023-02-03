import { ChoosePasswordProps } from '@hasty-bazar-vendor/pages/auth/choosePassword'
import { HBClassesType, HBForm } from '@hasty-bazar/core'
import { Box, Grid } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import {
  AuthenticationStep,
  ChangePasswordStep,
  LoginStep,
  PasswordChangedStep,
  PhoneEmailStep,
} from './containers'

type login = {
  username: string
  password: string
}
export type AuthCurrentState =
  | 'login'
  | 'forgetPassword'
  | 'loginWithOTP'
  | 'authenticate'
  | 'PhoneEmailStep'
  | 'changePassword'
  | 'passwordChanged'

export type AuthFlow = {
  currentState: AuthCurrentState
  flow: 'login' | 'forgetPassword' | 'loginWithOTP'
}

type HBPageClassNames = 'mainContainerWrapper' | 'imageContainerWrapper' | 'logo'

const classes: HBClassesType<HBPageClassNames> = {
  mainContainerWrapper: ({ palette: { background }, breakpoints: { down } }) => ({
    height: '100vh',
    justifyContent: 'flex-start',
    background: background.paper,
    [down('md')]: {
      justifyContent: 'center',
    },
  }),
  imageContainerWrapper: ({ palette: { grey }, breakpoints: { down } }) => ({
    background: grey[100],
    height: '100%',
    [down('sm')]: {
      height: 'auto',
      justifyContent: 'center',
      background: 'none',
    },
  }),
  logo: () => ({
    display: 'flex',
    justifyContent: 'center',
    mb: 20,
  }),
}

const AuthPage: FC<ChoosePasswordProps> = (props) => {
  const { userInfo } = props || {}
  useEffect(() => {
    if (userInfo) sessionStorage.setItem('changePasswordToken', userInfo.token)
  }, [userInfo])

  const [{ currentState, flow }, setState] = useState<AuthFlow>({
    currentState: userInfo ? 'changePassword' : 'login',
    flow: userInfo ? 'forgetPassword' : 'login',
  })
  const changeState = (newState: AuthCurrentState, flow?: AuthCurrentState) => {
    if (newState === 'forgetPassword' || newState === 'loginWithOTP')
      setState({ flow: newState, currentState: 'PhoneEmailStep' })
    else if (newState === 'login') setState({ flow: newState, currentState: newState })
    else setState((prev) => ({ ...prev, currentState: newState }))
  }

  return (
    <GoogleReCaptchaProvider
      language="es-AR"
      reCaptchaKey="6LfAbA8gAAAAAJqjwEYDyyMUxfynhw2V7N9ITKcX"
    >
      <Grid container alignItems="center" direction="row-reverse" sx={classes.mainContainerWrapper}>
        <Grid
          item
          xs={7}
          sm={6}
          md={6}
          container
          justifyContent={'center'}
          sx={classes.imageContainerWrapper}
        >
          <Image src={'/assets/svg/authBanner.svg'} width={642} height={642} alt="authBanner" />
        </Grid>
        <Grid item xs={12} sm={6} md={6} alignItems={'center'} justifyContent={'center'} container>
          <HBForm<login>
            sx={{
              width: 328,
              m: 10,
            }}
            mode="all"
            reValidateMode="onChange"
            onSubmit={(value) => {}}
            defaultValues={{
              username: userInfo?.user ?? '',
            }}
          >
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={currentState}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Box sx={classes.logo}>
                  <Box
                    component="img"
                    sx={{ objectFit: 'contain' }}
                    src={'/assets/logo.png'}
                    width={64}
                    height={64}
                    alt="logo"
                  />
                </Box>
                {currentState === 'login' && <LoginStep changeState={changeState} />}
                {currentState === 'PhoneEmailStep' && (
                  <PhoneEmailStep
                    changeState={changeState}
                    {...(flow === 'loginWithOTP' && {
                      headerTitle: 'ورود با کد یکبار مصرف',
                      headerSubTitle:
                        'جهت ورود، آدرس ایمیل یا شماره موبایل ثبت شده در سیستم را وارد کنید',
                      showChild: true,
                    })}
                  />
                )}
                {currentState === 'authenticate' && (
                  <AuthenticationStep
                    flow={flow}
                    backBtn={() => changeState('PhoneEmailStep')}
                    changeState={changeState}
                  />
                )}
                {currentState === 'changePassword' && (
                  <ChangePasswordStep
                    changeState={() => changeState('passwordChanged')}
                    cancelStep={() => changeState('login')}
                    {...(userInfo && {
                      headerTitle: 'انتخاب رمز عبور',
                      headerSubTitle: `لطفا برای حساب کاربری ${userInfo?.user} رمز عبور تعیین کنید. `,
                    })}
                  />
                )}
                {currentState === 'passwordChanged' && (
                  <PasswordChangedStep changeState={changeState} />
                )}
              </motion.div>
            </AnimatePresence>
          </HBForm>
        </Grid>
      </Grid>
    </GoogleReCaptchaProvider>
  )
}

export default AuthPage

import { HBLink } from '@hasty-bazar-commerce/components'
import {
  GetOtpSettingApiResponse,
  useGetOtpSettingQuery,
} from '@hasty-bazar-commerce/core/utils/IdsApi'
import { HBClassesType, HBForm } from '@hasty-bazar/core'
import { Box, Grid, Stack, Theme, useMediaQuery } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { FC, useMemo, useState } from 'react'
import {
  CheckUserExistStep,
  ForgetPasswordOtp,
  ForgetPasswordSetPassword,
  ForgetPasswordSuccess,
  SignInOtp,
  SignInPassword,
  SignUpInfo,
  SignUpOtp,
  SignUpSetPassword,
  SignUpSuccess,
} from './containers'

type login = {
  username: string
  password: string
  terms: boolean
}
export type AuthCurrentState =
  | 'checkUserExistStep'
  | 'signInPassword'
  | 'signInOtp'
  | 'forgetPassword'
  | 'forgetPasswordSetPassword'
  | 'forgetPasswordSuccess'
  | 'signUpOtp'
  | 'signUpInfo'
  | 'signUpSetPassword'
  | 'signUpSuccess'

export type AuthFlow = {
  currentState: AuthCurrentState
}

type HBPageClassNames = 'mainContainerWrapper' | 'imageContainerWrapper'

const classes: HBClassesType<HBPageClassNames> = {
  mainContainerWrapper: ({ palette: { background } }) => ({
    height: '100vh',
    background: background.paper,
  }),
  imageContainerWrapper: ({ palette: { grey } }) => ({
    background: grey[100],
    height: '100%',
    [`& > span`]: {
      minWidth: '100%',
    },
  }),
}

export interface AuthStateProps {
  onChangeState: (newState: AuthCurrentState) => void
  otpSettings?: GetOtpSettingApiResponse
  prevState: AuthCurrentState
  otpMask: string
  delayTimeForDataEntry: number
}
const AuthPage: FC = () => {
  const isDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const [currentState, setState] = useState<AuthCurrentState>('checkUserExistStep')
  const [prevState, setPrevState] = useState<AuthCurrentState>('checkUserExistStep')
  const { data: otpSettings } = useGetOtpSettingQuery({})
  const delayTimeForDataEntry = useMemo(
    () => new Date().getTime() + (otpSettings?.delayTimeForDataEntry || 120) * 1000,
    [otpSettings?.delayTimeForDataEntry, currentState],
  )

  const otpLength = useMemo(
    () => Number(otpSettings?.numberOfOtpDigit || 6),
    [otpSettings?.numberOfOtpDigit],
  )

  const otpLengthToMask = useMemo(() => {
    let otpMask = ''
    for (let i = 0; i < otpLength; i++) {
      otpMask += '0'
    }
    return otpMask
  }, [otpLength])
  const renderContent = useMemo(
    () => ({
      checkUserExistStep: (props: AuthStateProps) => <CheckUserExistStep {...props} />,
      signInPassword: (props: AuthStateProps) => <SignInPassword {...props} />,
      signInOtp: (props: AuthStateProps) => <SignInOtp {...props} />,
      forgetPassword: (props: AuthStateProps) => <ForgetPasswordOtp {...props} />,
      forgetPasswordSetPassword: (props: AuthStateProps) => (
        <ForgetPasswordSetPassword {...props} />
      ),
      forgetPasswordSuccess: (props: AuthStateProps) => <ForgetPasswordSuccess {...props} />,
      signUpOtp: (props: AuthStateProps) => <SignUpOtp {...props} />,
      signUpInfo: (props: AuthStateProps) => <SignUpInfo {...props} />,
      signUpSetPassword: (props: AuthStateProps) => <SignUpSetPassword {...props} />,
      signUpSuccess: (props: AuthStateProps) => <SignUpSuccess />,
    }),
    [],
  )

  return (
    <Grid container alignItems="center" direction="row-reverse" sx={classes.mainContainerWrapper}>
      {!isDownSm && (
        <Grid item container sm={6} sx={classes.imageContainerWrapper}>
          <Image
            width="100%"
            height="100%"
            objectFit="contain"
            objectPosition="center"
            src="/assets/svg/authBanner.svg"
            alt="authBanner"
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6} alignItems={'center'} justifyContent={'center'} container>
        <HBForm<login>
          defaultValues={{ terms: false, password: '', username: '' }}
          sx={{ width: '100%', mx: 6 }}
          mode="all"
          onSubmit={(value) => {}}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentState}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Stack alignItems="center" sx={{ width: '100%' }}>
                <Box display="flex" justifyContent="center" mb={20}>
                  <HBLink href="/" passHref>
                    <Box
                      component="img"
                      sx={{ objectFit: 'contain' }}
                      src={'/assets/logo.png'}
                      width={64}
                      height={64}
                      alt="logo"
                    />
                  </HBLink>
                </Box>
                <Box sx={{ width: '100%', maxWidth: 328 }}>
                  {renderContent[currentState]({
                    onChangeState(newState) {
                      setPrevState(currentState)
                      setState(newState)
                    },
                    otpSettings,
                    prevState,
                    otpMask: otpLengthToMask,
                    delayTimeForDataEntry,
                  })}
                </Box>
              </Stack>
            </motion.div>
          </AnimatePresence>
        </HBForm>
      </Grid>
    </Grid>
  )
}

export default AuthPage

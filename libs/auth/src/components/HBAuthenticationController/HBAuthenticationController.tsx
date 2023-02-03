import { HBCountDownTimer, HBTextField } from '@hasty-bazar/core'
import { Grid, SxProps, Theme } from '@mui/material'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { HBAuthenticationControllerRootStyle } from './HBAuthenticationController.styles'

export type HBAuthenticationControllerProps = {
  sx?: SxProps<Theme>
  formName?: string
  label?: string
  verificationCodeTime?: number
  timeoutText?: string
  timeoutBtnCallBack?: () => void
  extraTimerText?: string
  formRules?: RegisterOptions
  inputMask?: string
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void
}

const HBAuthenticationController = (props: HBAuthenticationControllerProps) => {
  const {
    sx,
    formName = 'otp',
    label = 'کد تایید',
    verificationCodeTime = 0.5,
    timeoutText = 'ارسال مجدد کد',
    extraTimerText = 'تا پایان اعتبار کد ',
    timeoutBtnCallBack,
    formRules,
    inputMask: mask,
    onKeyPress,
  } = props
  const Form = useFormContext()
  const errorMessage = Form.formState.errors[formName]?.message
  return (
    <HBAuthenticationControllerRootStyle sx={sx}>
      {Form && (
        <Controller
          name={formName}
          control={Form.control}
          rules={
            formRules || {
              required: { value: true, message: `${label} نمی تواند خالی بماند` },
              pattern: { value: /^[0-9]{0,10}$/, message: 'فرمت کد وارد شده صحیح نمی باشد' },
            }
          }
          render={({ field }) => (
            <HBTextField
              label={label}
              {...field}
              fullWidth
              error={!!errorMessage}
              maskOptions={{ mask }}
              onKeyPress={onKeyPress}
            />
          )}
        />
      )}
      <Grid container justifyContent={'center'} alignItems="center" sx={{ mt: 4 }}>
        <HBCountDownTimer
          targetDate={verificationCodeTime}
          linkText={timeoutText}
          extraTimerText={extraTimerText}
          onClick={timeoutBtnCallBack}
        />
      </Grid>
    </HBAuthenticationControllerRootStyle>
  )
}

HBAuthenticationController.displayName = 'HBAuthenticationController'
HBAuthenticationController.defaultProps = {}

export default HBAuthenticationController

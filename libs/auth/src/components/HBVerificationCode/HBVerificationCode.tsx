import { HBCountDownTimer, HBTextField } from '@hasty-bazar/core'
import { ForwardedRef, forwardRef } from 'react'
import { HBTokenWrapperStyle, HBVerificationCodeRootStyle } from './HBVerificationCode.styles'

export type HBVerificationCodeProps = {
  inputLabel: string
  verificationCodeTime: number
  countDownResendCaption: string
  timerTitle: string
}

const HBVerificationCode = forwardRef(
  <T extends HTMLDivElement>(props: HBVerificationCodeProps, ref: ForwardedRef<T>) => {
    return (
      <HBVerificationCodeRootStyle ref={ref} {...props}>
        <HBTextField
          label={props.inputLabel}
          fullWidth
          maskOptions={{
            mask: Number,
            minLength: 4,
            maxLength: 8,
          }}
        />
        <HBTokenWrapperStyle>
          <HBCountDownTimer
            targetDate={props.verificationCodeTime}
            linkText={props.countDownResendCaption}
          />
          <span>{props.timerTitle}</span>
        </HBTokenWrapperStyle>
      </HBVerificationCodeRootStyle>
    )
  },
)

HBVerificationCode.displayName = 'HBVerificationCode'
HBVerificationCode.defaultProps = {}

export default HBVerificationCode

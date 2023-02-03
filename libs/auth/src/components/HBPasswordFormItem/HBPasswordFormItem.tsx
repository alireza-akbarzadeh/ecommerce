import { HBSubmitButton } from '@hasty-bazar/core'
import { Button, Grid, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { ForwardedRef, forwardRef, ReactNode } from 'react'
import { HBFormHeader } from '../HBFormHeader'
import { HBPasswordController } from '../HBPasswordController'
import { HBPasswordFormItemRootStyle } from './HBPasswordFormItem.styles'
export type HBPasswordFormItemProps = {
  headerTitle?: string
  headerSubTitle?: string
  children?: ReactNode
  firstBtnText?: string
  secondBtnText?: string
  firstBtnDisable?: boolean
  secondBtnDisable?: boolean
  secondBtnOnclick?: () => void
  firstBtnOnclick?: () => void
  firstBtnLoading?: boolean
  secondBtnLoading?: boolean
  firstLinkText?: string
  secondLinkText?: string
  firstLinkOnclick: () => void
  secondLinkOnclick: () => void
  passwordFormName?: string
  passwordFormLabel?: string
  sx?: SxProps<Theme>
}

const HBPasswordFormItem = forwardRef(
  <T extends HTMLDivElement>(props: HBPasswordFormItemProps, ref: ForwardedRef<T>) => {
    const {
      headerTitle = 'ورود',
      headerSubTitle = 'نام کاربری و رمز عبور خود را وارد نمایید.',
      firstBtnText = 'ورود',
      secondBtnText,
      firstBtnOnclick,
      secondBtnOnclick,
      firstBtnDisable,
      secondBtnDisable,
      firstBtnLoading,
      secondBtnLoading,
      firstLinkText = 'ورود با کد یکبار مصرف',
      secondLinkText = 'فراموشی رمز عبور',
      firstLinkOnclick,
      secondLinkOnclick,
      children,
      passwordFormName = 'password',
      passwordFormLabel,
      sx,
    } = props
    return (
      <HBPasswordFormItemRootStyle ref={ref} {...props} sx={sx}>
        <HBFormHeader title={headerTitle} subTitle={headerSubTitle} />
        <HBPasswordController
          sx={{ mt: 6 }}
          formName={passwordFormName}
          label={passwordFormLabel}
        />
        {children && children}
        <Grid container justifyContent={'space-between'} sx={{ mt: 8 }}>
          <Button color="info" onClick={secondLinkOnclick}>
            {secondLinkText}
          </Button>
          <Button color="info" onClick={firstLinkOnclick}>
            {firstLinkText}
          </Button>
        </Grid>
        <HBSubmitButton
          buttonText={firstBtnText}
          backButtonText={secondBtnText}
          buttonOnClick={firstBtnOnclick}
          backButtonOnclick={secondBtnOnclick}
          buttonLoading={firstBtnLoading}
          backButtonLoading={secondBtnLoading}
          firstBtnDisable={firstBtnDisable}
          secondBtnDisable={secondBtnDisable}
          sx={{ mt: 11 }}
        />
      </HBPasswordFormItemRootStyle>
    )
  },
)

HBPasswordFormItem.displayName = 'HBPasswordFormItem'
HBPasswordFormItem.defaultProps = {}

export default HBPasswordFormItem

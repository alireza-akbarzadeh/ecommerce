import { Theme, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'
import phrasesMessages from 'libs/core/src/translations/phrases.messages'
import { CSSProperties, ForwardedRef, forwardRef } from 'react'
import { useIntl } from 'react-intl'
import { HBButton } from '../HBButton'
import { HBIcon } from '../HBIcon'
import { HBSubmitButtonRootStyle } from './HBSubmitButton.styles'

export type HBSubmitButtonProps = {
  buttonText: string
  buttonType?: 'submit' | 'reset' | 'button' | undefined
  buttonLoading?: boolean
  buttonOnClick?: React.MouseEventHandler<HTMLButtonElement>
  backButtonText?: string
  backButtonOnclick?: React.MouseEventHandler<HTMLButtonElement>
  backButtonLoading?: boolean
  hasBackButtonIcon?: boolean
  firstBtnDisable?: boolean
  secondBtnDisable?: boolean
  style?: CSSProperties
  sx?: SxProps<Theme>
}

const HBSubmitButton = forwardRef(
  <T extends HTMLDivElement>(props: HBSubmitButtonProps, ref: ForwardedRef<T>) => {
    const { formatMessage } = useIntl()
    const {
      buttonText = formatMessage(phrasesMessages.submit),
      buttonType = 'submit',
      buttonLoading = false,
      buttonOnClick,
      backButtonText: button2Text,
      backButtonOnclick: button2OnClick,
      backButtonLoading: button2Loading = false,
      style,
      sx,
      firstBtnDisable = false,
      secondBtnDisable = false,
      hasBackButtonIcon = true,
    } = props
    const theme = useTheme()
    return (
      <HBSubmitButtonRootStyle
        ref={ref}
        {...props}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: (theme) => theme.spacing(2),
          marginBottom: (theme) => theme.spacing(2),
          ...style,
          ...sx,
        }}
      >
        {button2Text && (
          <HBButton
            onClick={button2OnClick}
            disabled={secondBtnDisable}
            variant="outlined"
            loading={button2Loading}
            startIcon={
              hasBackButtonIcon && (
                <HBIcon type={theme.direction === 'rtl' ? 'angleRight' : 'angleLeft'} />
              )
            }
          >
            {button2Text}
          </HBButton>
        )}
        <HBButton
          type={buttonType}
          onClick={buttonOnClick}
          disabled={firstBtnDisable}
          loading={buttonLoading}
          {...(!button2Text && { fullWidth: true })}
          sx={{
            paddingLeft: theme.spacing(10),
            paddingRight: theme.spacing(10),
            '&.Mui-disabled': {
              opacity: '0.3',
              backgroundColor: 'primary.main',
              color: 'common.white',
            },
          }}
        >
          {buttonText}
        </HBButton>
      </HBSubmitButtonRootStyle>
    )
  },
)

HBSubmitButton.displayName = 'HBSubmitButton'
HBSubmitButton.defaultProps = {}

export default HBSubmitButton

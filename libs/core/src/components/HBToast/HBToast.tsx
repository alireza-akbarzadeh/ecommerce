import { AlertColor, SnackbarProps, Typography } from '@mui/material'
import { OptionsObject, useSnackbar, WithSnackbarProps } from 'notistack'
import { createRef, ReactNode, useImperativeHandle, useState } from 'react'
import ReactDOM from 'react-dom'
import { HBIcon, HBIconProps } from '../HBIcon'
import { HBToastBodyStyle, HBToastRootStyle } from './HBToast.styles'

export type HorizontalAlign = 'center' | 'left' | 'right'
export type VerticalAlign = 'bottom' | 'top'
export interface HBToastProps extends Omit<SnackbarProps, 'ref'> {
  type?: AlertColor
  message?: ReactNode
  icon?: HBIconProps['type']
  vertical?: VerticalAlign
  horizontal?: HorizontalAlign
}

export type HBToastRef = {
  type?: AlertColor
  message?: ReactNode
  vertical?: VerticalAlign
  horizontal?: HorizontalAlign
}

const ref = createRef()

const HBToast = ({
  children,
  message,
  icon,
  vertical = 'bottom',
  horizontal = 'left',
  ...props
}: HBToastProps) => {
  const [showToast, setShowToast] = useState<HBToastRef>()
  const [openToast, setOpenToast] = useState(false)

  const { enqueueSnackbar } = useSnackbar()

  useImperativeHandle(
    ref,
    () => ({
      show: (toastProps: HBToastRef) => {
        enqueueSnackbar(toastProps.message, { variant: toastProps.type })
      },
    }),
    [openToast, showToast],
  )

  return (
    <>
      {typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <HBToastRootStyle
            ref={ref}
            anchorOrigin={{ vertical, horizontal }}
            message={
              <Typography variant="body1" component="div">
                <HBToastBodyStyle>
                  <HBIcon type={'infoCircle'} size="medium" />
                  <Typography
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-line',
                    }}
                    variant="subtitle2"
                    component="span"
                  >
                    {children ?? showToast?.message ?? message}
                  </Typography>
                </HBToastBodyStyle>
              </Typography>
            }
            onClose={() => setOpenToast(false)}
            {...props}
            type={showToast?.type || props.type}
            open={openToast || props.open}
          />,
          document.body,
        )}
    </>
  )
}

interface IProps {
  setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void
}

const InnerSnackbarUtilsConfiguration: React.FC<IProps> = (props: IProps) => {
  props.setUseSnackbarRef(useSnackbar())
  return null
}

let useSnackbarRef: WithSnackbarProps
const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
  useSnackbarRef = useSnackbarRefProp
}

export const SnackbarUtilsConfiguration = () => {
  return <InnerSnackbarUtilsConfiguration setUseSnackbarRef={setUseSnackbarRef} />
}

export const toast = {
  success(msg: string, options?: OptionsObject) {
    this.show(msg, {
      ...options,
      variant: 'success',
    })
  },
  warning(msg: string, options?: OptionsObject) {
    this.show(msg, {
      ...options,
      variant: 'warning',
    })
  },
  info(msg: string, options?: OptionsObject) {
    this.show(msg, {
      ...options,
      variant: 'info',
    })
  },
  error(msg: string, options?: OptionsObject) {
    this.show(msg, {
      ...options,
      variant: 'error',
      autoHideDuration: 1000,
    })
  },
  show(msg: React.ReactNode, options: OptionsObject) {
    useSnackbarRef.enqueueSnackbar(msg, options)
  },
}
export const openToast = (toastProps: HBToastRef) => {
  toast.show(toastProps.message, {
    variant: toastProps.type,
    anchorOrigin: {
      horizontal: toastProps?.horizontal ?? 'left',
      vertical: toastProps?.vertical ?? 'bottom',
    },
  })
}

export default HBToast

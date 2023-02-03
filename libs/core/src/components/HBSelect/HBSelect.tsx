import { Avatar, InputLabel, InputLabelProps, MenuItem, SelectProps, Stack } from '@mui/material'
import { ForwardedRef, forwardRef, ReactNode } from 'react'
import { HBIcon } from '../HBIcon'
import {
  HBFormControlRootStyle,
  HBHelperTextStyle,
  HBHelperTextWrapperStyle,
  HBSelectRootStyle,
} from './HBSelect.styles'

export interface HBSelectProps extends Omit<SelectProps, 'ref'> {
  label: string
  menuItem: Array<{
    title: ReactNode
    value: any
    iconPath?: string | ReactNode
    color?: string
  }>
  noneOption?: string
  inputLabelProps?: InputLabelProps
  helperText?: string
  showErrorMessage?: boolean
}

const HBSelect = forwardRef(
  <T extends HTMLInputElement>(
    {
      noneOption,
      menuItem,
      inputLabelProps,
      helperText,
      showErrorMessage,
      ...props
    }: HBSelectProps,
    ref: ForwardedRef<T>,
  ) => {
    return (
      <HBFormControlRootStyle
        style={props.style}
        sx={props.sx}
        size={props.size}
        fullWidth={props.fullWidth}
        required={props.required}
      >
        <InputLabel {...inputLabelProps}>{props.label}</InputLabel>
        <HBSelectRootStyle ref={ref} {...props}>
          {noneOption && (
            <MenuItem value="">
              <em>{noneOption}</em>
            </MenuItem>
          )}

          {menuItem?.map((item) => (
            <MenuItem
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
              key={String(item.value!)}
              value={item.value}
            >
              {item?.iconPath && typeof item?.iconPath === 'string' && (
                <Avatar
                  sx={{
                    mr: 2,
                    height: 24,
                    width: 24,
                  }}
                  sizes="small"
                  variant="circular"
                  src={`${process.env['NEXT_PUBLIC_CDN']}/${item.iconPath}`}
                  alt={String(item?.title || '')}
                />
              )}
              {item?.color && (
                <Stack
                  sx={{
                    mr: 2,
                    height: 24,
                    width: 24,
                    backgroundColor: item.color,
                    borderRadius: '50%',
                  }}
                />
              )}
              {item?.iconPath && typeof item?.iconPath !== 'string' && <>{item.iconPath}</>}
              {item.title}
            </MenuItem>
          ))}
        </HBSelectRootStyle>
        {helperText && showErrorMessage && (
          <HBHelperTextWrapperStyle sx={{ color: props.error ? 'error.main' : 'grey.900' }}>
            <HBIcon size="small" type="infoCircle" />
            <HBHelperTextStyle>{helperText}</HBHelperTextStyle>
          </HBHelperTextWrapperStyle>
        )}
      </HBFormControlRootStyle>
    )
  },
)

HBSelect.displayName = 'HBSelect'
HBSelect.defaultProps = {}

export default HBSelect

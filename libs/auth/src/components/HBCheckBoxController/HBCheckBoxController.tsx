import { HBCheckBox, HBCheckBoxProps } from '@hasty-bazar/core'
import { Link, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { ForwardedRef, forwardRef, PropsWithChildren, ReactNode } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { HBCheckBoxControllerRootStyle } from './HBCheckBoxController.styles'

export interface HBCheckBoxControllerProps extends HBCheckBoxProps {
  formName?: string
  linkText?: ReactNode
  linkOnclick?: () => void
  sx?: SxProps<Theme>
  noRule?: boolean
  disabled?: boolean
  defaultChecked?: boolean
  onClickOnCheckBox?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  formRules?: RegisterOptions
}

const HBCheckBoxController = forwardRef(
  <T extends HTMLDivElement>(
    props: PropsWithChildren<HBCheckBoxControllerProps>,
    ref: ForwardedRef<T>,
  ) => {
    const {
      formName = 'rule',
      linkText,
      linkOnclick,
      sx,
      noRule = false,
      children,
      formRules,
      onClickOnCheckBox,
    } = props
    const form = useFormContext()
    return (
      <HBCheckBoxControllerRootStyle ref={ref} sx={sx}>
        {form && (
          <Controller
            name={formName}
            rules={
              !noRule
                ? {
                    validate: {
                      check: (v) => v || 'not exist',
                    },
                  }
                : formRules
            }
            control={form.control}
            render={({ field, formState: { errors } }) => (
              <>
                <HBCheckBox
                  {...field}
                  checked={!!field.value}
                  disabled={props.disabled}
                  onClick={(e) => onClickOnCheckBox && onClickOnCheckBox(e)}
                  defaultChecked={props.defaultChecked}
                  {...props}
                />
                {linkText && (
                  <Link underline="none" color="blue" onClick={linkOnclick && linkOnclick}>
                    {linkText}
                  </Link>
                )}
              </>
            )}
          />
        )}
        {children}
      </HBCheckBoxControllerRootStyle>
    )
  },
)

HBCheckBoxController.displayName = 'HBCheckBoxController'
HBCheckBoxController.defaultProps = {}

export default HBCheckBoxController

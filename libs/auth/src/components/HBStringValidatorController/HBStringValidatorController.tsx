import { HBTextField } from '@hasty-bazar/core'
import { Box, Grow, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import HBStringRuleValidator, { HBValidator } from './HBStringRuleValidator'
import { HBStringValidatorControllerRootStyle } from './HBStringValidatorController.styles'

export type HBStringValidatorControllerProps = {
  formName?: string
  label?: string
  sx?: SxProps<Theme>
  validatorFieldRules?: HBValidator[]
  validateCallBack?: (fields: string) => Promise<string | undefined>
}
export type errorFunctionHandlerType = (id: number) => void

const HBStringValidatorController = forwardRef(
  <T extends HTMLDivElement>(props: HBStringValidatorControllerProps, ref: ForwardedRef<T>) => {
    const { formName = 'name', label = 'نام', sx, validatorFieldRules } = props
    const form = useFormContext()
    const [focused, setFocused] = useState<boolean>(false)
    const [err, setErr] = useState<string[]>([])

    const setError: errorFunctionHandlerType = (id) =>
      setErr((prev) => (prev.find((item) => item === String(id)) ? prev : [...prev, String(id)]))
    const clearError: errorFunctionHandlerType = (id) =>
      setErr((prev) => prev.filter((item) => item !== String(id)))

    useEffect(() => {
      if (err.length > 0) form.setError(formName, { message: 'error' })
      else form.clearErrors(formName)
    }, [err])

    return (
      <HBStringValidatorControllerRootStyle ref={ref} sx={sx}>
        {form && (
          <Controller
            name={formName}
            control={form.control}
            rules={{
              validate: () => {
                return err.length > 0 ? 'error' : undefined
              },
            }}
            render={({ field, formState: { errors } }) => {
              return (
                <>
                  <HBTextField
                    label={label}
                    {...field}
                    fullWidth
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                      setFocused(false)
                      field.onBlur()
                    }}
                    error={!!errors[formName]?.message}
                  />
                  {validatorFieldRules && (
                    <Grow
                      in={focused}
                      unmountOnExit
                      mountOnEnter
                      timeout={{ enter: 800, exit: 100 }}
                    >
                      <Box>
                        <HBStringRuleValidator
                          value={field.value}
                          rules={validatorFieldRules}
                          setError={setError}
                          clearError={clearError}
                        />
                      </Box>
                    </Grow>
                  )}
                </>
              )
            }}
          />
        )}
      </HBStringValidatorControllerRootStyle>
    )
  },
)

HBStringValidatorController.displayName = 'HBStringValidatorController'
HBStringValidatorController.defaultProps = {}

export default HBStringValidatorController

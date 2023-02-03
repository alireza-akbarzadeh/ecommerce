import { ForwardedRef, forwardRef } from 'react'
import { HBStringValidation } from '../HBStringValidation'
import { HBValidatorFieldRootStyle } from './HBValidatorField.styles'

export type HBValidatorFieldRulesType = {
  isActive?: boolean
  text: string
  validator?: RegExp
}
export type HBValidatorFieldProps = {
  rules: HBValidatorFieldRulesType[]
  value: string
}

const HBValidatorField = forwardRef(
  <T extends HTMLDivElement>(props: HBValidatorFieldProps, ref: ForwardedRef<T>) => {
    const { value, rules } = props
    return (
      <HBValidatorFieldRootStyle ref={ref} {...props} sx={{ mt: 6 }}>
        {rules.map(({ isActive = false, text, validator }) => {
          const isValid = validator ? validator.test(value) : isActive
          return <HBStringValidation sx={{ mt: 2 }} isActive={isValid} text={text} />
        })}
      </HBValidatorFieldRootStyle>
    )
  },
)

HBValidatorField.displayName = 'HBValidatorField'
HBValidatorField.defaultProps = {}

export default HBValidatorField

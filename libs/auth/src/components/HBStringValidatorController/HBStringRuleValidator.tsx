import { HBStringValidation } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { errorFunctionHandlerType } from './HBStringValidatorController'

export type validationType = (props: {
  resolve: () => void
  reject: () => void
  value: string | number
}) => void

export type HBValidator = {
  isActive?: boolean
  text: string
  pattern?: RegExp
  validation?: validationType
}

export type HBStringRuleValidatorProps = {
  rules: HBValidator[]
  value: string | number
  setError: errorFunctionHandlerType
  clearError: errorFunctionHandlerType
}

type test = {
  resolve: () => void
  reject: () => void
}
const executer = (cb: validationType, value: string | number) =>
  new Promise<void>((resolve, reject) => {
    cb({ resolve, reject, value })
  })

const HBStringRuleValidator = ({
  value,
  rules,
  setError,
  clearError,
}: HBStringRuleValidatorProps): JSX.Element => {
  return (
    <Box sx={{ mt: 6 }}>
      {rules.map(({ validation, text, isActive, pattern }, key) => {
        const [state, setState] = useState<'loading' | 'success' | 'fail'>('fail')
        const execute = () => {
          if (validation)
            executer(validation, value)
              .then(() => setState('success'))
              .catch(() => setState('fail'))
        }
        useEffect(() => {
          let timer: NodeJS.Timeout
          if (validation) {
            setState('loading')
            timer = setTimeout(execute, 1000)
          } else if (pattern) {
            setState(pattern.test(value as string) ? 'success' : 'fail')
          } else if (isActive) setState('success')
          else setState('fail')

          return () => {
            if (timer) clearInterval(timer)
          }
        }, [value])
        useEffect(() => {
          if (state === 'success') clearError(key)
          else setError(key)
        }, [state])

        return (
          <HBStringValidation
            isActive={state === 'success' ? true : false}
            loading={state === 'loading' ? true : false}
            text={text}
          />
        )
      })}
    </Box>
  )
}

HBStringRuleValidator.displayName = 'HBStringRuleValidator'
HBStringRuleValidator.defaultProps = {}

export default HBStringRuleValidator

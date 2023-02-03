import { HBSuggest, HBSuggestProps } from '@hasty-bazar/core'
import { FC } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'

interface HBSuggestControllerProps extends Omit<HBSuggestProps, 'onChange' | 'value'> {
  name: string
  formRules?: RegisterOptions
}

const HBSuggestController: FC<HBSuggestControllerProps> = ({ name, formRules, ...props }) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      rules={formRules}
      render={({ field }) => {
        return <HBSuggest {...props} {...field} />
      }}
    />
  )
}

export default HBSuggestController

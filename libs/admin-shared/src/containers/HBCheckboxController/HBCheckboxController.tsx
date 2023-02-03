import { HBCheckBox } from '@hasty-bazar/core'
import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormGroup,
  FormLabel,
  FormLabelTypeMap,
} from '@mui/material'
import { FC, memo } from 'react'
import { RegisterOptions, useController, useFormContext } from 'react-hook-form'

export interface HBSelectControllerProps {
  name: string
  formRules?: RegisterOptions
  checkBoxItems?: Array<
    {
      value: string | number
      title: string
    } & Partial<FormControlLabelProps>
  >
  defaultValue?: string
  label?: string
  InputLabelProps?: FormLabelTypeMap<{}, 'label'>['props']
  disabled?: boolean
}
const HBCheckboxController: FC<HBSelectControllerProps> = ({
  name,
  formRules,
  checkBoxItems,
  defaultValue,
  label,
  InputLabelProps,
  ...props
}) => {
  const { formState, control } = useFormContext()
  const { field } = useController({
    name,
    control,
  })
  return (
    <FormControl>
      <FormLabel {...InputLabelProps}>{label}</FormLabel>
      <FormGroup defaultValue={defaultValue}>
        {checkBoxItems?.map((item, index) => {
          return (
            <FormControlLabel
              key={index}
              control={
                <HBCheckBox
                  name={item.title}
                  disabled={props.disabled}
                  checked={field.value === item.value}
                  value={item.value}
                  onChange={(event) => field.onChange(event.target.value)}
                />
              }
              label={item.title}
              {...item}
            />
          )
        })}
      </FormGroup>
    </FormControl>
  )
}

export default memo(HBCheckboxController)

import { HBIcon } from '@hasty-bazar/core'
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  FormLabelTypeMap,
  Radio,
  RadioGroup,
} from '@mui/material'
import { FC, memo } from 'react'
import { RegisterOptions, useController, useFormContext } from 'react-hook-form'

export interface HBSelectControllerProps {
  name: string
  formRules?: RegisterOptions
  radioGroupItem?: Array<{
    value: string | number
    title: string
  }>
  defaultValue?: string
  InputLabelProps?: FormLabelTypeMap<{}, 'label'>['props']
  label?: string
  disabled?: boolean
}
const HBRadioController: FC<HBSelectControllerProps> = ({
  name,
  formRules,
  radioGroupItem,
  defaultValue,
  InputLabelProps,
  label,
  ...props
}) => {
  const { formState, control } = useFormContext()
  const { field } = useController({
    name,
    control,
    rules: formRules,
  })
  const error = !!formState.errors[name]

  const errorMessage = formState.errors[name]?.message
  return (
    <FormControl>
      <FormLabel {...InputLabelProps}>{label}</FormLabel>
      <RadioGroup
        name={name}
        value={field.value}
        onChange={(event) => field.onChange(event.target.value)}
        defaultValue={defaultValue}
      >
        {radioGroupItem?.map((item, index) => {
          return (
            <FormControlLabel
              disabled={props.disabled}
              key={index}
              value={item.value}
              checked={field.value === item.value}
              control={<Radio />}
              label={item.title}
            />
          )
        })}
      </RadioGroup>
      {error && (
        <FormHelperText
          sx={(theme) => {
            return {
              color: theme.palette.error.main,
              fontSize: theme.typography.caption.fontSize,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }
          }}
        >
          <>
            <HBIcon size="small" type="infoCircle" />
            {errorMessage}
          </>
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default memo(HBRadioController)

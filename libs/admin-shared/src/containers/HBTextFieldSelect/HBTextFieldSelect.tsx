import { HBSelectProps } from '@hasty-bazar/core'
import {
  filledInputClasses,
  MenuItem,
  outlinedInputClasses,
  Select,
  selectClasses,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { FC, useState } from 'react'

type HBTextFieldSelectProps = TextFieldProps & {
  textFieldLabel: string
  textFieldReturnValue: (text: string) => void
  selectItems: Array<{
    title: string
    value: string | number
  }>
  helperText?: string
  selectProps?: Partial<HBSelectProps>
  regExp?: string
  textFieldDisabled?: boolean
  selectItemsDisabled?: boolean
}

const HBTextFieldSelect: FC<HBTextFieldSelectProps> = ({
  textFieldLabel,
  textFieldReturnValue,
  selectItems,
  helperText,
  selectProps,
  regExp,
  textFieldDisabled,
  selectItemsDisabled,
  ...props
}: HBTextFieldSelectProps) => {
  const [textFieldValue, setTextFieldValue] = useState<string>('')

  const handleChangeTextField = (event: any) => {
    if (regExp) {
      const regEx = new RegExp(regExp as string)
      const testedString = regEx.test(event.target.value as string)
      if (testedString) {
        setTextFieldValue(event.target.value as string)
        textFieldReturnValue(event.target.value as string)
      }
    } else {
      setTextFieldValue(event.target.value as string)
      textFieldReturnValue(event.target.value as string)
    }
  }

  return (
    <TextField
      disabled={textFieldDisabled}
      fullWidth
      size="small"
      label={textFieldLabel}
      helperText={helperText}
      value={textFieldValue}
      onChange={handleChangeTextField}
      sx={{
        [`& .${outlinedInputClasses.root}`]: {
          paddingRight: 0,
        },
      }}
      InputProps={{
        endAdornment: (
          <Select
            disabled={selectItemsDisabled}
            size="small"
            variant="filled"
            {...selectProps}
            sx={{
              [`&.${filledInputClasses.root}`]: ({ spacing }) => ({
                borderTopLeftRadius: spacing(0),
                borderBottomRightRadius: spacing(1),
              }),
              [`&.${filledInputClasses.root}::before`]: {
                borderBottom: 0,
              },
              [`&.${filledInputClasses.root}:hover::before`]: {
                borderBottom: 0,
              },
              [`&.${filledInputClasses.root}::after`]: {
                borderBottomColor: 'transparent',
              },
              [`& .${selectClasses.select}`]: ({ spacing }) => ({
                paddingTop: spacing(2),
                paddingBottom: spacing(2),
              }),
            }}
          >
            {selectItems.map(({ title, value }) => (
              <MenuItem key={value} value={value}>
                {title}
              </MenuItem>
            ))}
          </Select>
        ),
      }}
      {...props}
    />
  )
}

export default HBTextFieldSelect

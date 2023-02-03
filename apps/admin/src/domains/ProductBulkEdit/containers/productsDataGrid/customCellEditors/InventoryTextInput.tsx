import { HBTextField, HBTextFieldProps } from '@hasty-bazar/core'
import { TextField } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { NumericFormat, OnValueChange } from 'react-number-format'

export const HBInventoryTextFieldEditor = forwardRef((props: ICellRendererParams, ref) => {
  const [selectedValue, setSelectedValue] = useState(props.value)

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return selectedValue
      },
    }
  })

  const onChangeHandler: OnValueChange = (values) => {
    setSelectedValue(values.floatValue)
  }
  return (
    <NumericFormat<HBTextFieldProps>
      onValueChange={onChangeHandler}
      value={selectedValue as unknown as string}
      size="small"
      decimalScale={0}
      customInput={TextField as any}
    />
  )
})

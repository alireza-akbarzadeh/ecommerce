import { HBTextField } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import { forwardRef, useImperativeHandle, useState } from 'react'

export const HBPriceTextFieldEditor = forwardRef((props: ICellRendererParams, ref) => {
  const [selectedValue, setSelectedValue] = useState(props.value)
  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return selectedValue
      },
    }
  })

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedValue(event.target.value)
  }
  return (
    <HBTextField
      maskOptions={{
        mask: Number,
        thousandsSeparator: ',',
        valueType: 'unmaskedValue',
      }}
      value={selectedValue}
      onChange={onChangeHandler}
    />
  )
})

import { HBTextField } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import { forwardRef, useImperativeHandle, useState } from 'react'

export const HBInventoryTextFieldEditor = forwardRef((props: ICellRendererParams, ref) => {
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
      value={selectedValue}
      maskOptions={{
        mask: Number,
        scale: 0,
      }}
      onChange={onChangeHandler}
    />
  )
})

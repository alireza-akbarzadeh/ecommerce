import { HBSwitch } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import { forwardRef, useImperativeHandle, useState } from 'react'

export const HBSwitchEditor = forwardRef((props: ICellRendererParams, ref) => {
  const [selectedValue, setSelectedValue] = useState(props.value)
  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return selectedValue
      },
    }
  })

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.checked)
  }
  return <HBSwitch onChange={onChangeHandler} checked={selectedValue} />
})

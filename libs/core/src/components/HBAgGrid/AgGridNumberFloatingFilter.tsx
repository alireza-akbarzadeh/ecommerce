import { Box, InputBase } from '@mui/material'
import { IFloatingFilterParams, NumberFilterModel } from 'ag-grid-community'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

export interface CustomParams extends IFloatingFilterParams {
  suppressFilterButton: boolean
  color: string
}

const NumberFloatingFilter = forwardRef((props: CustomParams, ref) => {
  const [currentValue, setCurrentValue] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => {
    return {
      onParentModelChanged(parentModel: NumberFilterModel) {
        if (!parentModel) {
          inputRef.current!.value = ''
          setCurrentValue(null)
        } else {
          inputRef.current!.value = parentModel.filter + ''
          setCurrentValue(parentModel.filter!)
        }
      },
    }
  })

  const onInputBoxChanged = (input: any) => {
    if (input.target.value === '') {
      props.parentFilterInstance((instance) => {
        instance.onFloatingFilterChanged(null, null)
      })
      return
    }

    setCurrentValue(Number(input.target.value))
    props.parentFilterInstance((instance) => {
      instance.onFloatingFilterChanged('equal', input.target.value)
    })
  }

  return (
    <Box sx={{ m: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
      <InputBase
        sx={(theme) => ({
          width: '100%',
          height: 30,
          border: `solid 1px ${theme.palette.grey[300]}`,
          borderRadius: theme.spacing(2),
          '& input': {
            pt: 2,
            pl: 2,
          },
        })}
        ref={inputRef}
        type="number"
        onInput={onInputBoxChanged}
      />
    </Box>
  )
})

export default NumberFloatingFilter

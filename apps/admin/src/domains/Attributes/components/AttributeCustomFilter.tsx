import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export interface AttributeCustomFilterProps extends IFilterParams {
  enums: GetBusinessTypeValuesQueryResult[]
}

type AttributeCustomFilterItems = {
  title?: string | null
  value?: string
}

export default forwardRef(({ enums, ...props }: AttributeCustomFilterProps, ref) => {
  const items: AttributeCustomFilterItems[] = enums.map((item) => {
    return { title: item.name, value: item.id }
  })

  const [filterValue, setFilterValue] = useState<string>()

  // expose AG Grid Filter Lifecycle callbacks
  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params: IDoesFilterPassParams) {
        return !!filterValue
      },

      isFilterActive() {
        return !!filterValue
      },

      // this example isn't using getModel() and setModel(),
      // so safe to just leave these empty. don't do this in your code!!!
      getModel() {
        return {
          filter: filterValue,
          filterType: 'number',
          type: 'equals',
        }
      },

      setModel() {},
    }
  })

  const onSelectChange = (event: SelectChangeEvent<string>) => {
    setFilterValue(event.target.value)
  }

  useEffect(() => {
    props.filterChangedCallback()
  }, [filterValue])

  if (!enums) return null

  return (
    <Box sx={{ height: 100, width: 300, maxWidth: '100%', pt: 5, px: 2 }}>
      <Select
        sx={{
          backgroundColor: (theme) => theme.palette.common.white,
          height: 30,
          '&:placeholder': {
            color: 'red',
            opacity: 1,
          },
        }}
        fullWidth
        inputProps={{
          style: {
            color: 'red',
          },
        }}
        placeholder="فیلتر"
        size="small"
        onChange={onSelectChange}
        variant="outlined"
      >
        <MenuItem value="">همه</MenuItem>
        {items.map((item) => {
          return (
            <MenuItem key={item.value} value={item.value}>
              {item.title}
            </MenuItem>
          )
        })}
      </Select>
    </Box>
  )
})

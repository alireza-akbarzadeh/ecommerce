import { HBSelect } from '@hasty-bazar/core'
import { SelectChangeEvent } from '@mui/material'
import { FC } from 'react'
import type { Field, FieldSelectorProps } from 'react-querybuilder'

const FieldSelector: FC<FieldSelectorProps> = (props) => {
  const onChangeFiled = (event: SelectChangeEvent<unknown>) => {
    props.handleOnChange(event?.target?.value as string)
  }

  return (
    <HBSelect
      value={props.value}
      onChange={onChangeFiled}
      size="small"
      sx={{
        minWidth: 180,
        mr: 1,
      }}
      menuItem={
        (props.options as Field[]).map((option) => {
          return {
            title: option?.label,
            value: option?.name ? option?.name : option?.label,
          }
        }) as {
          title: string
          value: string | number
        }[]
      }
      label=""
    />
  )
}

export default FieldSelector

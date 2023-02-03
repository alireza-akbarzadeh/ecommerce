import { HBSelect } from '@hasty-bazar/core'
import { SelectChangeEvent } from '@mui/material'
import { FC } from 'react'
import type { NameLabelPair, OptionGroup } from 'react-querybuilder'

interface OperatorSelectorProps {
  handleOnChange: (value: any) => void
  value?: string | undefined
  options: NameLabelPair[] | OptionGroup<NameLabelPair>[]
}

const OperatorSelector: FC<OperatorSelectorProps> = ({ handleOnChange, value, options }) => {
  const onChange = (event: SelectChangeEvent<unknown>, child: React.ReactNode) => {
    handleOnChange(event.target.value)
  }

  return (
    <HBSelect
      value={value}
      onChange={onChange}
      size="small"
      sx={{
        minWidth: 133,
        marginRight: 1,
      }}
      menuItem={
        options?.map((option) => {
          return {
            title: option?.label,
            value: (option as any)?.name ? (option as any)?.name : option?.label,
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

export default OperatorSelector

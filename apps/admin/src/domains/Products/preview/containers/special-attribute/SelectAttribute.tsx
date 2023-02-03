import { PreviewSpecificAttributeDto } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBSelect } from '@hasty-bazar/core'
import { SelectChangeEvent, Typography } from '@mui/material'
import { FC } from 'react'

interface ISelectAttributeProps extends PreviewSpecificAttributeDto {
  onChange: (key: string, value: string) => void
}

const SelectAttribute: FC<ISelectAttributeProps> = (props) => {
  const specificSelectedValues: any = {}
  const { onChange, id, name, values = [] } = props

  const handleChange = (event: SelectChangeEvent) => {
    onChange(id!, event.target.value as string)
  }

  return (
    <>
      <Typography variant="subtitle2" color="text.primary">
        {name}:
      </Typography>
      <HBSelect
        value={`${specificSelectedValues[id!]}`}
        menuItem={values!.map((value) => {
          return { title: value.value ?? '', value: value.id ?? '' }
        })}
        size="small"
        placeholder=""
        label=""
        sx={{
          height: 33,
          minWidth: 120,
        }}
        onChange={handleChange}
      />
    </>
  )
}

export default SelectAttribute

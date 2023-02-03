import { SpecificAttributeDto } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useProductDetail } from '../../ProductDetailContext'

interface IRadioAttributeProps extends SpecificAttributeDto {
  onChange: (key: string, value: string) => void
}

const RadioAttribute: FC<IRadioAttributeProps> = (props) => {
  const { onChange, values = [], id, name } = props
  const { specificSelectedValues } = useProductDetail()

  const handleChange = (valueId: string) => {
    if (!id) return
    if (specificSelectedValues[id] !== valueId) {
      onChange(id, valueId)
    }
  }

  return (
    <>
      <Typography variant="subtitle2" color="text.primary">
        {name}: ({values?.find((x) => x.id === specificSelectedValues[id!])?.value})
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        {values!.map((value) => (
          <Box
            onClick={() => handleChange(value.id!)}
            sx={(theme) => ({
              width: 24,
              height: 24,
              backgroundColor: value.color,
              border: `1px solid ${theme.palette.grey[300]}`,
              ...(specificSelectedValues[id!] === value.id && {
                border: (theme) => `2px solid ${theme.palette.primary.main}`,
              }),
              cursor: 'pointer',
              borderRadius: 4,
            })}
          />
        ))}
      </Stack>
    </>
  )
}

export default RadioAttribute

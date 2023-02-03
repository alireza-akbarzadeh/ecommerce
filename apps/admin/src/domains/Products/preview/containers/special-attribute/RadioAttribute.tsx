import { PreviewSpecificAttributeDto } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'

interface IRadioAttributeProps extends PreviewSpecificAttributeDto {
  onChange: (key: string, value: string) => void
}

const RadioAttribute: FC<IRadioAttributeProps> = (props) => {
  const { onChange, values = [], id, name } = props
  const specificSelectedValues: any = {}

  const handleChange = (valueId: string) => {
    if (!id) return
    if (specificSelectedValues[id] !== valueId) {
      onChange(id, valueId)
    }
  }

  return (
    <>
      <Typography variant="subtitle2" color="text.primary">
        {name}:
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        {values!.map((value) => (
          <Box
            onClick={() => handleChange(value.id!)}
            sx={{
              width: 16,
              height: 16,
              backgroundColor: value.color,
              ...(specificSelectedValues[id!] === value.id && {
                border: (theme) => `2px solid ${theme.palette.primary.main}`,
              }),
              cursor: 'pointer',
              borderRadius: 4,
            }}
          />
        ))}
      </Stack>
    </>
  )
}

export default RadioAttribute

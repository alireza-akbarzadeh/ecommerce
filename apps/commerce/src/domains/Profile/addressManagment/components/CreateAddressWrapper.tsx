import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'

const CreateAddressWrapper = () => {
  return (
    <Stack
      sx={{
        width: '100%',
        bgcolor: 'grey.100',
        paddingRight: 2,
        paddingLeft: 4,
        py: 2,
        borderRadius: 2,
      }}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography variant="subtitle1" color="text.primary">
        آدرس
      </Typography>
      <HBButton sx={{ width: 103, minWidth: 103 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <HBIcon type="plus" />
          <Typography variant="button" color="background.paper">
            ایجاد
          </Typography>
        </Stack>
      </HBButton>
    </Stack>
  )
}

export default CreateAddressWrapper

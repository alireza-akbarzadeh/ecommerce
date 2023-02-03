import { Stack, StackTypeMap } from '@mui/material'

const WhiteBox = (props: StackTypeMap<{}, 'div'>['props']) => {
  return (
    <Stack
      sx={{
        position: 'relative',
        zIndex: 1,
      }}
      bgcolor="common.white"
      borderRadius={4}
      {...props}
    />
  )
}

export default WhiteBox

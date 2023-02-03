import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'

const TextWithColor: FC<{ color?: string; text?: string }> = ({ color, text }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {color && (
        <Box
          sx={{
            borderRadius: '100%',
            border: (theme) => `1px solid ${theme.palette.grey[100]}`,
            width: 24,
            height: 24,
            backgroundColor: color,
          }}
        />
      )}
      {text && <Typography variant="body2">{text}</Typography>}
    </Stack>
  )
}

export default TextWithColor

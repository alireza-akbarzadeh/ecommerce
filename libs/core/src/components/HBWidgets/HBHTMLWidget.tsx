import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'

export interface HBHTMLWidgetProps {
  name: string
  title: string
}

const HBHTMLWidget: FC<HBHTMLWidgetProps> = (props) => {
  return (
    <Stack p={6} bgcolor={'common.white'} borderRadius={4}>
      <Typography>{props.name}</Typography>
      <Typography>{props.title}</Typography>
      <Box mt={6} dangerouslySetInnerHTML={{ __html: (props as any).value || '' }} />
    </Stack>
  )
}

export default HBHTMLWidget

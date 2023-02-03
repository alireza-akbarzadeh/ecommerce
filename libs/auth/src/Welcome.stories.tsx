import { Box } from '@mui/material'
import { Meta } from '@storybook/react'

export const WelcomeStory = () => <Box sx={{ direction: 'rtl' }}>استوری نمونه کماپوننت</Box>

export default {
  component: WelcomeStory,
  title: 'auth/Welcome',
  parameters: {
    options: {
      showPanel: false,
    },
  },
  id: '1',
} as Meta<object>

export const Welcome = WelcomeStory.bind({})

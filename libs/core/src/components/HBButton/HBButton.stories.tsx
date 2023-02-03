import { Box } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import HBButton, { HBButtonProps } from './HBButton'
import HBButtonDoc from './HBButton.doc'

export default {
  component: HBButton,
  parameters: {
    docs: {
      page: HBButtonDoc,
    },
    options: {
      showPanel: true,
    },

    design: {
      type: 'figma',
      title: 'Figma Button',
      url: 'https://www.figma.com/file/ir6G7StIV549MaLsMX3B1o/DLS---Core?node-id=2%3A493',
    },
  },
  title: 'core/HBButton',
} as Meta<HBButtonProps>

const Template: Story<HBButtonProps> = (args) => (
  <Box
    sx={{
      bgcolor: 'common.white',
      height: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <HBButton {...args}>لیبل دکمه</HBButton>
  </Box>
)

export const Primary = Template.bind({})
Primary.args = {}

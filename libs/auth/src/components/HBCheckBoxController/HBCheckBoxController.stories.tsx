import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBCheckBoxController from './HBCheckBoxController'
import HBCheckBoxControllerDoc from './HBCheckBoxController.doc'

const { log } = console

type HBCheckBoxControllerStoryType = object
const argTypes: ArgTypes<HBCheckBoxControllerStoryType> = {}

export default {
  component: HBCheckBoxController,
  parameters: {
    docs: {
      page: HBCheckBoxControllerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBCheckBoxController',
  argTypes,
} as Meta<HBCheckBoxControllerStoryType>

interface HBFormInputs {
  password: string
}

const Template: Story<HBCheckBoxControllerStoryType> = (args) => {
  return (
    <Box sx={{ m: 5 }}>
      <HBForm<HBFormInputs>
        mode="all"
        sx={{ width: 400 }}
        onSubmit={(data) => {
          log(data)
        }}
      >
        <HBCheckBoxController {...args} />
      </HBForm>
    </Box>
  )
}

export const Primary: Story<HBCheckBoxControllerStoryType> = Template.bind({})
Primary.args = {}

import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBPasswordController from './HBPasswordController'
import HBPasswordControllerDoc from './HBPasswordController.doc'

const { log } = console

type HBPasswordControllerStoryType = object
const argTypes: ArgTypes<HBPasswordControllerStoryType> = {}

export default {
  component: HBPasswordController,
  parameters: {
    docs: {
      page: HBPasswordControllerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBPasswordController',
  argTypes,
} as Meta<HBPasswordControllerStoryType>

interface HBFormInputs {
  password: string
}

const Template: Story<HBPasswordControllerStoryType> = (args) => {
  return (
    <Box sx={{ m: 5 }}>
      <HBForm<HBFormInputs>
        mode="all"
        sx={{ width: 400 }}
        onSubmit={(data) => {
          log(data)
        }}
      >
        <HBPasswordController {...args} />
      </HBForm>
    </Box>
  )
}

export const Primary: Story<HBPasswordControllerStoryType> = Template.bind({})
Primary.args = {}

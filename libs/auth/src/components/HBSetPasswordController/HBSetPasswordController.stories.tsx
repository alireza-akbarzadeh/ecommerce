import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBChangePasswordController from './HBSetPasswordController'
import HBChangePasswordControllerDoc from './HBSetPasswordController.doc'

const { log } = console

type HBChangePasswordControllerStoryType = object
const argTypes: ArgTypes<HBChangePasswordControllerStoryType> = {}

export default {
  component: HBChangePasswordController,
  parameters: {
    docs: {
      page: HBChangePasswordControllerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBChangePasswordController',
  argTypes,
} as Meta<HBChangePasswordControllerStoryType>

interface HBFormInputs {
  password: string
}

const Template: Story<HBChangePasswordControllerStoryType> = (args) => {
  return (
    <Box sx={{ m: 5 }}>
      <HBForm<HBFormInputs>
        mode="all"
        sx={{ width: 400 }}
        onSubmit={(data) => {
          log(data)
        }}
      >
        <HBChangePasswordController {...args} />
      </HBForm>
    </Box>
  )
}

export const Primary: Story<HBChangePasswordControllerStoryType> = Template.bind({})
Primary.args = {}

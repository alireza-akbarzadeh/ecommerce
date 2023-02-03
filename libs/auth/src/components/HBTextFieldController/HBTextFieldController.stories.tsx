import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBTextFieldController, { HBTextFieldControllerProps } from './HBTextFieldController'
import HBTextFieldControllerDoc from './HBTextFieldController.doc'

const { log } = console

type HBTextFieldControllerStoryType = HBTextFieldControllerProps
const argTypes: ArgTypes<HBTextFieldControllerStoryType> = {
  label: {},
  name: {},
  digitMapper: Boolean,
}

export default {
  component: HBTextFieldController,
  parameters: {
    docs: {
      page: HBTextFieldControllerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBTextFieldController',
  argTypes,
} as Meta<HBTextFieldControllerStoryType>

interface HBFormInputs {
  password: string
}

const Template: Story<HBTextFieldControllerStoryType> = (args) => {
  return (
    <Box sx={{ m: 5 }}>
      <HBForm<HBFormInputs>
        mode="all"
        sx={{ width: 400 }}
        onSubmit={(data) => {
          log(data)
        }}
      >
        <HBTextFieldController {...args} />
      </HBForm>
    </Box>
  )
}

export const Primary: Story<HBTextFieldControllerStoryType> = Template.bind({})
Primary.args = {}

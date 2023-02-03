import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBChangePasswordFormItem from './HBSetPasswordFormItem'
import HBChangePasswordFormItemDoc from './HBSetPasswordFormItem.doc'

const { log } = console

type HBChangePasswordFormItemStoryType = object
const argTypes: ArgTypes<HBChangePasswordFormItemStoryType> = {}

export default {
  component: HBChangePasswordFormItem,
  parameters: {
    docs: {
      page: HBChangePasswordFormItemDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBChangePasswordFormItem',
  argTypes,
} as Meta<HBChangePasswordFormItemStoryType>

interface HBFormInputs {
  password: string
}
const Template: Story<HBChangePasswordFormItemStoryType> = (args) => {
  return (
    <Box sx={{ margin: 5 }}>
      <HBForm<HBFormInputs>
        mode="all"
        sx={{ width: 400 }}
        onSubmit={(data) => {
          log(data)
        }}
      >
        <HBChangePasswordFormItem {...args} />
      </HBForm>
    </Box>
  )
}

export const Primary: Story<HBChangePasswordFormItemStoryType> = Template.bind({})
Primary.args = {}

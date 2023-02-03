import { HBForm, HBValidatorFieldRulesType } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ArgTypes, Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { HBValidator } from './HBStringRuleValidator'
import HBStringValidatorController from './HBStringValidatorController'
import HBStringValidatorControllerDoc from './HBStringValidatorController.doc'

const { log } = console

type HBStringValidatorControllerStoryType = object
const argTypes: ArgTypes<HBStringValidatorControllerStoryType> = {}

export default {
  component: HBStringValidatorController,
  parameters: {
    docs: {
      page: HBStringValidatorControllerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBStringValidatorController',
  argTypes,
} as Meta<HBStringValidatorControllerStoryType>

interface HBFormInputs {
  password: string
}

const Template: Story<HBStringValidatorControllerStoryType> = (args) => {
  const [data, setData] = useState<HBValidatorFieldRulesType[]>([
    {
      isActive: true,
      text: 'نام',
    },
    {
      isActive: true,
      text: 'نام خانوادگی',
    },
  ])
  const delay = (time: number): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(() => resolve(), time)
    })

  const FieldRules: HBValidator[] = [
    {
      isActive: false,
      text: ' حداقل یک کاراکتر خاص',
      validation: async ({ resolve, reject, value }) => {
        await delay(3000)
        if (value === 'okok') resolve()
        else reject()
      },
    },
    {
      isActive: true,
      text: ' حداقل یک کاراکتر خاص',
    },
    { isActive: false, text: 'حداقل  یک عدد', pattern: RegExp('(.*\\d.*)') },
  ]
  return (
    <Box sx={{ m: 5 }}>
      <HBForm<HBFormInputs>
        mode="all"
        sx={{ width: 400 }}
        onSubmit={(data) => {
          log(data)
        }}
      >
        <HBStringValidatorController {...args} validatorFieldRules={FieldRules} />
      </HBForm>
    </Box>
  )
}

export const Primary: Story<HBStringValidatorControllerStoryType> = Template.bind({})
Primary.args = {}

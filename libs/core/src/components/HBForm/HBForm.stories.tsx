import { Meta, Story } from '@storybook/react'
import HBForm, { HBFormProps } from './HBForm'
import HBFormDoc from './HBForm.doc'
export default {
  component: HBForm,
  parameters: {
    docs: {
      page: HBFormDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBForm',
} as Meta<HBFormProps<IFormInputs>>

const { log } = console

interface IFormInputs {
  firstName: string
  age: number
}

const Template: Story<HBFormProps<IFormInputs>> = (args) => {
  return (
    <HBForm<IFormInputs>
      onSubmit={(data) => {
        log(data)
      }}
      defaultValues={{ age: 1212 }}
    >
      {(params) => {
        log(
          "🚀 ~ file: HBForm.stories.tsx ~ line 31 ~ params.getValues('age')",
          params.getValues('age'),
        )
        return <>ddddd</>
      }}
    </HBForm>
  )
}

export const Primary: Story<HBFormProps<IFormInputs>> = Template.bind({})
Primary.args = {}

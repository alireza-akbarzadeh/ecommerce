import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/system'
import { ArgTypes, Meta, Story } from '@storybook/react'
import { useState } from 'react'
import HBEmailPhoneNumberFormItem, {
  HBEmailPhoneNumberFormItemProps,
} from './HBEmailPhoneNumberFormItem'
import HBEmailPhoneNumberFormItemDoc from './HBEmailPhoneNumberFormItem.doc'

type HBEmailPhoneNumberFormItemStoryType = {
  childrenText: string
} & HBEmailPhoneNumberFormItemProps

const argTypes: ArgTypes<HBEmailPhoneNumberFormItemStoryType> = {
  firstBtnLoading: {
    table: {
      disable: true,
    },
  },
  secondBtnLoading: {
    table: {
      disable: true,
    },
  },
  children: {
    table: {
      disable: true,
    },
  },
  childrenText: {
    type: 'string',
  },
}

export default {
  component: HBEmailPhoneNumberFormItem,
  parameters: {
    docs: {
      page: HBEmailPhoneNumberFormItemDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBEmailPhoneNumberFormItem',
  argTypes,
} as Meta<HBEmailPhoneNumberFormItemStoryType>

interface HBFormInputs {
  userName: string
}
const Template: Story<HBEmailPhoneNumberFormItemStoryType> = (args) => {
  const { formName = 'emailPhoneNumber', childrenText, ...otherProps } = args
  const [loading, setLoading] = useState(false)
  return (
    <Box sx={{ margin: 5 }}>
      <HBForm<HBFormInputs>
        mode="all"
        sx={{ width: 400 }}
        defaultValues={{ userName: '' }}
        onSubmit={(data) => {
          setLoading(true)
          setTimeout(() => setLoading(false), 5000)
        }}
        onInvalid={(error: any) => {
          const _error = error[formName].message
          if (_error) alert('خطا :‌' + _error)
        }}
      >
        <HBEmailPhoneNumberFormItem
          {...otherProps}
          formName={formName}
          firstBtnLoading={loading}
          secondBtnLoading={loading}
        >
          {childrenText && <Test text={childrenText} />}
        </HBEmailPhoneNumberFormItem>
      </HBForm>
    </Box>
  )
}
const Test = (props: { text: string }) => {
  return <h3>{props.text}</h3>
}

export const Primary: Story<HBEmailPhoneNumberFormItemStoryType> = Template.bind({})
Primary.args = {}

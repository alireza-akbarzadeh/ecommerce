import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/system'
import { ArgTypes, Meta, Story } from '@storybook/react'
import { useState } from 'react'
import HBVendorUsersRegisterFormItem, {
  HBVendorUsersRegisterFormItemProps,
} from './HBVendorUsersRegisterFormItem'
import HBVendorUsersRegisterFormItemDoc from './HBVendorUsersRegisterFormItem.doc'

type HBVendorUsersRegisterFormItemStoryType = {
  childrenText: string
} & HBVendorUsersRegisterFormItemProps

const argTypes: ArgTypes<HBVendorUsersRegisterFormItemStoryType> = {
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
  component: HBVendorUsersRegisterFormItem,
  parameters: {
    docs: {
      page: HBVendorUsersRegisterFormItemDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBVendorUsersRegisterFormItem',
  argTypes,
} as Meta<HBVendorUsersRegisterFormItemStoryType>

const Template: Story<HBVendorUsersRegisterFormItemStoryType> = (args) => {
  const { formName = 'emailPhoneNumber', childrenText, ...otherProps } = args
  const [loading, setLoading] = useState(false)

  return (
    <Box sx={{ m: 5 }}>
      <HBForm
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
        <HBVendorUsersRegisterFormItem
          {...otherProps}
          formName={formName}
          firstBtnLoading={loading}
          secondBtnLoading={loading}
        >
          {childrenText && <Test text={childrenText} />}
        </HBVendorUsersRegisterFormItem>
      </HBForm>
    </Box>
  )
}
const Test = (props: { text: string }) => {
  return <h3>{props.text}</h3>
}

export const Primary: Story<HBVendorUsersRegisterFormItemStoryType> = Template.bind({})
Primary.args = {}

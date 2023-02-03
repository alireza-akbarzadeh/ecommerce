import { HBForm } from '@hasty-bazar/core'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { ArgTypes, Meta, Story } from '@storybook/react'
import HBemailPhoneNumberController, {
  HBemailPhoneNumberControllerProps,
} from './HBemailPhoneNumberController'
import HBemailPhoneNumberControllerDoc from './HBemailPhoneNumberController.doc'

type HBemailPhoneNumberControllerStoryType = HBemailPhoneNumberControllerProps
const argTypes: ArgTypes<HBemailPhoneNumberControllerStoryType> = {}

export default {
  component: HBemailPhoneNumberController,
  parameters: {
    docs: {
      page: HBemailPhoneNumberControllerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'auth/HBemailPhoneNumberController',
  argTypes,
} as Meta<HBemailPhoneNumberControllerStoryType>

interface HBFormInputs {
  userName: string
}

const Template: Story<HBemailPhoneNumberControllerStoryType> = (args) => {
  const { formName = 'emailPhoneNumber' } = args
  return (
    <Box sx={{ margin: 5 }}>
      <HBForm<HBFormInputs>
        mode="all"
        sx={{ width: 300 }}
        defaultValues={{ userName: '' }}
        onSubmit={(data: any) => {
          alert('آدرس ایمیل / موبایل : ' + data[formName])
        }}
        onInvalid={(error: any) => {
          const _error = error[formName].message
          if (_error) alert('خطا :‌' + _error)
        }}
      >
        <HBemailPhoneNumberController {...args} />
        <Button type="submit" sx={{ marginTop: 5 }} variant="contained" fullWidth>
          ورود
        </Button>
      </HBForm>
    </Box>
  )
}

export const Primary: Story<HBemailPhoneNumberControllerStoryType> = Template.bind({})
Primary.args = {
  formName: 'emailPhoneNumber',
}

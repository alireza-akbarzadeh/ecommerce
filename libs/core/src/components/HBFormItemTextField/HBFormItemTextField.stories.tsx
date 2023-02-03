import { Box } from '@mui/material'
import { ArgTypes, Meta, Story } from '@storybook/react'
import { useFormValidationDebounce } from '../../utils'
import { HBButton } from '../HBButton'
import HBForm from '../HBForm/HBForm'
import HBFormItemTextField, { HBFormItemTextFieldProps } from './HBFormItemTextField'
import HBFormItemTextFieldDoc from './HBFormItemTextField.doc'

type HBFormItemTextFieldStoryType = HBFormItemTextFieldProps
const argTypes: ArgTypes<HBFormItemTextFieldStoryType> = {
  formName: {
    type: 'string',
  },
  label: {
    type: 'string',
  },
}

export default {
  component: HBFormItemTextField,
  parameters: {
    docs: {
      page: HBFormItemTextFieldDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBFormItemTextField',
  argTypes,
} as Meta<HBFormItemTextFieldStoryType>

interface HBFormInputs {
  password: string
}

const Template: Story<HBFormItemTextFieldStoryType> = (args) => {
  const { formName, arrayHelperText, ...arg } = args
  const debounce = useFormValidationDebounce(
    async (value) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (value === '09126045414') resolve()
          else reject('شماره حتما باید ۰۹۱۲۶۰۴۵۴۱۴')
        }, 1)
      }),
    800,
  )

  return (
    <Box sx={{ m: 5 }}>
      <HBForm<HBFormInputs>
        mode="all"
        sx={{ width: 400 }}
        onSubmit={(data) => {}}
        criteriaMode="all"
      >
        <HBFormItemTextField
          {...arg}
          formName={formName}
          rules={{
            validate: {
              minLength: (value) => (value.length > 2 ? undefined : 'نمیتواند از ۲ کمتر باشد.'),
              effensive: debounce,
            },
          }}
          arrayHelperText={arrayHelperText}
          maskOptions={{ mask: '09000000000' }}
        />
        {({ formState: { isDirty, isValid, isValidating } }) => (
          <HBButton fullWidth sx={{ mt: 4 }} disabled={!isValid || !isDirty || isValidating}>
            next
          </HBButton>
        )}
      </HBForm>
    </Box>
  )
}

export const Primary: Story<HBFormItemTextFieldStoryType> = Template.bind({})
Primary.args = {
  label: 'شماره موبایل',
  formName: 'userName',
  arrayHelperText: [
    { effensive: 'شماره حتما باید ۰۹۱۲۶۰۴۵۴۱۴' },
    { minLength: 'نمیتواند از ۲ کمتر باشد.' },
  ],
}

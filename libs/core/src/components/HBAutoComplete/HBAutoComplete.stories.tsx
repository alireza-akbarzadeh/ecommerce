import { Meta, Story } from '@storybook/react'
import { HBTextField } from '../HBTextField'
import HBAutoComplete, { HBAutocompleteProps } from './HBAutoComplete'
import HBAutoCompleteDoc from './HBAutoComplete.doc'

export default {
  component: HBAutoComplete,
  parameters: {
    docs: {
      page: HBAutoCompleteDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBAutoComplete',
  argTypes: {
    label: {
      name: 'label',
      type: 'string',
    },
  },
} as Meta<HBAutocompleteProps<any, true, false, true>>
const options = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
]

const Template: Story<HBAutocompleteProps<any, true, false, true>> = (args) => {
  const { renderInputProps, ...otherArgs } = args
  return (
    <HBAutoComplete
      options={options}
      {...otherArgs}
      renderInput={(params) => <HBTextField {...renderInputProps} {...params} />}
    />
  )
}

export const Primary = Template.bind({})
Primary.args = {}

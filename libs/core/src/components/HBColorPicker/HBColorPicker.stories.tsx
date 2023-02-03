import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import HBColorPicker, { HBColorPickerProps } from './HBColorPicker'
import HBColorPickerDoc from './HBColorPicker.doc'

export default {
  component: HBColorPicker,
  parameters: {
    docs: {
      page: HBColorPickerDoc,
    },
    options: {
      showPanel: true,
    },
  },
  title: 'core/HBColorPicker',
  argTypes: {},
} as Meta<HBColorPickerProps>

const Template: Story<HBColorPickerProps> = ({ onChange, ...args }) => {
  const [color, setColor] = useState('#333')

  const handleColorUpdate = (color: any) => {
    setColor(color.rgb)
  }

  return <HBColorPicker {...args} onChange={handleColorUpdate} color={color} />
}

export const Primary = Template.bind({})
Primary.args = {}

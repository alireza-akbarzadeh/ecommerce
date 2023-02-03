import { Typography } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import { Marker, Popup } from 'react-leaflet'
import HBMapLeaflet, { HBMapLeafletProps } from './HBMapLeaflet'
import HBMapLeafletDoc from './HBMapLeaflet.doc'

export default {
  component: HBMapLeaflet,
  parameters: {
    docs: {
      page: HBMapLeafletDoc,
    },
    options: {
      showPanel: true,
    },

    design: {
      type: 'figma',
      title: 'React Leaflet',
      url: '',
    },
  },
  title: 'core/HBMapLeaflet',
  argTypes: {},
} as Meta<HBMapLeafletProps>

const Template: Story<HBMapLeafletProps> = (args) => {
  return (
    <HBMapLeaflet {...args}>
      <Popup position={[35, 53]}>
        <Typography variant="caption">این متن داخل پاپ آپ است</Typography>
      </Popup>
      <Marker position={[35, 53]} />
    </HBMapLeaflet>
  )
}
export const Primary = Template.bind({})
Primary.args = {}

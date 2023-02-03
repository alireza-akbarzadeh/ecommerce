import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { Marker } from 'react-mapbox-gl'
import HBMapBox, { HBFeatureCedarCollection, HBMapBoxCedarProps } from './HBMapBoxCedar'
import HBMapBoxDoc from './HBMapBoxCedar.doc'

export default {
  component: HBMapBox,
  parameters: {
    docs: {
      page: HBMapBoxDoc,
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
  title: 'core/HBMapBoxCedar',
  argTypes: {},
} as Meta<HBMapBoxCedarProps>
const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`

const pinStyle = {
  cursor: 'pointer',
  fill: '#d00',
  stroke: 'none',
}

function Pin({ size = 20 }) {
  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <path d={ICON} />
    </svg>
  )
}
const lineLayout = {
  'line-cap': 'round' as const,
  'line-join': 'round' as const,
}

const linePaint = {
  'line-color': '#4790E5',
  'line-width': 12,
}

const polygonPaint = {
  'fill-color': '#6F788A',
  'fill-opacity': 0.7,
}

const multiPolygonPaint = {
  'fill-color': '#3bb2d0',
  'fill-opacity': 0.5,
}

const polygonData = {
  id: '958d69736add7643e4cc407312dd3943',
  type: 'Feature',
  properties: {},
  geometry: {
    coordinates: [
      [
        [51.51986328125034, 36.432176267372085],
        [48.839199218751304, 36.46752487295166],
        [50.069667968750935, 32.5582252988778],
        [60.61654296875079, 33.589293923838284],
        [58.59505859375113, 37.4507232342464],
        [52.04720703125108, 38.83313841802865],
        [51.51986328125034, 36.432176267372085],
      ],
    ],
    type: 'Polygon',
  },
}

const Template: Story<HBMapBoxCedarProps> = (args) => {
  const [features, setFeatures] = useState<HBFeatureCedarCollection>([])

  return (
    <HBMapBox
      {...args}
      drawControl={{ features }}
      isRtl
      center={[51.41, 35.7575]}
      token="f2eb58b2c28416b7503aa0ead6cd4db4f63a0a94"
      zoom={[16]}
    >
      <Marker key="12" coordinates={[51.41, 35.7575]} anchor="bottom">
        <Pin />
      </Marker>
    </HBMapBox>
  )
}

export const Primary = Template.bind({})
Primary.args = {}

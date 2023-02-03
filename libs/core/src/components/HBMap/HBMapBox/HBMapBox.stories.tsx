import { Button } from '@mui/material'
import { Box } from '@mui/system'
import { Meta, Story } from '@storybook/react'
import { useState } from 'react'
import { Feature, Layer, Marker } from 'react-mapbox-gl'
import HBMapBox, { HBFeatureCollection, HBMapBoxProps } from './HBMapBox'
import HBMapBoxDoc from './HBMapBox.doc'

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
  title: 'core/HBMapBox',
  argTypes: {},
} as Meta<HBMapBoxProps>
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

const Template: Story<HBMapBoxProps> = (args) => {
  const [features, setFeatures] = useState<HBFeatureCollection>([])

  return (
    <HBMapBox {...args} drawControl={{ features }}>
      <Marker key="12" coordinates={[51.41, 35.7575]} anchor="bottom">
        <Pin />
      </Marker>
      <Layer type="line" layout={lineLayout} paint={linePaint}>
        <Feature
          coordinates={[
            [53.001, 35.001],
            [53.002, 35.002],
            [53.003, 35.003],
            [53.004, 35.004],
            [53.005, 35.005],
            [53.006, 35.006],
            [53.007, 35.007],
            [53.008, 35.008],
            [53.009, 35.009],
            [53.01, 35.01],
            [53.011, 35.011],
            [53.012, 35.012],
            [53.013, 35.013],
            [53.02, 35.02],
            [53.03, 35.03],
            [53.04, 35.04],
            [53.05, 35.05],
            [53.06, 35.06],
            [53.07, 35.07],
            [53.08, 35.08],
            [53.09, 35.09],
            [54.1, 36.1],
          ]}
        />
      </Layer>

      {/* Circle example */}
      <Layer
        type="circle"
        paint={{
          'circle-radius': '10px',
          'circle-color': '#E54E52',
          'circle-opacity': 0.8,
        }}
      >
        <Feature coordinates={[[53.001, 35.001]]} />
      </Layer>

      {/* Polygon example */}
      <Layer type="fill" paint={polygonPaint}>
        <Feature
          coordinates={[
            [54.001, 35.001],
            [54.002, 35.002],
            [54.003, 35.003],
            [54.004, 35.004],
            [54.005, 35.005],
          ]}
        />
      </Layer>

      {/* Multi Polygon example */}
      <Layer type="fill" paint={multiPolygonPaint}>
        <Feature
          coordinates={[
            [53.001, 35.001],
            [53.002, 35.002],
            [53.003, 35.003],
            [53.004, 35.004],
            [53.005, 35.005],
          ]}
        />
      </Layer>
      {/* <HBMapBoxDraw drawControl={{ features }} /> */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, zIndex: 99 }}>
        <Button
          variant="contained"
          sx={{ mx: 3 }}
          onClick={() => {
            setFeatures([
              {
                type: 'Feature',
                properties: {},
                id: 'example-id',
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
              },
            ])
          }}
        >
          layout1
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setFeatures([
              {
                type: 'Feature',
                properties: {},
                id: 'example-id2',
                geometry: {
                  coordinates: [
                    [
                      [53.51986328125034, 38.432176267372085],
                      [50.839199218751304, 38.46752487295166],
                      [52.069667968750935, 34.5582252988778],
                      [62.61654296875079, 35.589293923838284],
                      [60.59505859375113, 39.4507232342464],
                      [54.04720703125108, 40.83313841802865],
                      [53.51986328125034, 38.432176267372085],
                    ],
                  ],
                  type: 'Polygon',
                },
              },
            ])
          }}
        >
          layout2
        </Button>
      </Box>
    </HBMapBox>
  )
}

export const Primary = Template.bind({})
Primary.args = {}

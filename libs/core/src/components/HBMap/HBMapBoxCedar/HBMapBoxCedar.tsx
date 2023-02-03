import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import { Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { getRTLTextPluginStatus, setRTLTextPlugin } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect } from 'react'
import ReactMapboxGl from 'react-mapbox-gl'
import { DrawControlProps } from 'react-mapbox-gl-draw'
import { Props } from 'react-mapbox-gl/lib/map'
import { Events } from 'react-mapbox-gl/lib/map-events'
import { HBMapBoxRootStyle } from './HBMapBoxCedar.styles'
import HBMapBoxDraw from './HBMapBoxCedarDraw/HBMapBoxCedarDraw'
import { FeatureCollection } from './types'

const Map = ReactMapboxGl({ accessToken: '', attributionControl: false })
export type HBFeatureCedarCollection = Pick<FeatureCollection, 'features'>['features']
export type HBDrawControlProps = Pick<FeatureCollection, 'features'> & DrawControlProps
export interface HBMapBoxCedarProps extends Events, Omit<Props, 'style'> {
  mapStyle?: string
  sx?: SxProps<Theme>
  drawControl?: HBDrawControlProps
  isRtl?: boolean
  token: string
  styleMode?: 'light' | 'dark' | 'raster'
}

const HBMapBoxCedar = ({
  sx,
  drawControl,
  mapStyle,
  isRtl,
  token,
  styleMode = 'light',
  ...props
}: HBMapBoxCedarProps) => {
  useEffect(() => {
    if (getRTLTextPluginStatus() === 'unavailable' && isRtl === true) {
      setRTLTextPlugin(
        'https://www.parsimap.com/scripts/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js',
        () => {},
        true,
      )
    }
  }, [])

  const styleModeAddress = {
    light: 'v1/styles/cedarmaps.light.json',
    dark: 'v1/styles/cedarmaps.dark.json',
    raster: 'v1/tiles/light.json',
  }

  const baseUrl = 'https://api.cedarmaps.com'
  const cedarMapStyle = [baseUrl, styleModeAddress[styleMode]].join('/')
  const customMapStyle = mapStyle ?? `${cedarMapStyle}?access_token=${token}`

  return (
    <HBMapBoxRootStyle
      sx={{ width: '100%', height: 500, overflow: 'hidden', position: 'relative', ...sx }}
    >
      <Map containerStyle={{ width: '100%', height: '100%' }} style={customMapStyle} {...props}>
        <>{props.children}</>
        {drawControl && <HBMapBoxDraw drawControl={drawControl} />}
      </Map>
    </HBMapBoxRootStyle>
  )
}

HBMapBoxCedar.displayName = 'HBMapBoxCedar'
HBMapBoxCedar.defaultProps = {}

export default HBMapBoxCedar

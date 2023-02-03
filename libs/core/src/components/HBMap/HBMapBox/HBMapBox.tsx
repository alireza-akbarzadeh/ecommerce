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
import { HBMapBoxRootStyle } from './HBMapBox.styles'
import HBMapBoxDraw from './HBMapBoxDraw/HBMapBoxDraw'
import { FeatureCollection } from './types'

enum mapStyleEnum {
  vectorStreet = 'https://www.parsimap.com/styles/street.json', // نمایش رنگی عارضه‌ها بروی نقشه
  vectorGray = 'https://www.parsimap.com/styles/gray.json', // نمایش توسی و کم رنگ عارضه‌ها بروی نقشه
  vectorGreenGray = 'https://www.parsimap.com/styles/green-gray.json', //نمایش فضای سبز و کم رنگ عارضه‌ها بروی نقشه
  vectorGreenGrayLight = 'https://www.parsimap.com/styles/green-gray-light.json', //نمایش فضای سبز و بسیار کم رنگ عارضه‌ها بروی نقشه
  vectorLight = 'https://www.parsimap.com/styles/light.json', //نمایش ساده و کم رنگ عارضه‌ها بدون آیکون بروی نقشه
  vectorDark = 'https://www.parsimap.com/styles/dark.json', //نمایش نقشه در قالبی مشکی
  rasterStreet = 'https://www.parsimap.com/styles/map.json', //نمایش نقشه در قالبی ساده
  rasterSat = 'https://www.parsimap.com/styles/sat.json', // نمایش تصاویر ماهواره‌ای زمین در نقشه
  rasterGoogle = 'https://www.parsimap.com/styles/google.json', //نمایش تصاویر گوگل در نقشه
  rasterGreenGrayLight = 'https:/www.parsimap.com/styles/ggl.json', // نمایش فضای سبز و بسیار کم رنگ عارضه‌ها بروی نقشه
}

const Map = ReactMapboxGl({ accessToken: '', attributionControl: false })
export type HBFeatureCollection = Pick<FeatureCollection, 'features'>['features']
export interface HBMapBoxProps extends Events, Props {
  mapStyle?: keyof typeof mapStyleEnum
  sx?: SxProps<Theme>
  children?: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>
  drawControl?: Pick<FeatureCollection, 'features'> & DrawControlProps
  isRtl?: boolean
}

const HBMapBox = ({
  sx,
  children,
  style,
  drawControl,
  mapStyle = 'vectorStreet',
  isRtl = true,
  onStyleLoad,
  ...props
}: HBMapBoxProps) => {
  const mapsStyle = mapStyleEnum[mapStyle] as string
  useEffect(() => {
    if (getRTLTextPluginStatus() === 'unavailable' && isRtl === true) {
      setRTLTextPlugin(
        'https://www.parsimap.com/scripts/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js',
        () => {},
        true,
      )
    }
  }, [])

  return (
    <HBMapBoxRootStyle sx={{ width: '100%', height: 500, overflow: 'hidden', ...sx }}>
      <Map
        containerStyle={{ width: '100%', height: '100%' }}
        /* @ts-ignore */
        style={mapsStyle ?? style}
        {...props}
      >
        {drawControl && <HBMapBoxDraw drawControl={drawControl} />}
        <>{children}</>
      </Map>
    </HBMapBoxRootStyle>
  )
}

HBMapBox.displayName = 'HBMapBox'
HBMapBox.defaultProps = {
  center: [51.41, 35.7575],
  zoom: [4],
  style: 'https://www.parsimap.com/styles/street.json',
}

export default HBMapBox

import { Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import type { ControlPosition } from 'leaflet'
import { LeafletEventHandlerFnMap } from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import { ForwardedRef, forwardRef } from 'react'
import { FeatureGroup, MapContainerProps, TileLayer, useMapEvents } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { HBMapLeafletRootStyle } from './HBMapLeaflet.styles'
enum mapStyleEnum {
  default = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  rasterStreet = 'https://vt.parsimap.com/comapi.svc/tile/parsimap/{x}/{y}/{z}.png?token=ee9e06b3-dcaa-4a45-a60c-21ae72dca0bb', //نمایش نقشه در قالبی ساده
  rasterSat = 'https://vt.parsimap.com/comapi.svc/tile/goolesat/{x}/{y}/{z}.jpg?token=ee9e06b3-dcaa-4a45-a60c-21ae72dca0bb', // نمایش تصاویر ماهواره‌ای زمین در نقشه
  rasterGoogle = 'https://vt.parsimap.com/comapi.svc/tile/goolemap/{x}/{y}/{z}.png?token=ee9e06b3-dcaa-4a45-a60c-21ae72dca0bb', //نمایش تصاویر گوگل در نقشه
  rasterGreenGrayLight = 'https://vt.parsimap.com/comapi.svc/tile/ggl/{x}/{y}/{z}.png?token=ee9e06b3-dcaa-4a45-a60c-21ae72dca0bb', // نمایش فضای سبز و بسیار کم رنگ عارضه‌ها بروی نقشه
}

interface DrawControlProps {
  onEdited?: Function
  onDrawStart?: Function
  onDrawStop?: Function
  onDrawVertex?: Function
  onEditStart?: Function
  onEditMove?: Function
  onEditResize?: Function
  onEditVertex?: Function
  onEditStop?: Function
  onDeleted?: Function
  onDeleteStart?: Function
  onDeleteStop?: Function

  onCreated?: Function
  onMounted?: Function
  draw: {
    polyline?: boolean
    polygon?: boolean
    rectangle?: boolean
    circle?: boolean
    marker?: boolean
    circlemarker?: boolean
    trash?: boolean
  }

  position: ControlPosition
}

function LocationMarker(events: LeafletEventHandlerFnMap) {
  useMapEvents({
    ...events,
  })
  return null
}

export interface HBMapLeafletProps extends MapContainerProps {
  sx?: SxProps<Theme>
  mapStyle?: keyof typeof mapStyleEnum
  tileAttribution?: string
  mapEvents?: LeafletEventHandlerFnMap
  DrawControl?: DrawControlProps
}
const HBMapLeaflet = forwardRef(
  <T extends HTMLButtonElement>(
    {
      sx,
      mapEvents,
      mapStyle = 'default',
      tileAttribution = '&copy; <a href="https://www.dartil.com" target="_blank">HIT</a> contributors',
      children,
      DrawControl,
      ...props
    }: HBMapLeafletProps,
    ref: ForwardedRef<T>,
  ) => {
    const marker = [
      [35, 53],
      [53, 35],
    ]
    return (
      <HBMapLeafletRootStyle
        center={[35, 53]}
        zoom={5}
        {...props}
        sx={{ width: '100%', height: 500, ...sx }}
      >
        <TileLayer attribution={tileAttribution} url={mapStyleEnum[mapStyle]} />
        {DrawControl && (
          <FeatureGroup>
            <EditControl {...DrawControl} />
          </FeatureGroup>
        )}

        <LocationMarker {...mapEvents} />
        {children}
      </HBMapLeafletRootStyle>
    )
  },
)

HBMapLeaflet.displayName = 'HBMapLeaflet'
HBMapLeaflet.defaultProps = {}

export default HBMapLeaflet

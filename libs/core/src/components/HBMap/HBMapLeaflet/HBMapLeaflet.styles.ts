import { styled } from '@mui/material'
import { MapContainer } from 'react-leaflet'

export const HBMapLeafletRootStyle = styled(MapContainer)((props) => ({
  '& .leaflet-control-attribution svg': {
    display: 'none !important',
  },
  '& .leaflet-draw-tooltip-single': {
    marginTop: '10px !important',
  },
}))

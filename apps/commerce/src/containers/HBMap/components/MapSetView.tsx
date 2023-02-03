import { LatLngExpression } from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export type MapSetViewType = {
  center: LatLngExpression
}
export default function MapSetView({ center }: MapSetViewType) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom(), {
      animate: true,
    })
  }, [center])

  return null
}

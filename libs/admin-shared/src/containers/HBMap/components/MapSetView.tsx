import { LatLngBoundsExpression, LatLngExpression } from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export type MapSetViewType = {
  center: LatLngExpression
  bounds?: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][]
}
export default function MapSetView({ center, bounds }: MapSetViewType) {
  const map = useMap()

  const outputBounds = bounds?.map(function (obj: any) {
    return Object.keys(obj).map(function (key) {
      return obj[key]
    })
  })

  useEffect(() => {
    map.setView(center, map.getZoom(), {
      animate: true,
    })
    if (bounds?.length) {
      map?.fitBounds(outputBounds as LatLngBoundsExpression)
    }
  }, [center])

  return null
}

import React from 'react'
import { Marker } from 'react-mapbox-gl'
import { Props } from 'react-mapbox-gl/lib/marker'

export type MapMarkerProps = Props
export default function HBMapMarker(props: MapMarkerProps) {
  return <Marker {...props} />
}

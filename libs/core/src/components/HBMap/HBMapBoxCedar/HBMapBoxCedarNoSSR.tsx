import dynamic from 'next/dynamic'
import { FC } from 'react'
import { Props as PolygonProps } from 'react-mapbox-gl/lib/geojson-layer'
import { Props as MarkerProps } from 'react-mapbox-gl/lib/marker'
import { Props as PopupProps } from 'react-mapbox-gl/lib/popup'
import { HBMapBoxCedarProps } from './HBMapBoxCedar'

const MapBoxCedarWithNoSSR = dynamic(() => import('./HBMapBoxCedar'), {
  ssr: false,
}) as FC<HBMapBoxCedarProps>

const HBPopupNoSSR = dynamic(() => import('react-mapbox-gl').then(({ Popup }) => Popup), {
  ssr: false,
}) as FC<PopupProps>

const HBPolygonNoSSR = dynamic(
  () => import('react-mapbox-gl').then(({ GeoJSONLayer }) => GeoJSONLayer),
  {
    ssr: false,
  },
) as FC<PolygonProps>

const HBMapMarkerNoSSR = dynamic(() => import('react-mapbox-gl').then(({ Marker }) => Marker), {
  ssr: false,
}) as FC<MarkerProps>

const HBMapLayerNoSSR = dynamic(() => import('react-mapbox-gl').then(({ Layer }) => Layer), {
  ssr: false,
}) as FC<JSX.Element>

export { HBMapMarkerNoSSR, HBPopupNoSSR, HBPolygonNoSSR, HBMapLayerNoSSR }
export default MapBoxCedarWithNoSSR

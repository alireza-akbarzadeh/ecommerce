import dynamic from 'next/dynamic'
import { FC } from 'react'
import {
  CircleProps,
  FeatureGroupProps,
  MarkerProps,
  PolygonProps,
  PopupProps,
  TileLayerProps,
  ZoomControlProps,
} from 'react-leaflet'
import { DraftControlProps } from './HBDraftControl/HBDraftControl'
import { HBMapLeafletProps } from './HBMapLeaflet'

const HBLeafLetContainer = dynamic(() => import('./HBMapLeaflet'), {
  ssr: false,
}) as FC<HBMapLeafletProps>

const HBMarker = dynamic(() => import('react-leaflet').then(({ Marker }) => Marker), {
  ssr: false,
}) as FC<MarkerProps>
const HBFeatureGroup = dynamic(
  () => import('react-leaflet').then(({ FeatureGroup }) => FeatureGroup),
  {
    ssr: false,
  },
) as FC<FeatureGroupProps>

const HBTileLayer = dynamic(() => import('react-leaflet').then(({ TileLayer }) => TileLayer), {
  ssr: false,
}) as FC<TileLayerProps>

const HBCircle = dynamic(() => import('react-leaflet').then(({ Circle }) => Circle), {
  ssr: false,
}) as FC<CircleProps>

const HBPolygon = dynamic(() => import('react-leaflet').then(({ Polygon }) => Polygon), {
  ssr: false,
}) as FC<PolygonProps>

const HBDraftControl = dynamic(
  () => import('./HBDraftControl/HBDraftControl').then(({ HBDraftControl }) => HBDraftControl),
  {
    ssr: false,
  },
) as FC<Partial<DraftControlProps>>

const HBPopup = dynamic(() => import('react-leaflet').then(({ Popup }) => Popup), {
  ssr: false,
}) as FC<PopupProps>

const HBZoomControl = dynamic(
  () => import('react-leaflet').then(({ ZoomControl }) => ZoomControl),
  {
    ssr: false,
  },
) as FC<ZoomControlProps>

export {
  HBLeafLetContainer,
  HBMarker,
  HBTileLayer,
  HBCircle,
  HBPolygon,
  HBDraftControl,
  HBPopup,
  HBZoomControl,
  HBFeatureGroup,
}
export default HBLeafLetContainer

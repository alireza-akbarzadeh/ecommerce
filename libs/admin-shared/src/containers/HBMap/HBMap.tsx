import {
  HBDraftControl,
  HBFeatureGroup,
  HBLeafLetContainer,
  HBMarker,
  HBPolygon,
  HBPopup,
  HBZoomControl,
} from '@hasty-bazar/core'
import { Box, NoSsr } from '@mui/material'
import { LatLng, LatLngExpression } from 'leaflet'
import { HBMapLeafletProps } from 'libs/core/src/components/HBMap/HBMapLeaflet/HBMapLeaflet'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import SearchBox, { SearchBoxProps, searchType } from './containers/SearchBox'

const MapSetView = dynamic(() => import('./components/MapSetView'), {
  ssr: false,
})

export interface HBMapProps extends HBMapLeafletProps {
  isShowMarker?: boolean
  isShowSearch?: boolean
  searchProps?: SearchBoxProps
  onMarkerMounted?: (ref: any) => void
  onChangeLocation?: (e: [number, number]) => void
  disabled?: boolean
  onClick?: (latlng?: LatLng) => void
  onClickMarker?: any
  popupElement?: any
  polygons?: LatLngExpression[][]
  onPolygonsChange?(selectedChanges: any): void
  drawController?: any
}

export default function HBMap({
  isShowMarker,
  isShowSearch,
  searchProps,
  disabled = false,
  center: mapCenter,
  polygons,
  onChangeLocation,
  onMarkerMounted,
  onPolygonsChange,
  onClick,
  drawController = {
    show: false,
    draw: {
      rectangle: true,
      polyline: true,
      polygon: true,
      circle: true,
      circlemarker: true,
      marker: true,
    },
  },
  ...props
}: HBMapProps) {
  const [center, setCenter] = useState(mapCenter)

  useEffect(() => {
    setCenter(mapCenter)
  }, [mapCenter])

  const handleChangeSearch = (value: searchType) => {
    const location = value?.location?.center?.split(',')
    if (location && location.length === 2) {
      setCenter([+location[0], +location[1]])
      onChangeLocation?.([+location[0], +location[1]])
    }
  }

  const onCreate = (e: any) => {
    const { layerType, layer } = e
    if (layerType === 'polygon') {
      onPolygonsChange?.(layer.getLatLngs()[0])
    }
  }

  const onEdited = (e: any) => {
    const {
      layers: { _layers },
    } = e
  }

  const onDeleted = (e: any) => {
    const {
      layers: { _layers },
    } = e

    Object.values(_layers).map(({ _leaflet_id }: any) => {
      //@ts-ignore
      onPolygonsChange([])
    })
  }

  return (
    <NoSsr>
      <Box sx={{ position: 'relative', width: '100%', height: '100%', ...props?.sx }}>
        {isShowSearch && <SearchBox {...searchProps} onSearchMounted={handleChangeSearch} />}
        <HBLeafLetContainer
          center={center || [35.697706, 51.338191]}
          zoom={props?.zoom ?? 14}
          zoomControl={false}
          doubleClickZoom={false}
          mapEvents={{
            click: (e) => {
              const { lat, lng } = e.latlng
              setCenter([lat, lng])
              onChangeLocation?.([lat, lng])
              onClick?.(e.latlng)
            },
          }}
          {...props}
        >
          {drawController.show && (
            <HBFeatureGroup>
              <HBDraftControl
                position={drawController.position}
                draw={drawController.draw!}
                onCreated={onCreate}
                onEdited={onEdited}
                onDeleted={onDeleted}
              />
              {polygons?.length && <HBPolygon color="blue" positions={polygons} />}
            </HBFeatureGroup>
          )}
          <HBZoomControl position="bottomright" />
          {center && <MapSetView center={center!} bounds={polygons} />}
          {center && isShowMarker && (
            <HBMarker
              position={center}
              eventHandlers={{
                click: (e) => props?.onClickMarker(e),
              }}
            >
              {props.popupElement && <HBPopup>{props.popupElement}</HBPopup>}
            </HBMarker>
          )}
        </HBLeafLetContainer>
        {props.children}
      </Box>
    </NoSsr>
  )
}

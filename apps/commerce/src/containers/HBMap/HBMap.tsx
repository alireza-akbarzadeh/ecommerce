import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { localityApi } from '@hasty-bazar-commerce/services/localityApi.generated'
import { HBLeafLetContainer, HBMarker, HBPopup, HBZoomControl } from '@hasty-bazar/core'
import { Box, NoSsr } from '@mui/material'
import { Icon, LatLng, LeafletMouseEvent } from 'leaflet'
import { HBMapLeafletProps } from 'libs/core/src/components/HBMap/HBMapLeaflet/HBMapLeaflet'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import SearchBox, { SearchBoxProps, searchType } from './containers/SearchBox'

const MapSetView = dynamic(() => import('./components/MapSetView'), {
  ssr: false,
})

interface AddressCalback {
  address: string
  cityId: string
  provinceId: string
}

export interface HBMapProps extends HBMapLeafletProps {
  isShowMarker?: boolean
  isShowSearch?: boolean
  searchProps?: SearchBoxProps
  onMarkerMounted?: (ref: any) => void
  onChangeLocation?: (e: [number, number]) => void
  disabled?: boolean
  onClick?: (latlng?: LatLng) => void
  addressFetchCallback?: (value: AddressCalback | boolean) => void
  isLoading?: (loading: boolean) => void
  hasZoomBox?: boolean
  hasPopupMessage?: boolean
  popupMessage?: string
}

export default function HBMap({
  hasZoomBox = true,
  isShowMarker,
  isShowSearch,
  searchProps,
  onChangeLocation,
  onMarkerMounted,
  disabled = false,
  center: mapCenter,
  onClick,
  addressFetchCallback,
  isLoading,
  hasPopupMessage = false,
  popupMessage,
  ...props
}: HBMapProps) {
  const [center, setCenter] = useState(mapCenter)
  const [icon, setIcon] = useState<Icon | undefined>(undefined)

  useEffect(() => {
    setCenter(mapCenter)
  }, [mapCenter])

  useEffect(() => {
    handleNewIcon()
    return () => {
      setIcon(undefined)
    }
  }, [])

  const handleNewIcon = async () => {
    if (typeof window !== undefined) {
      const L = require('leaflet')
      setIcon(
        new L.Icon({
          iconUrl: '/assets/maker.png',
          iconAnchor: [22, 55],
          popupAnchor: [10, -44],
          iconSize: [48, 48],
        }),
      )
    }
  }

  const handleChangeSearch = (value: searchType) => {
    const location = value?.location?.center?.split(',')
    if (location && location.length === 2) {
      changePosition(+location[0], +location[1])
    }
  }

  const changePosition = async (lat: number, lng: number) => {
    if (addressFetchCallback && !!typeof window) {
      const L = require('leaflet')
      if (isLoading) {
        isLoading(true)
      }

      setCenter([lat, lng])
      onChangeLocation?.([lat, lng])
      onClick?.(new L.LatLng(lat, lng))
      const [addressRes, polygonRes] = await Promise.all([
        getAddressQuery({
          ...ApiConstants,
          longitude: lng,
          latitude: lat,
        }).unwrap(),
        getPolygonDatas({
          ...ApiConstants,
          lat,
          lng,
        }).unwrap(),
      ])

      if (isLoading) isLoading(false)

      const cityId = polygonRes.data?.items?.find((i) => i.geoTypeValueCode === '3')?.id
      const provinceId = polygonRes.data?.items?.find((i) => i.geoTypeValueCode === '2')?.id

      // if (!!addressRes.data?.result?.formatted_Address && !!cityId && !!provinceId) {
      addressFetchCallback({
        address: addressRes.data?.result?.formatted_Address ?? '',
        cityId: cityId ?? '',
        provinceId: provinceId ?? '',
      })
      // }
      //  else {
      //   addressFetchCallback(false)
      //   openToast({
      //     message: formatMessage({ ...ContainersMessages.notDefindedAddress }),
      //     type: 'error',
      //     vertical: 'top',
      //   })
      // }
    }
  }

  const [getAddressQuery] = localityApi.useLazyGetWebLocalityMapsGetAddressQuery()
  const [getPolygonDatas] = localityApi.useLazyGetWebLocalityPolygonQuery()

  const handleClick = async (event: LeafletMouseEvent) => {
    const { latlng } = event
    changePosition(latlng.lat, latlng.lng)
  }

  return (
    <NoSsr>
      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', ...props?.sx }}>
        {isShowSearch && (
          <SearchBox address={popupMessage} {...searchProps} onSearchMounted={handleChangeSearch} />
        )}
        <HBLeafLetContainer
          center={center || [35.697706, 51.338191]}
          zoom={props?.zoom || 14}
          zoomControl={false}
          doubleClickZoom={false}
          mapEvents={{
            click: handleClick,
          }}
          {...props}
        >
          {hasZoomBox ? <HBZoomControl position="bottomright" /> : null}
          {center && <MapSetView center={center!} />}
          {center && !!icon && <HBMarker icon={icon} position={center}></HBMarker>}
          {hasPopupMessage && <HBPopup position={center} children={<span>{popupMessage}</span>} />}
        </HBLeafLetContainer>

        {props.children}
      </Box>
    </NoSsr>
  )
}

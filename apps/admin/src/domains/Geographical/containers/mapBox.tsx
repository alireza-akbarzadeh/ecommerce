import { HBMap } from '@hasty-bazar/admin-shared/containers/HBMap'
import { useGetAdminLocalityMapsGetAddressQuery } from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { HBClassesType, HBIconButton } from '@hasty-bazar/core'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'

type HBPageClassNames = 'focusBtn' | 'focusBox' | 'zoomBox' | 'zoomBtn'

const classes: HBClassesType<HBPageClassNames> = {
  focusBox: ({ spacing, zIndex }) => ({
    position: 'absolute',
    left: spacing(3),
    zIndex: zIndex.fab,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column-reverse',
    bottom: 100,
  }),
  focusBtn: ({ palette }) => ({
    background: 'none',
    border: 'unset',
    color: palette.grey[800],
    '&:hover': {
      color: 'unset',
      background: 'none',
    },
  }),
  zoomBox: ({ spacing, zIndex }) => ({
    position: 'absolute',
    left: spacing(3),
    zIndex: zIndex.fab,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column-reverse',
    bottom: 10,
  }),
  zoomBtn: ({ palette }) => ({
    border: `1px solid ${palette.grey[200]}`,
    borderRadius: 0,
    minWidth: 28,
    width: 28,
    height: 28,
  }),
}

const MapBox = React.memo(({ setFullScreen }: any) => {
  const { formatMessage } = useIntl()
  const { getValues, setValue } = useFormContext()

  const {
    data: AddressData = {},
    isFetching,
    refetch,
  } = useGetAdminLocalityMapsGetAddressQuery(
    {
      'client-name': 'Locality-Maps-Get-Address',
      'client-version': '0.0.1',
      longitude: getValues('lng'),
      latitude: getValues('lat'),
    },
    {
      skip: !getValues('lat'),
    },
  )

  const handleChangeLocation = (location: number[]) => {
    setValue('lat', location[0])
    setValue('lng', location[1])
  }

  const onClickMarker = () => {
    refetch()
  }

  return (
    <HBMap
      center={getValues('lat') ? [getValues('lat'), getValues('lng')] : undefined}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
      isShowSearch
      isShowMarker
      onChangeLocation={handleChangeLocation}
      onClickMarker={onClickMarker}
      popupElement={
        <Typography>{isFetching ? '...' : AddressData?.data?.result?.address}</Typography>
      }
      searchProps={{
        searchSx: {
          position: 'absolute',
          top: 'unset',
          width: 450,
          left: 0,
        },
      }}
    >
      <Box sx={classes.focusBox}>
        <HBIconButton icon={'times'} onClick={() => setFullScreen(false)} sx={classes.focusBtn} />
        <HBIconButton icon={'focus'} onClick={() => setFullScreen(true)} sx={classes.focusBtn} />
      </Box>
    </HBMap>
  )
})

export default MapBox

import { HBMap } from '@hasty-bazar/admin-shared/containers/HBMap'
import { HBClassesType, HBFeatureCedarCollection, HBIconButton } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
export type GeoPolygonSelectionFormSection = {
  localityGeoData: any
}
type HBPageClassNames = 'focusBtn' | 'focusBox' | 'zoomBox' | 'zoomBtn'

const classes: HBClassesType<HBPageClassNames> = {
  focusBox: ({ spacing, zIndex }) => ({
    position: 'absolute',
    left: spacing(3),
    zIndex: zIndex.fab,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column-reverse',
    bottom: 160,
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
    bottom: 90,
  }),
  zoomBtn: ({ palette }) => ({
    border: `1px solid ${palette.grey[200]}`,
    borderRadius: 0,
    minWidth: 28,
    width: 28,
    height: 28,
  }),
}

export default function GeoPolygonSelectionFormSection({
  localityGeoData,
}: GeoPolygonSelectionFormSection) {
  const [fullScreen, setFullScreen] = useState<boolean>(false)
  const { control, getValues, watch } = useFormContext()
  const { query: { id } = {} } = useRouter()
  const selectedTreeItem = localityGeoData.find((item: any) => item.id === id)

  const Map = useCallback(
    ({
      value: features = [],
      onChange,
    }: {
      value: HBFeatureCedarCollection
      onChange: (event: HBFeatureCedarCollection) => void
    }) => {
      const onPolygonsChange = (selectedChanges: any) => {
        onChange(selectedChanges)
      }

      function findCenter(points: any) {
        let lat = 0
        let lng = 0

        for (let i = 0; i < points?.length; ++i) {
          lat += points[i]?.lat
          lng += points[i]?.lng
        }

        lat /= points?.length
        lng /= points?.length

        return { lat, lng }
      }

      return (
        <HBMap
          zoom={18}
          center={
            getValues('polygonJson')?.length ? findCenter(getValues('polygonJson')) : undefined
          }
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
          isShowSearch
          isShowMarker={false}
          searchProps={{
            searchSx: {
              position: 'absolute',
              top: 'unset',
              width: 450,
            },
          }}
          drawController={{
            show: true,
            position: 'bottomleft',
            draw: {
              rectangle: false,
              polyline: false,
              polygon: true,
              circle: false,
              circlemarker: false,
              marker: false,
            },
          }}
          polygons={getValues('polygonJson')}
          onPolygonsChange={onPolygonsChange}
        >
          <Box sx={classes.focusBox}>
            <HBIconButton
              icon={'times'}
              onClick={() => setFullScreen(false)}
              sx={classes.focusBtn}
            />
            <HBIconButton
              icon={'focus'}
              onClick={() => setFullScreen(true)}
              sx={classes.focusBtn}
            />
          </Box>
        </HBMap>
      )
    },
    [fullScreen, selectedTreeItem],
  )

  return (
    <Box
      sx={(theme) => ({
        width: fullScreen ? 'calc(100% - 290px)' : '100%',
        borderRadius: theme.spacing(3),
        overflow: 'hidden',
        left: 265,
        top: 155,
        position: fullScreen ? 'fixed' : 'unset',
        height: fullScreen ? 'calc(100% - 170px)' : 500,
        zIndex: theme.zIndex.fab,
        [theme.breakpoints.down('sm')]: {
          left: theme.spacing(8),
          width: fullScreen ? 'calc(100% - 60px)' : '100%',
        },
      })}
    >
      <Controller
        name="polygonJson"
        control={control}
        render={({ field: { value, onChange } }) => <Map value={value} onChange={onChange} />}
      />
    </Box>
  )
}

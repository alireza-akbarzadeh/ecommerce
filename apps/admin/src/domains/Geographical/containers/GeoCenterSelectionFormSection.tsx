import { Box } from '@mui/material'
import { useCallback, useState } from 'react'
import MapBox from './mapBox'

export type GeoPolygonSelectionFormSection = {}
export default function GeoPolygonSelectionFormSection(props: GeoPolygonSelectionFormSection) {
  const [fullScreen, setFullScreen] = useState<boolean>(false)

  const Map = useCallback(() => {
    return <MapBox setFullScreen={setFullScreen} />
  }, [fullScreen])

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
      <Map />
    </Box>
  )
}

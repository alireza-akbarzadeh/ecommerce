import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { useContext, useEffect } from 'react'
import { MapContext } from 'react-mapbox-gl'
import { DrawControlProps } from 'react-mapbox-gl-draw'
import { FeatureCollection } from '../types'

export type HBMapBoxDrawProps = {
  features?: Pick<FeatureCollection, 'features'>['features']
  drawControl?: Pick<FeatureCollection, 'features'> & DrawControlProps
}
export default function HBMapBoxDraw(props: HBMapBoxDrawProps) {
  const { drawControl } = props
  const {
    controls = { polygon: true, trash: true },
    displayControlsDefault = false,
    position = 'bottom-right',
    onDrawCreate,
    onDrawDelete,
    onDrawUpdate,
    features,
  } = drawControl || {}
  const map = useContext(MapContext)
  useEffect(() => {
    const draw = new MapboxDraw({
      displayControlsDefault,
      controls,
    })
    map?.addControl(draw, position)
    if (features && features?.length > 0)
      draw.set({
        type: 'FeatureCollection',
        features,
      })
    onDrawCreate && map?.on('draw.create', onDrawCreate)
    onDrawUpdate && map?.on('draw.update', onDrawUpdate)
    onDrawDelete && map?.on('draw.delete', onDrawDelete)
    return () => {
      if (map) {
        map?.hasControl(draw) && map?.removeControl(draw)
        onDrawCreate && map?.off('draw.create', onDrawCreate)
        onDrawUpdate && map?.off('draw.update', onDrawUpdate)
        onDrawDelete && map?.off('draw.delete', onDrawDelete)
      }
    }
  }, [props])

  return <></>
}

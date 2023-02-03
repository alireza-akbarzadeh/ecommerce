//@ts-nocheck

import { createControlComponent, useLeafletContext } from '@react-leaflet/core'
import L from 'leaflet'
import 'leaflet-draw'
// import 'leaflet-draw/dist/leaflet.draw.css'
import React from 'react'
import { createControlDraw } from './factory'

type EditProps = {
  edit: boolean
  remove: boolean
}

type DrawProps = {
  polyline: boolean | object
  polygon: boolean | object
  rectangle: boolean | object
  circle: boolean | object
  marker: boolean | object
  circlemarker: boolean | object
}

interface LeafletDrawListeners {
  onCreated: Function
  onEdited: Function
  onDeleted: Function
  onDrawStart: Function
  onDrawStop: Function
  onDrawVertex: Function
  onEditStart: Function
  onEditMove: Function
  onEditResize: Function
  onEditVertex: Function
  onEditStop: Function
  onDeleteStart: Function
  onDeleteStop: Function
  onToolbarOpened: Function
  onToolbarClosed: Function
  onMarkerContext: Function
}

export interface DraftControlProps extends LeafletDrawListeners {
  position: string
  edit: EditProps
  draw: DrawProps
  limitLayers: number
}

export const HBDraftControl = React.memo(
  createControlComponent(function (props) {
    const context = useLeafletContext()

    const onDrawCreated = React.useCallback(function (event) {
      const { onCreated, limitLayers } = props
      const container = context.layerContainer || context.map
      const eventLayers = event.layer
      const containerLayers = container.getLayers()

      if (containerLayers.length + 1 > limitLayers) {
        onCreated({ error: { layer: 'limit reached' } })
        return
      }

      container.addLayer(eventLayers)
      onCreated && onCreated(event)
    }, [])

    React.useEffect(function () {
      Object.entries(props).forEach(([propName, propValue]) => {
        if (propName.startsWith('on') && propName !== 'onCreated') {
          const event = `draw:${propName.substring(2).toLowerCase()}`
          context.map.on(event, propValue)
        }
      })
    }, [])

    React.useEffect(function () {
      context.map.on(L.Draw.Event.CREATED, onDrawCreated)
    }, [])

    return createControlDraw(props as DraftControlProps, context)
  }),
) as any

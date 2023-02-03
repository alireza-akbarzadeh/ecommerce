//@ts-nocheck

import L from 'leaflet'
import { DraftControlProps } from './HBDraftControl'

function createEditDefault() {
  return {
    edit: true,
    remove: true,
  }
}

function createDrawDefault() {
  return {
    polyline: true,
    polygon: true,
    rectangle: false,
    circle: false,
    marker: false,
    circlemarker: false,
  }
}

export function createControlDraw({ draw, edit, position }: DraftControlProps, context: any) {
  const options = {
    draw: {
      ...createDrawDefault(),
    },
    edit: {
      ...createEditDefault(),
      featureGroup: context.layerContainer,
    },
  }
  if (position) {
    options.position = position
  }
  if (draw) {
    options.draw = { ...options.draw, ...draw }
  }
  if (edit) {
    options.edit = { ...options.edit, ...edit }
  }
  return new L.Control.Draw(options)
}

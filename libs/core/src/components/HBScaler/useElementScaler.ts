import { useEffect, useRef, useState } from 'react'

const MIN_SIZE_X = 72
const PADDING_OFFSET_X = 0.1

export interface ElementScalerProps {
  enabled: boolean
  resolutionWidth: number
  minSizeX?: number
  paddingOffsetX?: number
  paddingOffsetY?: number
}

const useElementScaler = ({
  enabled,
  resolutionWidth,
  minSizeX = MIN_SIZE_X,
  paddingOffsetX = PADDING_OFFSET_X,
}: ElementScalerProps) => {
  const wrapperElement = useRef<HTMLDivElement>(null)
  const [wrapperWidth, setWrapperWidth] = useState(
    wrapperElement.current?.getBoundingClientRect().width ?? 0,
  )
  const widthAndHeightResizer = useState<{ x: number; y: number } | null>(null)

  const minScaleResolutionWidth = Math.max(resolutionWidth || minSizeX, minSizeX)
  const widthResizer = useState<{ x: number } | null>(null)

  const minResolutionWidth = Math.max(
    widthResizer[0]?.x || widthAndHeightResizer[0]?.x || resolutionWidth || minSizeX,
    minSizeX,
  )
  let scale = 1
  if (enabled && minScaleResolutionWidth > wrapperWidth) {
    scale = (wrapperWidth - paddingOffsetX) / minScaleResolutionWidth
  }

  useEffect(() => {
    let observer: any
    if (enabled && wrapperElement.current) {
      //@ts-ignore
      observer = new ResizeObserver((entries) => {
        entries.forEach((entry: any) => {
          if (entry.contentRect) {
            const sizes = entry.contentRect
            setWrapperWidth(sizes.width - paddingOffsetX)
            // setWrapperHeight(sizes.height - PADDING_OFFSET_Y)
          }

          return null
        })
      })
      observer.observe(wrapperElement.current)
    }
    return () => (observer ? observer.disconnect() : null)
  }, [wrapperElement])

  return { wrapperElement, minResolutionWidth, scale }
}

export default useElementScaler

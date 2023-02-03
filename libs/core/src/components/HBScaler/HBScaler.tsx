import { Box, styled } from '@mui/material'
import { FC, ReactNode, useRef } from 'react'
import useElementScaler from './useElementScaler'

export const hBScalerClassesPrefix = 'HBScaler'
export const hBScalerClasses = {
  content: `${hBScalerClassesPrefix}-content`,
}
const HBScalerRoot = styled('div', { name: hBScalerClassesPrefix, slot: 'Root' })(() => ({}))

export interface HBScalerProps {
  children: ReactNode | JSX.Element
  resolutionWidth?: number
  enabled?: boolean
}

const HBScaler: FC<HBScalerProps> = ({ enabled, resolutionWidth, children }) => {
  const contentElement = useRef<HTMLDivElement>(null)
  const { minResolutionWidth, scale, wrapperElement } = useElementScaler({
    enabled: enabled ?? true,
    resolutionWidth: resolutionWidth ?? 1920,
  })

  return (
    <HBScalerRoot
      ref={(ref: HTMLDivElement) => {
        //@ts-ignore
        wrapperElement.current = ref
      }}
    >
      <Box
        ref={contentElement}
        className={hBScalerClasses.content}
        sx={{
          width: enabled ? minResolutionWidth : '100%',
          transform: `scale(${scale})`,
          transformOrigin: 'left top',
          marginBottom: `calc(${contentElement.current?.getBoundingClientRect().height}px - ${
            wrapperElement.current?.clientHeight
          }px)`,
        }}
      >
        {children}
      </Box>
    </HBScalerRoot>
  )
}

export default HBScaler

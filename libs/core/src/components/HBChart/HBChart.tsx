import { SxProps, Theme } from '@mui/material/styles'
import { EChartsReactProps } from 'echarts-for-react'
import dynamic from 'next/dynamic'
import { CSSProperties, FC, ForwardedRef, forwardRef } from 'react'
import { HBChartRootStyle } from './HBChart.styles'

const EChart = dynamic(() => import('echarts-for-react'), {
  ssr: false,
}) as FC<EChartsReactProps>

export interface HBChartProps extends Omit<EChartsReactProps, 'ref'> {
  sx?: SxProps<Theme>
  chartStyle?: CSSProperties
  chartType?: 'line' | 'bar' | 'pie' | 'area'
  chartColors?: string[]
  chartTheme?: 'dark' | 'light'
  onCategoryClick?: (params: any, chart: any) => void
}

const defaultOptions = {
  color: [
    '#c23531',
    '#2f4554',
    '#61a0a8',
    '#d48265',
    '#91c7ae',
    '#749f83',
    '#ca8622',
    '#bda29a',
    '#6e7074',
    '#546570',
    '#c4ccd3',
    '#f05b72',
    '#ef5b9c',
    '#f47920',
    '#905a3d',
    '#fab27b',
    '#2a5caa',
    '#444693',
    '#726930',
  ],
  grid: {
    left: 20,
    containLabel: true,
    bottom: 50,
    top: 20,
    right: 20,
  },
  legend: {
    type: 'scroll',
    orient: 'horizontal',
    bottom: 10,
    icon: 'circle',
    itemGap: 15,
  },
}

const HBChart = forwardRef(
  <T extends HTMLDivElement>(
    {
      sx,
      chartStyle,
      chartType = 'line',
      chartColors,
      option,
      chartTheme,
      onCategoryClick,
      ...props
    }: HBChartProps,
    ref: ForwardedRef<T>,
  ) => {
    return (
      <HBChartRootStyle ref={ref} sx={sx}>
        <EChart
          theme={chartTheme}
          option={option}
          style={{ height: '100%', width: '100%', ...chartStyle }}
          lazyUpdate
          onEvents={{
            legendselectchanged: (params: any, myChart: any) => {
              onCategoryClick?.(params, myChart)
            },
          }}
          {...props}
        />
      </HBChartRootStyle>
    )
  },
)

HBChart.displayName = 'HBChart'
HBChart.defaultProps = {}

export default HBChart

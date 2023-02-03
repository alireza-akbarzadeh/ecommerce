import { Stack } from '@mui/material'
import { FC } from 'react'
import HBImageWidget, { HBImageWidgetProps } from './HBImageWidget'

export interface HBBannerTwoRowsWidgetProps {
  data: HBImageWidgetProps[]
  prefixImageUrl?: string
}
const HBBannerTwoRowsWidget: FC<HBBannerTwoRowsWidgetProps> = (props) => {
  const { data, prefixImageUrl } = props

  return (
    <Stack direction="column" gap={3}>
      {data?.slice(0, 2)?.map((img, index) => (
        <HBImageWidget
          key={'banner' + index}
          type="IMAGE_TWO_ROWS"
          {...img}
          imageUrl={prefixImageUrl + img.imageUrl!}
        />
      ))}
    </Stack>
  )
}
export default HBBannerTwoRowsWidget

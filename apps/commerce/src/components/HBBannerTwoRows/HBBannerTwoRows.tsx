import { HBBanner } from '@hasty-bazar-commerce/components'
import { ContentData } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { Stack } from '@mui/material'
import { FC } from 'react'
interface HBBannerTwoRowsProps {
  data: ContentData[]
}
const HBBannerTwoRows: FC<HBBannerTwoRowsProps> = (props) => {
  const { data } = props

  return (
    <Stack direction="column" gap={3}>
      {data?.slice(0, 2)?.map((img, index) => (
        <HBBanner key={'banner' + index} type="IMAGE_TWO_ROWS" {...img} />
      ))}
    </Stack>
  )
}
export default HBBannerTwoRows

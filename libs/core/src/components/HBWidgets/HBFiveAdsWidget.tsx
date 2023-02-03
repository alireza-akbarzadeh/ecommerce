import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'

type DataType = { imageUrl?: string; metaData?: string }

export interface HBFiveAdsWidgetProps {
  prefixImageUrl: string
  metaData?: string
  data: DataType[]
}

const HBFiveAdsWidget: FC<HBFiveAdsWidgetProps> = (props) => {
  const theme = useTheme()
  const metaData = props?.metaData ? JSON.parse(props.metaData) : {}
  const largeBoxData = props?.data?.[0]
  const largeBoxDataMetaData = largeBoxData?.metaData ? JSON.parse(largeBoxData.metaData) : {}
  const smallWidth = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  return (
    <Stack
      direction={!smallWidth ? 'row-reverse' : 'column'}
      spacing={6}
      p={6}
      bgcolor={metaData?.backgroundColor}
      borderRadius={4}
    >
      <Box width={{ md: '55%', xs: '100%' }} position="relative">
        <Box
          component="img"
          src={props.prefixImageUrl + largeBoxData?.imageUrl!}
          width="100%"
          sx={{ objectFit: 'fill', cursor: largeBoxDataMetaData?.url ? 'pointer' : 'default' }}
          onClick={() =>
            largeBoxDataMetaData?.url ? router.push(largeBoxDataMetaData.url) : undefined
          }
        />
      </Box>
      <Stack
        direction="row"
        width={{ md: '45%', xs: '100%' }}
        display="flex"
        flexWrap="wrap"
        gap={6}
      >
        {props?.data
          ?.filter((_, idx) => idx !== 0)
          .map((item) => (
            <RenderItem {...item} imageUrl={props.prefixImageUrl + item.imageUrl} />
          ))}
      </Stack>
    </Stack>
  )
}

export default HBFiveAdsWidget

const RenderItem = (props: DataType) => {
  const metaData = props?.metaData ? JSON.parse(props.metaData) : {}

  const router = useRouter()
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width={{ sm: 'calc(50% - 12px)', xs: '100%', cursor: metaData.link ? 'pointer' : 'default' }}
      borderRadius={4}
      onClick={() => (metaData.link ? router.push(metaData.url) : undefined)}
    >
      <img src={props?.imageUrl!} width="100%" />
    </Stack>
  )
}

import { Box, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import HBLink from '../HBLink'

type DataType = { imageUrl?: string; metaData?: string; link: string; id: string }

export interface ThreeIdsProps {
  prefixImageUrl: string
  metaData?: string
  data: DataType[]
}

const ThreeAds: FC<ThreeIdsProps> = (props) => {
  const { data, metaData: metaDataProps, prefixImageUrl } = props
  const metaData = metaDataProps ? JSON.parse(metaDataProps) : {}

  return (
    <Stack
      direction="row"
      p={6}
      bgcolor={metaData?.backgroundColor || 'grey.300'}
      justifyContent="space-between"
      borderRadius={4}
      flexDirection={{ xs: 'column', sm: 'row' }}
    >
      {data?.map((item) => (
        <RenderItem {...item} imageUrl={prefixImageUrl + item.imageUrl} key={item.id} />
      ))}
    </Stack>
  )
}

export default ThreeAds

const RenderItem = (item: DataType) => {
  const router = useRouter()
  const metaData = item?.metaData ? JSON.parse(item.metaData) : {}

  return (
    <HBLink passHref href={item.link}>
      <Stack
        direction={{ xs: 'row', sm: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        borderRadius={4}
        mb={{ xs: 4, sm: 'unset' }}
      >
        <Box
          component="img"
          width={{ xs: '100%', sm: 'calc(100% - 16px)' }}
          maxWidth="100%"
          src={item?.imageUrl!}
          sx={{
            objectFit: 'fill',
            objectPosition: 'center',
            cursor: metaData?.url ? 'pointer' : 'default',
          }}
          onClick={() => (metaData?.url ? router.push(metaData.url) : undefined)}
        />
      </Stack>
    </HBLink>
  )
}

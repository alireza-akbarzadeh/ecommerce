import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCmsContentsQuery } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { Box, Stack, styled } from '@mui/material'
import { useRouter } from 'next/router'

const ImageStyle = styled('img')(({ theme }) => ({
  objectPosition: 'center',
  borderRadius: theme.spacing(4),
  width: `calc(50% - ${theme.spacing(3)})`,
  height: 177,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

const BrandsBanner = () => {
  const router = useRouter()
  const { data } = useGetWebCmsContentsQuery({
    ...ApiConstants,
    entityId: router!.query.brandId![0],
    pageSize: 100,
  })
  const images = data?.data?.items?.filter((item) => item.factor === 'other').slice(2, 5)

  return (
    <Box mb={{ xs: 4, sm: 6 }}>
      {images?.[0] && (
        <Box
          component="img"
          sx={{ objectPosition: 'center' }}
          width="100%"
          borderRadius={4}
          height={239}
          src={process.env.NEXT_PUBLIC_CDN! + images?.[0].value}
        />
      )}
      <Stack
        flexDirection={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 4, sm: 0 }}
        justifyContent="space-between"
        mt={{ xs: 4, sm: 6 }}
      >
        {images?.[1] && <ImageStyle src={process.env.NEXT_PUBLIC_CDN! + images?.[1].value} />}
        {images?.[2] && <ImageStyle src={process.env.NEXT_PUBLIC_CDN! + images?.[2].value} />}
      </Stack>
    </Box>
  )
}

export default BrandsBanner

import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCatalogBrandsByIdQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import {
  GetContentsQueryResult,
  useGetWebCmsContentsQuery,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import { HBCarousel, HBIconButton, ValuingCustomPagination } from '@hasty-bazar/core'
import { Box, Stack, tabsClasses, Typography } from '@mui/material'
import { HBTab, HBTabs } from 'libs/core/src/components/HBTab/HBTabContainer.styles'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

export enum ContentTypeEnums {
  Html = 1022001,
  Image = 1022002,
  Video = 1022003,
  Document = 1022004,
  Url = 1022005,
  Button = 1022006,
  ImageSlider = 1022007,
  BusinessSlider = 1022008,
  Banner = 1022010,
}

const BrandsInfo = () => {
  const router = useRouter()
  const [showPlayButton, setShowPlayButton] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const { data } = useGetWebCmsContentsQuery({
    ...ApiConstants,
    entityId: router!.query.brandId![0],
    pageSize: 100,
  })

  const { data: brandData } = useGetWebCatalogBrandsByIdQuery({
    ...ApiConstants,
    id: router!.query.brandId![0],
  })

  const group = data?.data?.items?.reduce(
    (result, item) => ({
      ...result,
      [item!['contentType']!]: [...((result as any)[item!['contentType']!] || []), item],
    }),
    {} as Record<ContentTypeEnums, GetContentsQueryResult[]>,
  )

  const imageDefault = group?.[ContentTypeEnums.Image]?.filter((_) => _.factor === 'main')?.[0]
  const description = group?.[ContentTypeEnums.Html]?.[0]
  const video = group?.[ContentTypeEnums?.Video]?.[0]
  const images = group?.[ContentTypeEnums.Image]?.filter((_) => _.factor === 'other')?.slice(0, 2)

  return (
    <Box mb={4}>
      <HBCarousel
        pagination={{
          renderBullet(index, className) {
            return ValuingCustomPagination(index, className)
          },
          clickable: true,
        }}
      >
        {group?.[ContentTypeEnums.Image]
          ?.filter((_) => _.factor === 'banner')
          ?.map((banner, index) => (
            <Box
              component="img"
              height={{ md: 241, sm: 338, xs: 164 }}
              sx={{ objectPosition: 'center', maxWidth: '100%' }}
              src={process.env.NEXT_PUBLIC_CDN! + banner.value}
              key={banner.id}
            />
          ))}
      </HBCarousel>
      <Box bgcolor="common.white" borderRadius={2} mt={6} mb={4} px={6}>
        <HBTabs
          value={1}
          variant="scrollable"
          sx={{
            [`& .${tabsClasses.indicator}`]: {
              borderRadius: (theme) => theme.spacing(2, 2, 0, 0),
              height: 5,
            },
          }}
        >
          <HBTab
            label={
              <Typography variant="subtitle1" color="primary.main">
                {brandData?.data?.name}
              </Typography>
            }
            value={1}
          />
        </HBTabs>
      </Box>
      {!!description && (
        <Box mt={4} borderRadius={2} p={6} bgcolor="common.white" mb={6}>
          <Typography variant="h6" color="text.priamry">
            توضیحات
          </Typography>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Box
              p={6}
              borderRadius={4}
              border={(theme) => `1px solid ${theme.palette.grey[200]}`}
              width={{ xs: '100%', sm: 'calc(100% - 338px)' }}
            >
              <Box
                sx={{
                  '& *': {
                    fontFamily: (theme) => `${theme.typography.fontFamily} !important`,
                    textAlign: 'justify !important',
                  },
                  '& p': {
                    m: 0,
                  },
                  lineHeight: `19.6px !important`,
                  height: { xs: 380, sm: 175 },
                  overflow: 'hidden',
                }}
                dangerouslySetInnerHTML={{ __html: description?.value || '' }}
              />
            </Box>
            {!!imageDefault && (
              <Box
                component="img"
                src={process.env.NEXT_PUBLIC_CDN! + imageDefault?.value}
                alt="defailt image"
                width={318}
                display={{ xs: 'none', sm: 'block' }}
                sx={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            )}
          </Box>
        </Box>
      )}

      <Box mb={4} display={{ xs: 'unset', sm: 'flex' }} justifyContent="space-between">
        {!!video && (
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', sm: '50%' },
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <video
              ref={videoRef}
              src={process.env.NEXT_PUBLIC_CDN! + group?.[ContentTypeEnums?.Video]?.[0]?.value}
              width="100%"
              height="100%"
              controls={!showPlayButton}
            />
            {showPlayButton && (
              <>
                <Box
                  sx={{
                    bgcolor: 'rgba(119, 119, 119, 0.5)',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    position: 'absolute',
                  }}
                />
                <HBIconButton
                  icon="play"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    color: 'info.main',
                  }}
                  onClick={() => {
                    setShowPlayButton(false)
                    videoRef?.current?.play()
                  }}
                  variant="outlined"
                />
              </>
            )}
          </Box>
        )}
        {!!images?.length && (
          <Stack
            spacing={{ xs: 4, sm: 6 }}
            ml={{ sm: 6 }}
            mt={{ xs: 4, sm: 'unset' }}
            width={{ xs: '100%', sm: '49%' }}
          >
            {group?.[ContentTypeEnums.Image]
              ?.filter((_) => _.factor === 'other')
              ?.slice(0, 2)
              ?.map((image) => (
                <Box
                  sx={{ borderRadius: 4, objectPosition: 'center' }}
                  component="img"
                  height={160}
                  src={process.env.NEXT_PUBLIC_CDN! + image.value}
                  width="100%"
                />
              ))}
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default BrandsInfo

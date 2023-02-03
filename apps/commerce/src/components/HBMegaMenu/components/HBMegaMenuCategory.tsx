import HBLink from '@hasty-bazar-commerce/components/HBLink'
import {
  GetMenuItemsQueryResult,
  ImageResult,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { MegaMenuLink, RecallTypeCodeEnum } from '../HBMegaMenu'

interface HBMegaMenuCategoryProps {
  data: GetMenuItemsQueryResult & {
    children?: GetMenuItemsQueryResult[]
  }
}

const HBMegaMenuCategory: FC<HBMegaMenuCategoryProps> = (props) => {
  const { data } = props
  const [imageUrl, setImageUrl] = useState<ImageResult>()
  let metadataImageObject

  if (imageUrl || !!data?.images?.length) {
    metadataImageObject = JSON.parse(
      imageUrl ? imageUrl?.metaDataObject! : data?.images?.[0]?.metaDataObject!,
    )
  }

  return (
    <Box
      p={6}
      display="flex"
      justifyContent="space-between"
      onMouseLeave={() => setImageUrl(undefined)}
    >
      <Box display="flex" width={data?.images?.length ? '50%' : '100%'}>
        <Stack width="100%">
          <Typography variant="subtitle1" color="common.black" mb={4}>
            {data.title}
          </Typography>
          <Divider sx={{ borderColor: 'grey.200' }} />

          <Stack sx={{ height: 280, flexWrap: 'wrap' }} pt={2}>
            {data?.children?.map((item) => (
              <MegaMenuLink menu={item} key={item.id}>
                <Typography
                  onMouseEnter={() => setImageUrl(item?.images?.[0])}
                  py={2.5}
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    cursor: item.recallType === RecallTypeCodeEnum.None ? 'default' : 'pointer',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    '&:hover': {
                      color:
                        item.recallType === RecallTypeCodeEnum.None
                          ? 'text.secondary'
                          : 'secondary.main',
                    },
                  }}
                >
                  {item.title}
                </Typography>
              </MegaMenuLink>
            ))}
          </Stack>
        </Stack>
      </Box>
      {(!!data?.images?.length || !!imageUrl) && (
        <Box width="49%" mt={13} display="flex" alignItems="center" justifyContent="flex-end">
          <HBLink
            href={metadataImageObject?.url ?? '#'}
            passHref
            target="_blank"
            width="100%"
            sx={{ textAlign: 'center' }}
          >
            <Box
              component="img"
              src={
                process.env.NEXT_PUBLIC_CDN! + (imageUrl?.imageUrl || data?.images?.[0].imageUrl!)
              }
              sx={{
                borderRadius: 16,
                objectFit: 'contain',
                objectPosition: 'center',
                maxHeight: 257,
              }}
            />
          </HBLink>
        </Box>
      )}
    </Box>
  )
}

export default HBMegaMenuCategory

import { HBLink } from '@hasty-bazar/admin-shared/components'
import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import { BusinessTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { ContentTypeEnum } from '@hasty-bazar/admin-shared/core/utils/contentTypes'
import { useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { GetAllCommentsQueryResult } from '@hasty-bazar/admin-shared/services/socialApi.generated'
import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import CommentMessages from '../CommentPage.messages'
import ContentDialog from '../containers/CommentContentDialog'
import { ImageWrapperStyle } from './CommentContentCarousel'

interface CommentCardProps {
  data: GetAllCommentsQueryResult
}
const CommentCard = ({ data }: CommentCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { formatMessage } = useIntl()

  const { data: { data: { items: CustomerRecommendationData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': '',
      'client-version': '',
      businessType: BusinessTypeEnums.CustomerProductRecommendationType,
    })
  const recommendation = CustomerRecommendationData?.find((i) => i.id == data.recommendationType)

  const { data: { data: { items: imageData = [] } = {} } = {} } =
    useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
      {
        'client-name': '',
        'client-version': '',
        entityId: data.id!,
        entityTypeId: EntityTypeEnums.Comment,
        contentType: ContentTypeEnum.Image,
      },
      {
        skip: !data?.attachmentFileCount,
      },
    )

  return (
    <>
      <Stack p={1} sx={{ backgroundColor: ({ palette }) => palette.grey[100] }}>
        <Stack
          bgcolor="common.white"
          borderRadius={({ spacing }) => spacing(4)}
          display={'flex'}
          flexDirection={'column'}
          gap={4}
          sx={{
            border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          }}
          minHeight="400"
          p={({ spacing }) => spacing(6, 5)}
        >
          <Grid container spacing={3}>
            <Grid item xs={9}>
              <Stack display={'flex'} flexDirection={'row'} gap={4}>
                <Typography variant="h5"> {data.subject}</Typography>
                <Stack
                  direction="row"
                  columnGap={1}
                  bgcolor="warning.lighter"
                  borderRadius={({ spacing }) => spacing(2)}
                  px={2}
                  alignItems="center"
                >
                  <Typography variant="body1" color="warning.main">
                    {data.rate}
                  </Typography>
                  <HBIcon type="star" size="small" sx={{ color: 'warning.main' }} />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack display={'flex'} flexDirection={'row'} gap={3} justifyContent={'flex-end'}>
                <Typography variant="body1" color={({ palette }) => palette.grey[500]}>
                  {data.partyFullName}
                </Typography>
                <Typography variant="body1" color={({ palette }) => palette.grey[500]}>
                  {new Date(data.createdOn!).toLocaleDateString('fa-IR', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Divider variant="middle" sx={{ color: 'grey.200' }} />
          <Grid container spacing={8}>
            <Grid item md={9} gap={6} container flexDirection={'column'}>
              <Typography variant="body1" sx={{ whiteSpace: 'normal' }} fontWeight={400}>
                {data.body}
              </Typography>
              <Stack direction="row" alignItems={'baseline'} gap={2}>
                <HBIcon
                  type={`${recommendation?.iconName}` as HBIconType}
                  size="small"
                  sx={{ color: recommendation?.colorName, objectFit: 'contain' }}
                />
                <Typography variant="body1" color={`${recommendation?.colorName}`} fontWeight={400}>
                  {recommendation?.title}
                </Typography>
              </Stack>
              <Divider variant="middle" sx={{ color: 'grey.200' }} />
              <Grid container gap={2} onClick={() => setIsOpen(true)} alignItems={'center'}>
                {formatMessage(CommentMessages.userAttachments)}
                {imageData?.map((media, index) => (
                  <>
                    {index < 5 && (
                      <ImageWrapperStyle
                        sx={{
                          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
                          borderInlineStyle: 'solid',
                        }}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_CDN}${media.value}`}
                          width={48}
                          height={48}
                          loading="lazy"
                        />
                      </ImageWrapperStyle>
                    )}
                  </>
                ))}
                {imageData?.length! > 5 && (
                  <ImageWrapperStyle>
                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      sx={{
                        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
                        borderInlineStyle: 'solid',
                        bgcolor: 'grey.100',
                        width: 50,
                        height: 50,
                      }}
                    >
                      {imageData?.length! - 5}+
                    </Box>
                  </ImageWrapperStyle>
                )}
              </Grid>
            </Grid>
            <Grid item md={3} container justifyContent={'space-between'}>
              <Box />
              <HBLink
                href={`/products/simple-product/edit/product-details/${data?.productId}/`}
                target="_blank"
              >
                <HBImg
                  width={150}
                  height={150}
                  sx={{ cursor: 'pointer' }}
                  src={`${process.env.NEXT_PUBLIC_CDN}${data?.productDefaultImage}`}
                />
              </HBLink>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
      {imageData?.length !== 0 && (
        <ContentDialog
          id={data.id!}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          entityTypeId={9001}
        />
      )}
    </>
  )
}

export default CommentCard

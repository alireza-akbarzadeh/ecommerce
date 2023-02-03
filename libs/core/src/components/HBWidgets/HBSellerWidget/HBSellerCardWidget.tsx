import { Avatar, Box, Stack, Typography } from '@mui/material'
import { FC, ReactNode } from 'react'
import { BoxImagesStyle, FooterCardStyle } from './HBSellerWidget.styles'

export interface HBSellerCardWidgetProps {
  imageUrls: { imageUrl?: string; id: string }[]
  avatarUrl: string
  storeName: string
  followerCount: number
  onSave?: () => void
  saveVendor?: ReactNode
  prefixImageUrl: string
  folowerTitle?: ReactNode
}

const HBSellerCardWidget: FC<HBSellerCardWidgetProps> = (props) => {
  const {
    avatarUrl,
    storeName,
    followerCount,
    imageUrls,
    saveVendor,
    prefixImageUrl,
    folowerTitle,
  } = props
  const images = [
    ...imageUrls,
    { imageUrl: undefined, id: new Date().getTime() + 'image' },
    { imageUrl: undefined, id: new Date().getTime() + 'image' },
    { imageUrl: undefined, id: new Date().getTime() + 'image' },
    { imageUrl: undefined, id: new Date().getTime() + 'image' },
  ].slice(0, 4)

  return (
    <Box
      height="100%"
      border="1px solid"
      borderColor="grey.100"
      borderRadius={(theme) => theme.spacing(4)}
      overflow="hidden"
    >
      <BoxImagesStyle>
        {images?.map((item, idx) => (
          <Box
            sx={{
              flex: '1 0 calc(46% - 5px)',
              border: (theme) => (!item?.imageUrl ? `1px solid ${theme.palette.grey[100]}` : ''),
              borderRadius: !item?.imageUrl ? 4 : '',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 170,
              maxHeight: 170,
            }}
            key={item.id + idx}
          >
            <Box
              component="img"
              src={item?.imageUrl ? prefixImageUrl + item.imageUrl : '/'}
              width="100%"
              height="100%"
              sx={{
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </Box>
        ))}
      </BoxImagesStyle>
      <FooterCardStyle>
        <Box display="flex" alignItems="center">
          <Avatar src={avatarUrl} />
          <Stack spacing={2} ml={2}>
            <Typography
              variant="subtitle1"
              color="text.primary"
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                width: 160,
                whiteSpace: 'nowrap',
              }}
            >
              {storeName}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {followerCount?.toString() || '0'} {folowerTitle}
            </Typography>
          </Stack>
        </Box>
        {saveVendor}
      </FooterCardStyle>
    </Box>
  )
}

export default HBSellerCardWidget

import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/core'
import { Typography } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
type UploadBannersProps = {
  userId: string
}
const UploadBanners = ({ userId }: UploadBannersProps) => {
  const { formatMessage } = useIntl()
  const [bannerCount, setBannerCount] = useState('')

  return (
    <HBContentUploader
      entityId={userId}
      entityTypeId={EntityTypeEnums.Vendor}
      fileType={ContentTypeEnums.Banner}
      onUploaded={(_, files) => {
        setBannerCount(files?.length ? String(files?.length) : '')
      }}
      title={
        <>
          {formatMessage(userPageMessages.banner)}
          {bannerCount && (
            <Typography
              component="span"
              sx={({ palette, spacing }) => ({
                background: palette.primary.lighter,
                color: palette.primary.main,
                borderRadius: spacing(2),
              })}
              py={0.5}
              px={2}
              mx={1}
            >
              {bannerCount}
            </Typography>
          )}
        </>
      }
    />
  )
}
export default UploadBanners

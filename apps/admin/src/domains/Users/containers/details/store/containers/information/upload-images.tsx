import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/core'
import { Typography } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'

type UploadBannersProps = {
  userId: string
}

const UploadImages = ({ userId }: UploadBannersProps) => {
  const { formatMessage } = useIntl()
  const [imageCount, setImageCount] = useState('')

  return (
    <HBContentUploader
      entityId={userId}
      entityTypeId={EntityTypeEnums.Vendor}
      fileType={ContentTypeEnums.Image}
      onUploaded={(_, files) => {
        setImageCount(files?.length ? String(files?.length) : '')
      }}
      title={
        <>
          {formatMessage(userPageMessages.images)}
          {imageCount && (
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
              {imageCount}
            </Typography>
          )}
        </>
      }
      feedback={{
        show: true,
        likeCount: 20,
        visitorsCount: 156,
      }}
    />
  )
}

export default UploadImages

import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import ContentManagementPageMessages from '@hasty-bazar-admin/domains/Content-Arrangement/ContentManagementPage.messages'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

const ContentUpload = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const voucherId: string = router?.query?.id?.[0] as string

  return (
    <Box p={5}>
      <HBContentUploader
        entityId={String(voucherId)}
        entityTypeId={EntityTypeEnums.Voucher}
        fileType={ContentTypeEnums.Image}
        title={formatMessage(ContentManagementPageMessages.pictureUpload)}
      />
      <HBContentUploader
        entityId={String(voucherId)}
        entityTypeId={EntityTypeEnums.Voucher}
        fileType={ContentTypeEnums.Video}
        title={formatMessage(ContentManagementPageMessages.videoUpload)}
      />
    </Box>
  )
}

export default ContentUpload

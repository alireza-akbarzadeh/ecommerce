import { EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { ContentTypeEnum } from '@hasty-bazar/admin-shared/core/utils/contentTypes'
import {
  EntityType,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import CommentMessages from '../CommentPage.messages'
import CommentContentCarousel from '../components/CommentContentCarousel'

export interface ContentDialogProps extends DialogProps {
  id: string
  entityTypeId: EntityType
}
const ContentDialog = ({ id, entityTypeId, ...props }: ContentDialogProps) => {
  const { onClose } = props
  const { formatMessage } = useIntl()

  const { data: { data: { items: imageData = [] } = {} } = {} } =
    useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery({
      'client-name': 'Swagger on Hit.Hastim.CMS.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      entityId: id,
      entityTypeId,
      contentType: ContentTypeEnum.Image,
    })

  return (
    <Dialog
      {...props}
      sx={{ '& .MuiPaper-root': { borderRadius: ({ spacing }) => spacing(4), minWidth: 300 } }}
    >
      <DialogTitle sx={{ bgcolor: 'grey.100', p: 0, pr: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box
            width={'100%'}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            pr={2}
            pl={4}
            py={3}
          >
            <Typography variant="body2" color={'grey.500'} fontWeight={400}>
              {formatMessage(CommentMessages.userContentsTitle)}
            </Typography>
            <Box onClick={() => onClose!({}, 'backdropClick')} sx={{ cursor: 'pointer' }}>
              <HBIcon
                sx={{ color: 'grey.500', display: 'flex', alignItems: 'center' }}
                size="small"
                type="multiply"
              />
            </Box>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <CommentContentCarousel id={id} entityTypeId={entityTypeId} data={imageData!} />
      </DialogContent>
    </Dialog>
  )
}

export default ContentDialog

export const CommentGridContentDialog = ({ data, value }: ICellRendererParams) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <Box
        sx={{ cursor: 'pointer', color: `${data?.attachmentFileCount !== 0 && 'primary.main'}` }}
        onClick={() => setIsOpen(true)}
      >
        {value}
      </Box>
      {data.attachmentFileCount !== 0 && (
        <ContentDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          id={data.id}
          entityTypeId={EntityTypeEnums.Comment}
        />
      )}
    </>
  )
}

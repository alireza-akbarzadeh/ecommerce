import { useGetAdminAuditWorkflowsInfoByEntityIdQuery } from '@hasty-bazar/admin-shared/services/auditApi.generated'
import { HBDialog, HBFieldset, HBIcon } from '@hasty-bazar/core'
import { Box, Grid } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import CommentMessages from '../CommentPage.messages'

export interface CommentReasonDialogProps {
  id: string
}

export default function CommentReasonDialog({ id }: CommentReasonDialogProps) {
  const { formatMessage } = useIntl()
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)

  const { data: { data } = {} } = useGetAdminAuditWorkflowsInfoByEntityIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Audit.Endpoints.AdminApi',
      'client-version': '1.0.0.0',
      entityId: id,
    },
    {
      skip: !id,
    },
  )

  return (
    <>
      <Box
        onClick={() => {
          setOpenConfirmModal(true)
        }}
      >
        {data && data.comment && data.reason && (
          <HBIcon type="eye" size="small" sx={{ color: 'primary.main' }} />
        )}
      </Box>
      <HBDialog
        title={formatMessage(CommentMessages.changeStateReason)}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
      >
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <HBFieldset
              title={formatMessage(CommentMessages.stateTitle)}
              children={data?.stateTitle}
            />
          </Grid>
          <Grid item xs={6}>
            <HBFieldset
              title={formatMessage(CommentMessages.reasonTitle)}
              children={data?.reason}
            />
          </Grid>
          <Grid item xs={12}>
            <HBFieldset
              title={formatMessage(CommentMessages.descriptionTitle)}
              children={data?.comment}
              sx={{ height: 100 }}
            />
          </Grid>
        </Grid>
      </HBDialog>
    </>
  )
}

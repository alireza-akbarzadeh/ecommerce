import { PostAdminCatalogProductsBulkUpdateLoadListApiResponse } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBDialog } from '@hasty-bazar/core'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useIntl } from 'react-intl'
import ProductBulkEditMessages from '../../ProductBulkEdit.messages'
import UploadComponent from './uploadComponent'

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  onUpload: (data: { data: PostAdminCatalogProductsBulkUpdateLoadListApiResponse }) => void
}

export default function UploadDialog({ open, onClose, onUpload }: UploadDialogProps) {
  return (
    <HBDialog content={''} open={open} title={'  '} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
          pb: 12,
        }}
      >
        <UploadComponent onUpload={onUpload} />
      </Box>
    </HBDialog>
  )
}

import { HBLink } from '@hasty-bazar/admin-shared/components'
import { HBAudioPlayer } from '@hasty-bazar/admin-shared/components/HBAudio'
import crmMessages from '@hasty-bazar-admin/domains/Crm/crm.message'
import { CrmGridModel } from '@hasty-bazar-admin/domains/Crm/types'
import { HBDialog, HBFieldset } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import React from 'react'
import { useIntl } from 'react-intl'
import FileViewHeader from './FileViewHeader'

export type FileViewModalProps = {
  open: boolean
  onClose: () => void
  crmItem: CrmGridModel
}

export default function FileViewModal({ open, onClose, crmItem }: FileViewModalProps) {
  const { formatMessage } = useIntl()
  return (
    <HBDialog
      title={formatMessage(crmMessages.filePathView)}
      onReject={onClose}
      open={open}
      onClose={onClose}
      contentSx={{ maxWidth: 'unset !important' }}
    >
      <Box
        width={{
          sm: '100%',
          md: 700,
          lg: 900,
        }}
        minHeight={400}
      >
        <FileViewHeader crmItem={crmItem} />
        <HBFieldset title={formatMessage(crmMessages.gridMessageDescription)} sx={{ mb: 4 }}>
          {crmItem?.messageDescription}
        </HBFieldset>
        {crmItem?.voiceUrl && (
          <HBFieldset title={formatMessage(crmMessages.soundMessage)} sx={{ mb: 4 }}>
            <HBAudioPlayer src={crmItem?.voiceUrl!} />
          </HBFieldset>
        )}
        {crmItem?.filePath && (
          <HBFieldset title={formatMessage(crmMessages.modalImages)} sx={{ mb: 4 }}>
            <HBLink href={process.env.NEXT_PUBLIC_CDN + crmItem?.filePath!} target="_blank">
              <Box
                component="img"
                src={process.env.NEXT_PUBLIC_CDN + crmItem?.filePath!}
                width={250}
                height={'auto'}
                sx={{ borderRadius: ({ spacing }) => spacing(2) }}
              />
            </HBLink>
          </HBFieldset>
        )}
      </Box>
    </HBDialog>
  )
}

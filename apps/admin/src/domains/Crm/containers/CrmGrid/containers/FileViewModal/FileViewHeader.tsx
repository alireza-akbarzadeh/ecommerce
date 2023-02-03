import crmMessages from '@hasty-bazar-admin/domains/Crm/crm.message'
import { CrmGridModel } from '@hasty-bazar-admin/domains/Crm/types'
import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useIntl } from 'react-intl'

export type FileViewHeaderProps = {
  crmItem: CrmGridModel
}

export default function FileViewHeader({ crmItem }: FileViewHeaderProps) {
  const { formatMessage } = useIntl()
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      mb={4}
      px={2}
    >
      <Typography variant="subtitle1">{formatMessage(crmMessages.filePathViewType)}</Typography>
      <Stack spacing={4}>
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">{formatMessage(crmMessages.modalStatus)}:</Typography>
          <Typography variant="subtitle2">{crmItem?.status}</Typography>
        </Stack>
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">{formatMessage(crmMessages.modalTime)}:</Typography>
          <Stack spacing={2} direction="row">
            <Typography variant="subtitle2">
              {new Date(crmItem?.createDate!).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
            <Typography variant="subtitle2">
              {new Date(crmItem?.createDate!).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

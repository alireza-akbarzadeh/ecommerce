import { PanelType } from '@hasty-bazar/admin-shared/core/enums'
import {
  GetProductRecordHistoryQueryResult,
  GetProductRecordHistoryQueryResultApiResult,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Grid, Stack, Typography } from '@mui/material'
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query'
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import { useIntl } from 'react-intl'
import HBRecordHistoryMessages from '../HBRecordHistory.messages'

export interface HBRecordHistoryProps {
  isBorder?: boolean
  disabled?: boolean
  isShowAccordion?: boolean
  showInRows?: boolean
  entityId?: string
  data?: GetProductRecordHistoryQueryResult
  useGetHistory?: UseQuery<
    QueryDefinition<
      HistoryModelArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      GetProductRecordHistoryQueryResultApiResult,
      'api'
    >
  >
}

const labelStyle = {
  color: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  fontWeigth: 500,
}
export type HistoryModelArg = {
  'client-name': string
  'client-version': string
  id: string
}

export default function RecordHistory({ isBorder, showInRows, data }: HBRecordHistoryProps) {
  const { formatMessage } = useIntl()
  const panelName = (key: string) => {
    switch (key) {
      case `${PanelType.Admin}`:
        return formatMessage(HBRecordHistoryMessages.adminPanel)
      case `${PanelType.Seller}`:
        return formatMessage(HBRecordHistoryMessages.vendorPanel)
      case `${PanelType.Buyer}`:
        return formatMessage(HBRecordHistoryMessages.customerPanel)
      default:
        return formatMessage(HBRecordHistoryMessages.adminPanel)
    }
  }

  return (
    <Grid
      container
      spacing={2}
      borderRadius={({ spacing }) => spacing(3)}
      pb={3}
      sx={{
        width: '100%',
        margin: 0,
        border: ({ palette }) => `${isBorder && `1px solid ${palette.grey[300]} !important`}`,
        bgcolor: 'common.white',
      }}
    >
      <Grid item xs={12} sm={showInRows ? 12 : 6}>
        <Typography sx={labelStyle}>
          <HBIcon type="plus" />
          {formatMessage(HBRecordHistoryMessages.createdBy)}
        </Typography>
        <Grid container spacing={2} pt={6} pb={3}>
          <Grid item xs={showInRows ? 4 : 12}>
            <HistoryItem
              keyTitle={formatMessage(HBRecordHistoryMessages.panelPortal)}
              valueTitle={panelName(data?.createdIn!) ?? '-'}
            />
          </Grid>
          <Grid item xs={showInRows ? 4 : 12}>
            <HistoryItem
              keyTitle={formatMessage(HBRecordHistoryMessages.userTitle)}
              valueTitle={data?.createdByFullName ?? '-'}
            />
          </Grid>
          <Grid item xs={showInRows ? 4 : 12}>
            <HistoryItem
              keyTitle={formatMessage(HBRecordHistoryMessages.timeTitle)}
              valueTitle={
                data?.createdOn
                  ? new Date(data?.createdOn).toLocaleDateString('fa-IR', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={showInRows ? 12 : 6}>
        <Typography sx={labelStyle}>
          <HBIcon type="pen" />

          {formatMessage(HBRecordHistoryMessages.modifiedBy)}
        </Typography>
        <Grid container spacing={2} pt={6} pb={3}>
          <Grid item xs={showInRows ? 4 : 12}>
            <HistoryItem
              keyTitle={formatMessage(HBRecordHistoryMessages.panelPortal)}
              valueTitle={panelName(data?.modifiedIn!) ?? '-'}
            />
          </Grid>
          <Grid item xs={showInRows ? 4 : 12}>
            <HistoryItem
              keyTitle={formatMessage(HBRecordHistoryMessages.userTitle)}
              valueTitle={data?.modifiedByFullName ?? '-'}
            />
          </Grid>
          <Grid item xs={showInRows ? 4 : 12}>
            <HistoryItem
              keyTitle={formatMessage(HBRecordHistoryMessages.timeTitle)}
              valueTitle={
                data?.modifiedOn
                  ? new Date(data?.modifiedOn).toLocaleDateString('fa-IR', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

interface HistoryItemProps {
  valueTitle: string
  keyTitle: string
}
function HistoryItem({ keyTitle, valueTitle }: HistoryItemProps) {
  return (
    <Stack display={'flex'} flexDirection={'row'} alignItems={'baseline'} gap={1} flexWrap={'wrap'}>
      <Typography variant="body1"> {keyTitle} </Typography>
      <Typography variant="body1" sx={{ direction: (theme) => theme.direction }}>
        {valueTitle}
      </Typography>
    </Stack>
  )
}

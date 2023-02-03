import { HBLink } from '@hasty-bazar/admin-shared/components'
import { Typography } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { format } from 'date-fns-jalali'
import { useIntl } from 'react-intl'
import workflowMessages from '../../HBWorkflow.messages'

function useWorkflowHistoryGridColumn() {
  const { formatMessage } = useIntl()
  const JALALI_DATE_FORMAT = 'yyyy-MM-dd'
  const JALALI_HOUR_FORMAT = 'HH:mm'

  const columnDefs = [
    {
      field: 'environment.platform',
      headerName: formatMessage(workflowMessages.gateway),
      rowGroup: false,
      enableRowGroup: true,
      minWidth: 150,
    },
    {
      field: 'environment.username',
      headerName: formatMessage(workflowMessages.byUser),
      rowGroup: false,
      enableRowGroup: true,
      minWidth: 250,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <HBLink href={`/users/detail/${params?.data?.environment?.userId}`}>
            <Typography variant="body2" sx={{ mt: 2, color: ({ palette }) => palette.info.main }}>
              {params?.value}
            </Typography>
          </HBLink>
        )
      },
    },
    {
      field: 'auditDate',
      headerName: formatMessage(workflowMessages.date),
      rowGroup: false,
      enableRowGroup: true,
      minWidth: 150,
      cellRenderer: (params: ICellRendererParams) => {
        if (!params?.data) return params?.value
        return format(new Date(params?.value), JALALI_DATE_FORMAT)
      },
    },
    {
      field: 'hour',
      headerName: formatMessage(workflowMessages.hour),
      minWidth: 150,
      cellRenderer: (params: ICellRendererParams) => {
        if (!params?.data) return params?.value
        return format(new Date(params?.data?.auditDate), JALALI_HOUR_FORMAT)
      },
    },
    {
      field: 'fromStateTitle',
      headerName: formatMessage(workflowMessages.fromStateTitle),
      minWidth: 150,
      cellRenderer: (params: ICellRendererParams) => {
        return params?.value
      },
    },
    {
      field: 'toStateTitle',
      headerName: formatMessage(workflowMessages.toStateTitle),
      minWidth: 150,
      cellRenderer: (params: ICellRendererParams) => {
        return params?.value
      },
    },
    {
      field: 'isSuccess',
      headerName: formatMessage(workflowMessages.result),
      minWidth: 150,
      cellRenderer: (params: ICellRendererParams) => {
        return params?.value
          ? formatMessage(workflowMessages.done)
          : formatMessage(workflowMessages.notDone)
      },
    },
    {
      field: 'postScript',
      headerName: formatMessage(workflowMessages.postScript),
      minWidth: 150,
    },
    {
      field: 'reason',
      headerName: formatMessage(workflowMessages.reason),
      minWidth: 150,
    },
  ] as ColDef[]

  return { columnDefs }
}

export default useWorkflowHistoryGridColumn

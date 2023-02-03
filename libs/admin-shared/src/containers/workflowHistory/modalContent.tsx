import { HBLink } from '@hasty-bazar/admin-shared/components'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { useGetAdminAuditWorkflowsQuery } from '@hasty-bazar/admin-shared/services/auditApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBIcon } from '@hasty-bazar/core'
import { Box, Typography, useTheme } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { format } from 'date-fns-jalali'
import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import Status from './status'
import overflowHistoryMessages from './workflowHistory.messages'

type ModalContentProps = {
  id: string
  onClose: VoidFunction
  type: string
}

enum statusBadgeEnum {
  Draft = 'پیش نویس',
  Published = 'انتشار',
  Disable = 'غیر فعال',
}

export default function ModalContent({ id, onClose, type }: ModalContentProps) {
  const [pageNumber, setPageNumber] = useState<number>(1)

  const { data: { data: workflowItems } = {} } = useGetAdminAuditWorkflowsQuery({
    'client-name': 'Swagger on HIT.Hastim.Audit.Endpoints.AdminApi',
    'client-version': '1.0.0.0',
    entityId: id,
  })

  const theme = useTheme()
  const { formatMessage } = useIntl()

  const classes: HBAgGridClasses = {
    wrapper: {
      backgroundColor: `${theme.palette.common.white} !important`,
      mt: 6,
      height: `calc(100vh - 240px)`,

      '& .ag-layout-normal .ag-header': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        border: 'unset',
      },
      '&>div:last-child': {
        padding: theme.spacing(3),
        borderRadius: 2,
        backgroundColor: theme.palette.grey[100],
      },
      '& div.ag-root-wrapper': {
        border: 'unset',
      },
    },
  }

  const gridRef = useRef<HBDataGridClientRef>(null)

  const JALALI_DATE_FORMAT = 'yyyy-MM-dd'
  const JALALI_HOUR_FORMAT = 'HH:mm:ss'

  const statusBadge = (status: string | boolean) => {
    switch (status) {
      case statusBadgeEnum.Draft:
        return 1
      case statusBadgeEnum.Published:
        return 2
      case statusBadgeEnum.Disable:
        return 3
      case true:
        return 4
      case false:
        return 5
      default:
        return 1
    }
  }

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'gateway',
        headerName: formatMessage(overflowHistoryMessages.gateway),
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'byUser',
        headerName: formatMessage(overflowHistoryMessages.byUser),
        rowGroup: false,
        enableRowGroup: true,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <HBLink href={`/vendors/edit/vendor-details/${params?.data?.environment?.userId}`}>
              <Typography variant="body2" sx={{ mt: 2, color: ({ palette }) => palette.info.main }}>
                {params?.value}
              </Typography>
            </HBLink>
          )
        },
      },
      {
        field: 'auditDate',
        headerName: formatMessage(overflowHistoryMessages.date),
        rowGroup: false,
        enableRowGroup: true,
        cellRenderer: (params: ICellRendererParams) => {
          if (!params?.data) return params?.value
          return format(new Date(params?.value), JALALI_DATE_FORMAT)
        },
      },
      {
        field: 'hour',
        headerName: formatMessage(overflowHistoryMessages.hour),
        cellRenderer: (params: ICellRendererParams) => {
          if (!params?.data) return params?.value
          return format(new Date(params?.value), JALALI_HOUR_FORMAT)
        },
      },
      {
        field: 'fromStateTitle',
        headerName: formatMessage(overflowHistoryMessages.fromStateTitle),
        cellRenderer: (params: ICellRendererParams) => {
          return <Status sx={{ mt: 2 }} status={statusBadge(params?.value)} />
        },
      },
      {
        field: 'toStateTitle',
        headerName: formatMessage(overflowHistoryMessages.toStateTitle),
        cellRenderer: (params: ICellRendererParams) => {
          return <Status sx={{ mt: 2 }} status={statusBadge(params?.value)} />
        },
      },
      {
        field: 'isSuccess',
        headerName: formatMessage(overflowHistoryMessages.result),
        cellRenderer: (params: ICellRendererParams) => {
          return <Status sx={{ mt: 2 }} status={statusBadge(params?.value)} />
        },
      },
      {
        field: 'postScript',
        headerName: formatMessage(overflowHistoryMessages.postScript),
      },
      {
        field: 'reason',
        headerName: formatMessage(overflowHistoryMessages.reason),
      },
    ],
    [],
  )

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = []
        gridRef.current!.addFilter({
          id: 'searchModal',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchModal')
      }
    }
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 4,
        maxHeight: '90vh',
        overflow: 'auto',
        p: 6,
        pb: 38,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          {formatMessage(overflowHistoryMessages.overflowHistoryTitle)}
        </Typography>

        <Box sx={{ cursor: 'pointer' }} onClick={() => onClose()}>
          <HBIcon type="times" />
        </Box>
      </Box>
      <HBDataGridClient
        actionUrl=""
        columnDefs={columnDefs}
        rowData={
          workflowItems?.items?.length
            ? [
                ...workflowItems?.items?.map((item) => ({
                  ...item,
                  byUser: item?.environment?.fullname,
                  gateway: item?.environment?.platform,
                  hour: item?.auditDate,
                })),
              ]
            : []
        }
        pagination
        paginationPageSize={25}
        totalRows={workflowItems?.totalItems}
        paginationPageNumber={pageNumber}
        onPageChange={(pageNumber) => setPageNumber(pageNumber)}
        paginationOptions={{ hideselectPage: true }}
        rowGroupPanelShow={'always'}
        enableRtl
        classes={classes}
        ref={gridRef}
        GridToolbar={() => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ show: false }}
            deleteProps={{
              show: false,
            }}
            editProps={{ show: false }}
            moreProps={{ show: false }}
            statusProps={{ show: false }}
            searchProps={{ show: true, openPosition: 'right' }}
          ></HBDataGrigToolbar>
        )}
      />
    </Box>
  )
}

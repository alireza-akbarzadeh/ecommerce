import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { PaginatedGetByFilterQueryResult } from '@hasty-bazar/admin-shared/services/auditApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'
import recordChangeHistoryMessages from './recordChangeHistory.messages'

const classes: HBAgGridClasses = {
  wrapper: {},
}

export interface ModalContentDetailProps extends Omit<ICellRendererParams, 'data'> {
  data: PaginatedGetByFilterQueryResult
}
export default function ModalContentDetail({ data }: ModalContentDetailProps) {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'number',
        headerName: formatMessage(recordChangeHistoryMessages.record),
      },
      {
        field: 'columnName',
        headerName: formatMessage(recordChangeHistoryMessages.fieldName),
        cellRenderer: (params: ICellRendererParams) => {
          return params.data?.localColumnName || params.data?.columnName
        },
      },
      {
        field: 'originalValue',
        headerName: formatMessage(recordChangeHistoryMessages.fromValue),
      },
      {
        field: 'currentValue',
        headerName: formatMessage(recordChangeHistoryMessages.toValue),
      },
    ],
    [],
  )

  return (
    <Box pt={6} mx={10}>
      <Typography variant="h5">{formatMessage(recordChangeHistoryMessages.seeDetails)}</Typography>
      <HBDataGridClient
        actionUrl={''}
        columnDefs={columnDefs}
        rowData={
          data?.changesItems?.length
            ? data?.changesItems?.filter((item) => item?.localColumnName)
            : []
        }
        pagination
        paginationPageSize={5}
        paginationOptions={{ hideselectPage: true }}
        enableRtl
        classes={classes}
        ref={gridRef}
        GridToolbar={() => (
          <HBDataGrigToolbar
            addProps={{ show: false }}
            deleteProps={{
              show: false,
            }}
            editProps={{ show: false }}
            refreshProps={{ show: false }}
            moreProps={{ show: false }}
            searchProps={{ show: false }}
            statusProps={{ show: false }}
          />
        )}
      />
    </Box>
  )
}

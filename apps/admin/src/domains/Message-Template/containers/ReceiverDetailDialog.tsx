import HBGrid, {
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import {
  GetPartiesQueryResultPagedCollectionQueryResult,
  useLazyGetAdminIdrPartiesMultiPartyQuery,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ColDef } from 'ag-grid-community'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import messageTemplatePageMessages from '../MessageTemplate.messages'
interface IReceiversDetailDialog {
  open: boolean
  onClose: () => void
  receivers: string
}
const classes: HBAgGridClasses = {
  wrapper: {
    height: 400,
  },
}
const ReceiversDetailDialog: FC<IReceiversDetailDialog> = ({ onClose, open, receivers }) => {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [usersData, setUsersData] = useState<GetPartiesQueryResultPagedCollectionQueryResult>()

  const columnDefs = useMemo(
    () => [
      {
        field: 'firstName',
        headerName: formatMessage(messageTemplatePageMessages.firstName),
        maxWidth: 100,
        minWidth: 100,
      },
      {
        field: 'lastName',
        headerName: formatMessage(messageTemplatePageMessages.lastName),
        maxWidth: 130,
        minWidth: 130,
      },
      {
        field: 'mobile',
        headerName: formatMessage(messageTemplatePageMessages.mobile),
        maxWidth: 120,
        minWidth: 120,
      },
      {
        field: 'email',
        headerName: formatMessage(messageTemplatePageMessages.email),
        minWidth: 250,
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const [getUsers, { isFetching }] = useLazyGetAdminIdrPartiesMultiPartyQuery()
  const handleOnGrigReady = useCallback(
    (params: any) => {
      getUsers({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        pageNumber: params?.PageNumber,
        pageSize: params?.pageSize,
        ordering: params?.ordering,
        filter: params.filter,
        //@ts-ignore//
        userIds: receivers,
      }).then((res: any) => setUsersData(res?.data?.data))
    },
    [receivers],
  )

  useEffect(() => {
    if (isFetching) {
      gridRef.current?.api?.showLoadingOverlay?.()
    } else {
      gridRef.current?.api?.hideOverlay?.()
    }
  }, [isFetching])

  return (
    <HBDialog
      sx={{ maxWidth: 900, mx: 'auto' }}
      title={formatMessage(messageTemplatePageMessages.otherReceivers)}
      open={open}
      onClose={onClose}
      onReject={onClose}
    >
      <Box sx={{ height: 500 }}>
        <HBGrid
          pagination
          sideBar
          actionUrl={''}
          columnDefs={columnDefs}
          classes={classes}
          paginationPageSize={25}
          onGridReady={handleOnGrigReady}
          totalRows={usersData?.totalItems}
          rowData={usersData?.items || []}
          enableRtl
          detailRowAutoHeight
          autoGroupColumnDef={autoGroupColumnDef}
          ref={gridRef}
          GridToolbar={(props) => (
            <HBDataGrigToolbar
              statusProps={{ show: false }}
              addProps={{ show: false }}
              deleteProps={{ show: false }}
              editProps={{ show: false }}
              refreshProps={{ show: false }}
              searchProps={{ show: false }}
              moreProps={{ show: false }}
              {...props}
            />
          )}
        />
      </Box>
    </HBDialog>
  )
}

export default ReceiversDetailDialog

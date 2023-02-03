import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { convertDateTimeToPersian } from '@hasty-bazar/admin-shared/utils'
import { HBAgGridClasses, HBButton, HBDialog } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../messages'
interface IShipmentHistory {
  id: string
  renderTitle: React.ReactElement
}
const classes: HBAgGridClasses = {
  wrapper: {
    height: 400,
  },
}
const ShipmentHistory = ({ id, renderTitle }: IShipmentHistory) => {
  const [openModalDialog, setOpenModalDialog] = useState(false)
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/ShippingOrder/Tracking?ShipmentOrderId=${id}`
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 110,
        minWidth: 110,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
        },
      },
      {
        field: 'eventDate',
        headerName: formatMessage(phrasesMessages.date),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => convertDateTimeToPersian(value),
      },
      {
        field: 'statusDescription',
        headerName: formatMessage(ShipmentManagementMessage.historyShipmentStatus),
        filter: 'agTextColumnFilter',
      },
    ],
    [],
  )
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])
  return (
    <>
      <HBButton variant="text" color="info" onClick={() => setOpenModalDialog(true)}>
        {renderTitle}
      </HBButton>
      <HBDialog
        open={openModalDialog}
        onClose={() => setOpenModalDialog(false)}
        onReject={() => setOpenModalDialog(false)}
        PaperProps={{
          sx: {
            height: 550,
            width: 800,
          },
        }}
      >
        <HBDataGridClient
          pagination
          enableRtl
          sideBar
          detailRowAutoHeight
          noToolbar
          paginationPageSize={25}
          rowSelection="multiple"
          classes={classes}
          actionUrl={actionUrl}
          columnDefs={columnDefs}
          autoGroupColumnDef={autoGroupColumnDef}
          ref={gridRef}
        />
      </HBDialog>
    </>
  )
}
export default ShipmentHistory

import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../messages'

const useShipmentGridWithProductColumns = () => {
  const { formatMessage } = useIntl()

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'productName',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.productName),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'systemDescription',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.systemDescription),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'HSIN',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.HSIN),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'vendorName',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.vendorName),
        filter: 'agTextColumnFilter',
        rowGroup: false,
        enableRowGroup: true,
      },
      {
        field: 'quantity',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.qty),
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'originalPrice',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.originalPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'discountPrice',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.discountAmount),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
      {
        field: 'finalPrice',
        minWidth: 150,
        headerName: formatMessage(ShipmentManagementMessage.finalPrice),
        filter: 'agNumberColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => value?.toLocaleString(),
      },
    ],
    [],
  )
  return { columnDefs }
}

export default useShipmentGridWithProductColumns

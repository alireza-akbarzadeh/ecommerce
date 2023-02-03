import { Status } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import GridAction from '../../components/GridAction'
import statusMessage from '../../status.message'
import { SelectRowModelOne } from '../../types'

export type PeriodFilterOneModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: SelectRowModelOne[]
  onDelete: (show: boolean, id: string) => void
  onEditClick: (id: string) => void
  attributeId: string
  editId?: string
}

const usePeriodFilterOne = ({
  gridRef,
  attributeId,
  onDelete,
  onEditClick,
  selectedRows,
  editId,
}: PeriodFilterOneModel) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Workflow/stateMachine`
  const { formatMessage } = useIntl()
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const onEdit = (id: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    onEditClick?.(String(id!))
  }

  const columnDefs = useMemo(
    () =>
      [
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
            innerRenderer: (params: ICellRendererParams) => (
              <GridAction {...params} {...{ onEdit, onDelete }} />
            ),
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'code',
          headerName: formatMessage(statusMessage.gridCode),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'title',
          headerName: formatMessage(statusMessage.gridTitle),
          filter: 'agTextColumnFilter',
          minWidth: 450,
        },
        {
          field: 'description',
          headerName: formatMessage(statusMessage.gridDescription),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'factor',
          headerName: formatMessage(statusMessage.gridFactor),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'targetEntityFieldName',
          headerName: formatMessage(statusMessage.gridTargetEntityFieldName),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'isActive',
          headerName: formatMessage(statusMessage.gridStatus),
          filter: 'agTextColumnFilter',
          filterParams: {
            readOnly: true,
          },
          minWidth: 120,
          cellRenderer: Status,
          cellRendererParams: {
            active: formatMessage(phrasesMessages.active),
            inActive: formatMessage(phrasesMessages.deActive),
          },
        },
      ] as ColDef[],
    [gridRef.current?.api?.getSelectedRows(), editId],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
  }
}

export default usePeriodFilterOne

import { Status } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBIcon } from '@hasty-bazar/core'
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
import { SelectRowModelThree } from '../../types'

export type PeriodFilterThreeModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: SelectRowModelThree[]
  onDelete: (show: boolean, id: string) => void
  onEditClick: (id: string) => void
  stateMachineId: string
  editId?: string
  fromStateId?: string
}

const usePeriodFilterThree = ({
  gridRef,
  stateMachineId,
  onDelete,
  onEditClick,
  selectedRows,
  editId,
  fromStateId,
}: PeriodFilterThreeModel) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Workflow/stateMachine/${stateMachineId}/transition?fromStateId=${fromStateId}`
  const { formatMessage } = useIntl()

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
          field: 'actionTitle',
          headerName: formatMessage(statusMessage.grid3ActionTitle),
          filter: 'agTextColumnFilter',
          minWidth: 250,
        },
        {
          field: 'description',
          headerName: formatMessage(statusMessage.grid3Description),
          filter: 'agTextColumnFilter',
          minWidth: 250,
        },
        {
          field: 'fromStateTitle',
          headerName: formatMessage(statusMessage.grid3FromStateId),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'toStateTitle',
          headerName: formatMessage(statusMessage.grid3ToStateId),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'isCommentRequired',
          headerName: formatMessage(statusMessage.grid3IsCommentRequired),
          filter: 'agTextColumnFilter',
          cellRenderer: (params: ICellRendererParams) => (
            <HBIcon type={params?.value ? 'check' : 'times'} />
          ),
        },
        {
          field: 'isSystemic',
          headerName: formatMessage(statusMessage.grid3IsSystemic),
          filter: 'agTextColumnFilter',
          hide: true,
          cellRenderer: (params: ICellRendererParams) => (
            <HBIcon type={params?.value ? 'check' : 'times'} />
          ),
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
  }
}

export default usePeriodFilterThree

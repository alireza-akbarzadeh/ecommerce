import { Status } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import GridAction from '../components/GridAction'
import TableSymbolCell from '../components/TableSymbolCell'
import { currenciesMessage } from '../Currencies.message'
import { PeriodFilterOneModel } from '../types/types'

const useCurrenciesAddEdit = (props: PeriodFilterOneModel) => {
  const { gridRef, onDelete, onEditClick, selectedRows, editId } = props
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
          maxWidth: 80,
          minWidth: 80,
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
          field: 'name',
          headerName: formatMessage(currenciesMessage.gridName),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'latinName',
          headerName: formatMessage(currenciesMessage.gridLatinName),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'code',
          headerName: formatMessage(currenciesMessage.gridCode),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'symbol',
          headerName: formatMessage(currenciesMessage.gridSymbol),
          filter: 'agTextColumnFilter',
          cellRenderer: TableSymbolCell,
        },
        {
          field: 'numberOfDecimal',
          headerName: formatMessage(currenciesMessage.numberOfDecimal),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'tradingCurrency',
          headerName: formatMessage(currenciesMessage.tradingCurrency),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'conversionFactor',
          headerName: formatMessage(currenciesMessage.conversionFactor),
          filter: 'agTextColumnFilter',
        },
        {
          field: 'isActive',
          headerName: formatMessage(currenciesMessage.gridStatus),
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
        {
          field: 'isDefault',
          headerName: formatMessage(currenciesMessage.isDefault),
          filter: 'agTextColumnFilter',
          filterParams: {
            readOnly: true,
          },
          minWidth: 120,
          cellRenderer: Status,
          cellRendererParams: {
            active: formatMessage(phrasesMessages.yes),
            inActive: formatMessage(phrasesMessages.no),
          },
        },
      ] as ColDef[],
    [gridRef.current?.api?.getSelectedRows(), editId],
  )

  return {
    columnDefs,
  }
}

export default useCurrenciesAddEdit

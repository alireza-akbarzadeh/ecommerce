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
import companiesMessage from '../../../../companies.message'

export type UserCompaniesModel = {
  gridRef: RefObject<AgGridReact>
}

const usePeriodFilterOne = ({ gridRef }: UserCompaniesModel) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/IDR/parties`
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

  const columnDefs = useMemo(
    () =>
      [
        {
          field: '_actions',
          headerName: '',
          maxWidth: 65,
          minWidth: 65,
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
            innerRenderer: (params: ICellRendererParams) => <></>,
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'firstName',
          headerName: formatMessage(companiesMessage.gridUserCompanyName),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'lastName',
          headerName: formatMessage(companiesMessage.gridUserCompanyFamily),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'nationalCode',
          headerName: formatMessage(companiesMessage.gridUserCompanyNationalCode),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'mobile',
          headerName: formatMessage(companiesMessage.gridUserCompanyMobile),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'isActive',
          headerName: formatMessage(companiesMessage.gridStatus),
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
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
  }
}

export default usePeriodFilterOne

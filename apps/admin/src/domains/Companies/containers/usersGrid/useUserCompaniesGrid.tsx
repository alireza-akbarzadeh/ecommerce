import { HBLink, Status } from '@hasty-bazar/admin-shared/components'
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
import companiesMessage from '../../companies.message'
import GridAction from '../../components/GridAction'
import { UsersSelectRowModel } from '../../types'

export type UserCompaniesModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: UsersSelectRowModel[]
  onDelete: (show: boolean, id: string) => void
  companyId: string
  editId?: string
}

const useUserCompaniesGrid = ({ gridRef, companyId, onDelete, editId }: UserCompaniesModel) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/IDR/Organization/${companyId}/party`
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
              <GridAction
                {...params}
                menuItems={[
                  {
                    label: formatMessage(phrasesMessages.public),
                    children: [
                      {
                        icon: 'trashAlt',
                        label: formatMessage(phrasesMessages.delete),
                        onClick: () => onDelete(true, params.data.id),
                      },
                    ],
                  },
                ]}
              />
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
          field: 'firstName',
          headerName: formatMessage(companiesMessage.gridUserCompanyName),
          minWidth: 250,
          filter: false,
        },
        {
          field: 'lastName',
          headerName: formatMessage(companiesMessage.gridUserCompanyFamily),
          filter: false,
          minWidth: 250,
        },
        {
          field: 'nationalCode',
          headerName: formatMessage(companiesMessage.gridUserCompanyNationalCode),
          filter: false,
          minWidth: 200,
        },
        {
          field: 'mobile',
          headerName: formatMessage(companiesMessage.gridUserCompanyMobile),
          filter: false,
          minWidth: 200,
          cellRenderer: (params: ICellRendererParams) => {
            return <HBLink href={`/users/detail/${params.data.partyId}`}>{params.value}</HBLink>
          },
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
    [gridRef.current?.api?.getSelectedRows(), editId],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
  }
}

export default useUserCompaniesGrid

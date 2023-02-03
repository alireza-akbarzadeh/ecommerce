import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminIdrOrganizationGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo } from '@hasty-bazar/admin-shared/services/idrApi.generated'
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

export type PeriodFilterOneModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: UsersSelectRowModel[]
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
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/IDR/Organization`
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
              <GridAction
                {...params}
                menuItems={[
                  {
                    label: formatMessage(phrasesMessages.public),
                    children: [
                      {
                        icon: 'pen',
                        label: formatMessage(phrasesMessages.edit),
                        onClick: () => onEdit?.(params.data.id),
                      },
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
          field: 'organizationTypeTitle',
          headerName: formatMessage(companiesMessage.gridCompanyType),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'title',
          headerName: formatMessage(companiesMessage.gridTitle),
          filter: 'agTextColumnFilter',
          minWidth: 450,
        },
        {
          field: 'logoPath',
          headerName: formatMessage(companiesMessage.gridLogo),
          filter: 'agTextColumnFilter',
          minWidth: 100,
          maxWidth: 100,
          cellRenderer: (params: ICellRendererParams) => {
            return params.value ? (
              <img
                src={process.env.NEXT_PUBLIC_CDN + '/' + params.value}
                alt="logo"
                style={{ width: 50, height: 50 }}
              />
            ) : null
          },
        },
        {
          field: 'iBan',
          headerName: formatMessage(companiesMessage.gridSheba),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'nationalCode',
          headerName: formatMessage(companiesMessage.gridCompanyNationalCode),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'economicCode',
          headerName: formatMessage(companiesMessage.gridCompanyEconomicCode),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'registerationNo',
          headerName: formatMessage(companiesMessage.gridCompanyRegisterNumber),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'phoneNo',
          headerName: formatMessage(companiesMessage.gridCompanyPhone),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'email',
          headerName: formatMessage(companiesMessage.gridCompanyEmail),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'province',
          headerName: formatMessage(companiesMessage.gridProvinceName),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'city',
          headerName: formatMessage(companiesMessage.gridCityName),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'address',
          headerName: formatMessage(companiesMessage.gridCompanyAddress),
          filter: 'agTextColumnFilter',
          minWidth: 200,
          tooltipField: 'address',
        },
        {
          field: 'stateTitle',
          headerName: formatMessage(companiesMessage.gridStatus),
          filter: 'agTextColumnFilter',
          minWidth: 200,
          cellRenderer: (params: ICellRendererParams) => {
            return (
              <HBWorkflowState
                factor="1"
                machineCode={StateMachineCode.Company}
                stateCode={params?.data?.stateCode}
                useGetStateInfo={useGetStateInfo}
              />
            )
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

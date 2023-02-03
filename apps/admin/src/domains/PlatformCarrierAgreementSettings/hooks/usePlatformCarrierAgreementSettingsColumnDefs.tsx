import { GridWorkflowActionMenuProps } from '@hasty-bazar/admin-shared/components'
import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  saleApi,
  useGetAdminSaleApiPlatformShippingContractGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminSaleApiPlatformShippingContractChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import PlatformCarrierAgrrementsMessages from '../PlatformCarrierAgreementSettings.message'

interface UseColumnDefsProps {
  gridRef: RefObject<HBDataGridClientRef>
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  refreshGridData: (isClearSearch?: boolean) => void
}

interface AgentModel {
  shippingAgentId: string
  shippingAgentTitle: string
}

interface ShippingProvidersModel {
  shippingProviderId: string
  shippingProviderTitle: string
}

const useColumnDefs = ({ gridRef, onDelete, onEdit, refreshGridData }: UseColumnDefsProps) => {
  const { formatMessage } = useIntl()
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const createMenuItems = (props: ICellRendererParams): GridWorkflowActionMenuProps[] => {
    return [
      {
        label: formatMessage(phrasesMessages.public),
        children: [
          {
            icon: 'pen',
            label: formatMessage(phrasesMessages.edit),
            onClick: () => onEdit(props.data.id),
          },
          {
            icon: 'trashAlt',
            label: formatMessage(phrasesMessages.delete),
            onClick: () => onDelete(props.data.id),
          },
        ],
      },
    ]
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
          innerRenderer: (props: ICellRendererParams) => (
            <GridWorkflowActionColumn
              entityId={props?.data?.id}
              factor="1"
              stateMachineCode={StateMachineCode.PlatformCarrierAgreementSettings.toString()}
              useChangeState={usePostAdminSaleApiPlatformShippingContractChangeStateMutation}
              useLazyGetStateList={
                saleApi.useLazyGetAdminSaleApiPlatformShippingContractGetTransitionByEntityIdAndStateMachineCodeFactorQuery
              }
              {...props}
              menuItems={createMenuItems(props)}
              onChangesState={() => refreshGridData(true)}
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
        field: 'contractStateCodeTitle',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.platformStateTitle),
        minWidth: 180,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) =>
          data?.contractStateCode && (
            <HBWorkflowState
              machineCode={StateMachineCode.PlatformCarrierAgreementSettings}
              {...{ useGetStateInfo }}
              stateCode={data?.contractStateCode}
              factor={'1'}
            />
          ),
      },
      {
        field: 'contractCode',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.code),
        filter: 'agTextColumnFilter',
        minWidth: 210,
      },
      {
        field: 'shippingProviders',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.shippingProvider),
        filter: 'agTextColumnFilter',
        minWidth: 120,
        cellRenderer: ({ data }: ICellRendererParams) =>
          data?.shippingProviders
            ?.map(
              (shippingProvider: ShippingProvidersModel) => shippingProvider.shippingProviderTitle,
            )
            .join(','),
      },
      {
        field: 'shippingAgents',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.agentCode),
        filter: 'agTextColumnFilter',
        minWidth: 160,
        cellRenderer: ({ data }: ICellRendererParams) =>
          data?.shippingAgents
            ?.map((shippingAgent: AgentModel) => shippingAgent.shippingAgentId)
            .join(','),
      },
      {
        field: 'shippingAgents',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.agentName),
        filter: 'agTextColumnFilter',
        minWidth: 160,
        cellRenderer: ({ data }: ICellRendererParams) =>
          data?.shippingAgents
            ?.map((shippingAgent: AgentModel) => shippingAgent.shippingAgentTitle)
            .join(','),
      },
      {
        field: 'startDate',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.startDate),
        minWidth: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(params.value).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '-'
        },
      },
      {
        field: 'endDate',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.endDate),
        minWidth: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(params.value).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '-'
        },
      },
      {
        field: 'costCoverageTypeTitle',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.platformCostCoverageTypeTitle),
        filter: 'agTextColumnFilter',
        minWidth: 160,
      },
      {
        field: 'costCoverageAmount',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.PlatformPaidAmount),
        filter: 'agTextColumnFilter',
        minWidth: 180,
        cellRenderer: (params: ICellRendererParams) => params?.value?.toLocaleString(),
      },
      {
        field: 'applyOnlyOnException',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.applyOnException),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        cellRenderer: ({ data }: ICellRendererParams) => {
          return (
            data?.applyOnlyOnException &&
            (data.applyOnlyOnException === true
              ? formatMessage(PlatformCarrierAgrrementsMessages.active)
              : formatMessage(PlatformCarrierAgrrementsMessages.inactive))
          )
        },
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )
  return {
    columnDefs,
  }
}

export default useColumnDefs

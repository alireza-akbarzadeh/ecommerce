import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { MenuItemProps } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useIntl } from 'react-intl'
import { IbanState, StatusFinancial } from '../../components'
import userPageMessages from '../../UserPage.messages'

function useUserFinancialGrid() {
  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const userGridColumns = () => {
    return [
      {
        field: 'partyRoleTypeTitle',
        headerName: formatMessage(userPageMessages.roles),
        filter: 'agNumberColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params.value : '-'
        },
      },
      {
        field: 'createdOn',
        headerName: formatMessage(userPageMessages.dateSubmit),
        filter: 'agDateColumnFilter',
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
        field: 'cardNumber',
        headerName: formatMessage(userPageMessages.cardNumber),
        filter: 'agNumberColumnFilter',
        minWidth: 160,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params.value : '-'
        },
      },
      {
        field: 'iban',
        headerName: formatMessage(userPageMessages.cardShaba),
        filter: 'agNumberColumnFilter',
        minWidth: 230,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params.value : '-'
        },
      },
      {
        field: 'stateName',
        headerName: formatMessage(userPageMessages.inquiryStage),
        filter: 'agTextColumnFilter',
        cellRenderer: IbanState,
      },
      {
        field: 'paymentTypeTitle',
        headerName: formatMessage(userPageMessages.portal),
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams) => {
          return params.value ? params.value : '-'
        },
      },
      {
        field: 'isActive',
        headerName: formatMessage(userPageMessages.status),
        filter: 'agTextColumnFilter',
        cellRenderer: StatusFinancial,
        cellRendererParams: {
          typeComponent: 'status',
        },
      },
      {
        field: 'isDefault',
        headerName: formatMessage(userPageMessages.defaultAccount),
        filter: 'agTextColumnFilter',
        cellRenderer: StatusFinancial,
        cellRendererParams: {
          typeComponent: 'defaultAccount',
        },
      },
    ]
  }

  const userGridToolbarMenu = ({
    disabledOnNoSelected,
    disabledActive,
    disabledUnActive,
    handleChangeStatus,
  }: {
    disabledOnNoSelected: boolean
    disabledActive: boolean
    disabledUnActive: boolean
    handleChangeStatus: (status: boolean) => void
  }): MenuItemProps[] => {
    return [
      {
        label: formatMessage(phrasesMessages.informationHistory),
        icon: 'historyAlt',
        disabled: disabledOnNoSelected,
      },
      {
        label: formatMessage(phrasesMessages.import),
        icon: 'import',
        disabled: disabledOnNoSelected,
      },
      {
        label: formatMessage(phrasesMessages.active),
        icon: 'toggleOn',
        disabled: disabledOnNoSelected || disabledActive,
        onClick: () => handleChangeStatus(true),
        show: !disabledActive,
      },
      {
        label: formatMessage(phrasesMessages.deActive),
        icon: 'toggleOff',
        disabled: disabledOnNoSelected || disabledUnActive,
        onClick: () => handleChangeStatus(false),
        show: !disabledUnActive,
      },
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'arrowDown',
        disabled: disabledOnNoSelected,
      },
      {
        label: formatMessage(phrasesMessages.report),
        icon: 'fileLandscapeAlt',
        disabled: disabledOnNoSelected,
        children: [
          { label: formatMessage(phrasesMessages.reportDaily), icon: 'fileAlt' },
          { label: formatMessage(phrasesMessages.reportMonthly), icon: 'fileAlt' },
        ],
      },
    ]
  }

  return {
    checkboxSelection,
    headerCheckboxSelection,
    userGridColumns,
    userGridToolbarMenu,
  }
}

export default useUserFinancialGrid

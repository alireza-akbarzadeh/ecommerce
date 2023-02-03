import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { ReasonWorkFlow } from '@hasty-bazar/admin-shared/core/enums/ReasonMangementType'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useGetAdminGeneralDataReasonsSettingGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminGeneralDataReasonsSettingDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { MenuItemProps } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject } from 'react'
import { useIntl } from 'react-intl'
import ReasonManageMentGridMessages from '../../ReasonManageMent.messages'
import Index from '../../components/ReasonCheck'

const useReasonGridColumns = (gridRef?: RefObject<HBDataGridClientRef>) => {
  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const ReasonGridColumns = () => {
    return [
      {
        field: 'title',
        headerName: formatMessage(phrasesMessages.title),
        filter: 'agTextColumnFilter',
        minWidth: 260,
      },
      {
        field: 'userTypeCodeTitle',
        headerName: formatMessage(ReasonManageMentGridMessages.use),
        filter: 'agTextColumnFilter',
        minWidth: 160,
      },
      {
        field: 'effectOnVendorGrade',
        headerName: formatMessage(ReasonManageMentGridMessages.ReduceSellerPoints),
        filter: 'agTextColumnFilter',
        minWidth: 180,
        cellRenderer: Index,
      },
      {
        field: 'isAttachmentMandatory',
        headerName: formatMessage(ReasonManageMentGridMessages.needToPasteTheImage),
        filter: 'agTextColumnFilter',
        minWidth: 180,
        cellRenderer: Index,
      },
      {
        field: 'isDescriptionMandatory',
        headerName: formatMessage(ReasonManageMentGridMessages.needToRecordDes),
        filter: 'agTextColumnFilter',
        minWidth: 190,
        cellRenderer: Index,
      },
      {
        field: 'effectOnCustomerGrade',
        headerName: formatMessage(ReasonManageMentGridMessages.effectOnCustomerGrade),
        filter: 'agTextColumnFilter',
        minWidth: 190,
        cellRenderer: Index,
      },
      {
        field: 'stateCode',
        headerName: formatMessage(ReasonManageMentGridMessages.status),
        filter: 'agTextColumnFilter',
        minWidth: 220,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            machineCode={StateMachineCode.ReasonManagement}
            useGetStateInfo={useGetStateInfo}
            stateCode={data?.stateCode}
            factor={String(ReasonWorkFlow.Factor)}
          />
        ),
      },
    ]
  }

  const [postAdminGeneralDataDownloadExcelFile] =
    usePostAdminGeneralDataReasonsSettingDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await postAdminGeneralDataDownloadExcelFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getReasponsSettingsExcelFileQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef?.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const reasonGridToolbarMenu = (): MenuItemProps[] => {
    return [
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'fileDownload',
        onClick: handleDownloadPage,
      },
      {
        label: formatMessage(phrasesMessages.downloadAll),
        icon: 'fileDownloadAlt',
        onClick: () => handleDownloadPage(true),
      },
    ]
  }

  return {
    checkboxSelection,
    headerCheckboxSelection,
    ReasonGridColumns,
    reasonGridToolbarMenu,
  }
}

export default useReasonGridColumns

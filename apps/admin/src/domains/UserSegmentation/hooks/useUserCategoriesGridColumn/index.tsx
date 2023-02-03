import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useGetAdminGeneralDataUserSegmentationGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminGeneralDataUserSegmentationDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils/convertDateToPersian'
import { persianNumber } from '@hasty-bazar/admin-shared/utils/convertToPersianNumber'
import { MenuItemProps } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject } from 'react'
import { useIntl } from 'react-intl'
import { UsageLimitCheck } from '../../components'
import { UserCategoriesWorkFLow } from '../../enums/UserCategoriesWorkFLow'
import UserCategoriesMessage from '../../messages/UserCategoriesMessage'

function useUserCategoriesGridColumn(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const userCategoriesGridColumnList = () => {
    return [
      {
        field: 'userTypeCodeTitle',
        headerName: formatMessage(UserCategoriesMessage.categoriesType),
        minWidth: 160,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'number',
        headerName: formatMessage(UserCategoriesMessage.categoriesCode),
        minWidth: 150,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: formatMessage(UserCategoriesMessage.categoriesDes),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? persianNumber(value?.toLocaleString()) : '-',
      },
      {
        field: 'listCreationTypeCodeTitle',
        headerName: formatMessage(UserCategoriesMessage.infoListType),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value : '-'),
      },
      {
        field: 'collectionTypeTitle',
        headerName: formatMessage(UserCategoriesMessage.dynamicQuery),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? persianNumber(value?.toLocaleString()) : '-',
      },
      {
        field: 'queryResultTypeCodeTitle',
        headerName: formatMessage(UserCategoriesMessage.infoListSaveType),
        filter: 'agTextColumnFilter',
        minWidth: 180,
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value : '-'),
      },
      {
        field: 'interval',
        headerName: formatMessage(UserCategoriesMessage.variable),
        filter: 'agNumberColumnFilter',
        minWidth: 140,
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value : '-'),
      },
      {
        field: 'intervalTypeCodeTitle',
        headerName: formatMessage(UserCategoriesMessage.gapTime),
        filter: 'agTextColumnFilter',
        minWidth: 140,
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value : '-'),
      },
      {
        field: 'hasOutputLimit',
        headerName: formatMessage(UserCategoriesMessage.usageLimitExit),
        filter: 'agTextColumnFilter',
        minWidth: 190,
        cellRenderer: UsageLimitCheck,
      },
      {
        field: 'outputLimit',
        headerName: formatMessage(UserCategoriesMessage.maxCount),
        filter: 'agNumberColumnFilter',
        minWidth: 160,
      },
      {
        field: 'plannedStartDateTime',
        headerName: formatMessage(UserCategoriesMessage.start),
        filter: 'agDateColumnFilter',
        minWidth: 160,
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '-',
      },
      {
        field: 'plannedEndDateTime',
        headerName: formatMessage(UserCategoriesMessage.end),
        filter: 'agDateColumnFilter',
        minWidth: 160,
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '-',
      },
      {
        field: 'dataSaveTypeCodeTitle',
        headerName: formatMessage(UserCategoriesMessage.saveInfoType),
        filter: 'agTextColumnFilter',
        minWidth: 180,
      },
      {
        field: 'lastQueryExecDateTime',
        headerName: formatMessage(UserCategoriesMessage.lastUpdate),
        filter: 'agDateColumnFilter',
        minWidth: 180,
        cellRenderer: ({ value }: ICellRendererParams) =>
          value ? convertDateToPersian(value) : '-',
      },
      {
        field: 'stateCode',
        headerName: formatMessage(UserCategoriesMessage.stage),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            machineCode={StateMachineCode.MarketingList}
            useGetStateInfo={useGetStateInfo}
            stateCode={data?.stateCode}
            factor={String(UserCategoriesWorkFLow.Factor)}
          />
        ),
      },
    ]
  }

  const [postAdminGeneralDataUserSegmentationDownloadExcelFile] =
    usePostAdminGeneralDataUserSegmentationDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await postAdminGeneralDataUserSegmentationDownloadExcelFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getUserSegmentationsExcelFileQueryFilter: {
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

  const userGridToolbarMenu = (): MenuItemProps[] => {
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
    userCategoriesGridColumnList,
    userGridToolbarMenu,
  }
}

export default useUserCategoriesGridColumn

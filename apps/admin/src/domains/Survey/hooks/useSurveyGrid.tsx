import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminGeneralDataSurveyGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import surveyMessages from '../survey.messages'

function useSurveyGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const surveyGridColumns = () => {
    return [
      {
        field: 'answerTypeTitle',
        headerName: formatMessage(surveyMessages.type),
        minWidth: 110,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: formatMessage(surveyMessages.title),
        minWidth: 150,
      },
      {
        field: 'answerDisplayTypeTitle',
        headerName: formatMessage(surveyMessages.displayType),
        minWidth: 200,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'iconCategoryTypeName',
        headerName: formatMessage(surveyMessages.iconCategoryType),
        minWidth: 200,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'usageTypeTitle',
        headerName: formatMessage(surveyMessages.howToUse),
        minWidth: 200,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'minCountSelectCharacter',
        headerName: formatMessage(surveyMessages.minNumberOfCharacters),
        minWidth: 200,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'maxCountSelectCharacter',
        headerName: formatMessage(surveyMessages.maxNumberOfCharacters),
        minWidth: 200,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'stateCode',
        headerName: formatMessage(surveyMessages.state),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            machineCode={StateMachineCode.Survey}
            useGetStateInfo={useGetStateInfo}
            stateCode={data?.stateCode}
            factor={'1'}
          />
        ),
      },
    ]
  }

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', operator: 'contains', value: String(value) },
          { field: 'answerTypeTitle', operator: 'contains', value: String(value) },
          { field: 'answerDisplayTypeTitle', operator: 'contains', value: String(value) },
          { field: 'iconCategoryTypeName', operator: 'contains', value: String(value) },
          { field: 'usageTypeTitle', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchSurvey',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchSurvey')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  return {
    gridLoading,
    checkboxSelection,
    headerCheckboxSelection,
    surveyGridColumns,
    handleChangedGridActions,
    refreshGridData,
  }
}

export default useSurveyGrid

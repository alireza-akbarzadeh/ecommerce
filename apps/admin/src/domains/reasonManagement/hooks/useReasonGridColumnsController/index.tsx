import { GridWorkflowActionColumn } from '@hasty-bazar/admin-shared/components'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { ReasonWorkFlow } from '@hasty-bazar/admin-shared/core/enums/ReasonMangementType'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useReasonGridColumns } from '@hasty-bazar-admin/domains/reasonManagement/hooks'
import {
  generalDataApi,
  usePostAdminGeneralDataReasonsSettingChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { UseReasonGridColumnsControllerType } from '../../types/UseReasonGridColumnsControllerType'

const useReasonGridColumnsController = ({
  handleEditVoucher,
  handleDeleteDialog,
  checkboxSelection,
  headerCheckboxSelection,
  gridRef,
  selectedRows,
  refreshGridData,
}: UseReasonGridColumnsControllerType) => {
  const { formatMessage } = useIntl()
  const { ReasonGridColumns } = useReasonGridColumns()

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor={String(ReasonWorkFlow.Factor)}
          stateMachineCode={String(StateMachineCode.ReasonManagement)}
          useChangeState={usePostAdminGeneralDataReasonsSettingChangeStateMutation}
          useLazyGetStateList={
            generalDataApi.useLazyGetAdminGeneralDataReasonsSettingGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          onChangesState={refreshGridData}
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => {
                    handleEditVoucher(props?.data?.id)
                  },
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: handleDeleteDialog,
                },
              ],
            },
          ]}
        />
      )
    },
    [selectedRows],
  )

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 120,
        minWidth: 120,
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
          innerRenderer: GridActions,
        },
      },
      ...ReasonGridColumns(),
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return { columnDefs }
}

export default useReasonGridColumnsController

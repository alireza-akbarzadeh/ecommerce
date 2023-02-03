import { GridWorkflowActionColumn } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  accountingApi,
  usePostAdminAccountingApiTransactionTypeChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { ICellRendererParams } from 'ag-grid-community'
import { FC, RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
interface IGridActionType extends ICellRendererParams {
  gridRef: RefObject<HBDataGridClientRef>
  onEdit(id: number): void
  onDelete(show: boolean, id: number): void
}

const GridAction: FC<IGridActionType> = ({ onDelete, onEdit, gridRef, ...props }) => {
  const { formatMessage } = useIntl()

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  return (
    <GridWorkflowActionColumn
      entityId={props?.data?.id}
      factor="1"
      stateMachineCode={StateMachineCode.TypeOfFinancialEvents.toString()}
      useChangeState={usePostAdminAccountingApiTransactionTypeChangeStateMutation}
      useLazyGetStateList={
        accountingApi.useLazyGetAdminAccountingApiTransactionTypeGetTransitionByEntityIdAndStateMachineCodeFactorQuery
      }
      {...props}
      menuItems={[
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
              onClick: () => onDelete(true, props.data.id),
            },
          ],
        },
      ]}
      onChangesState={refreshGridData}
    />
  )
}

export default GridAction

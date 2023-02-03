import { GridWorkflowActionColumn } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  saleApi,
  usePostAdminSaleShipmentBundleByShipmentOrderIdBundlesChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { ShipmentWorkFlow } from '../../enums'
import { IUseGridActions } from '../../types/IShipmentTypes'

const useGridActions = ({ selectedRows, navigateToDetails, refreshGridData }: IUseGridActions) => {
  const { formatMessage } = useIntl()
  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      const bodyWorkFlow = {
        shipmentOrderId: props?.data?.shipmentOrderId,
      }
      return (
        props?.data?.shipmentOrderId && (
          <GridWorkflowActionColumn
            entityId={props?.data?.id}
            factor={ShipmentWorkFlow.Shipment}
            stateMachineCode={String(StateMachineCode.Shipment)}
            useChangeState={
              usePostAdminSaleShipmentBundleByShipmentOrderIdBundlesChangeStateMutation
            }
            body={bodyWorkFlow}
            useLazyGetStateList={
              saleApi.useLazyGetAdminSaleShipmentBundleGetTransitionByEntityIdAndStateMachineCodeFactorQuery
            }
            menuItems={[
              {
                label: formatMessage(phrasesMessages.public),
                children: [
                  {
                    icon: 'pen',
                    label: formatMessage(phrasesMessages.details),
                    onClick: () => navigateToDetails(props.data.id),
                  },
                ],
              },
            ]}
            onChangesState={refreshGridData}
            {...props}
          />
        )
      )
    },
    [selectedRows],
  )

  return { GridActions }
}

export default useGridActions

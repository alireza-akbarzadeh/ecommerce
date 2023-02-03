import { GridWorkflowActionColumn } from '@hasty-bazar/admin-shared/components'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useLazyGetAdminGeneralDataMessageTemplatesGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminGeneralDataMessageTemplatesChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { ICellRendererParams } from 'ag-grid-community'
import { useIntl } from 'react-intl'

export interface TemplateGridActionColumnProps extends ICellRendererParams {
  handleEditMessageTemplate?: (id: string) => void
  setDeleteDialogState?: ({ show, id }: { show: boolean; id: number }) => void
  refetch: () => void
}

export default function MessageTemplateGridActions({
  handleEditMessageTemplate,
  setDeleteDialogState,
  refetch,
  ...props
}: TemplateGridActionColumnProps) {
  const { formatMessage } = useIntl()

  return (
    <GridWorkflowActionColumn
      entityId={props?.data?.id}
      factor="1"
      stateMachineCode={StateMachineCode.MessageTemplate.toString()}
      useChangeState={usePostAdminGeneralDataMessageTemplatesChangeStateMutation}
      useLazyGetStateList={useGetStateList}
      {...props}
      onChangesState={refetch}
      menuItems={[
        {
          label: formatMessage(phrasesMessages.public),
          children: [
            {
              icon: 'pen',
              label: formatMessage(phrasesMessages.edit),
              onClick: () => handleEditMessageTemplate?.(props?.data?.id),
            },
            {
              icon: 'trashAlt',
              label: formatMessage(phrasesMessages.delete),
              onClick: () => setDeleteDialogState?.({ show: true, id: props.data.id }),
            },
          ],
        },
      ]}
    />
  )
}

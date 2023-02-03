import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { ICellRendererParams } from 'ag-grid-community'
import { useIntl } from 'react-intl'

export interface UserGridActionColumnProps extends ICellRendererParams {
  handleEditUserCategories?: (id: string) => void
  setDeleteDialogState?: (val: boolean) => void
}

export default function ReportGridActionColumn({
  handleEditUserCategories,
  setDeleteDialogState,
  ...props
}: UserGridActionColumnProps) {
  const { formatMessage } = useIntl()
  return (
    <GridActionColumn
      menuItems={[
        {
          label: formatMessage(phrasesMessages.public),
          children: [
            {
              icon: 'trashAlt',
              label: formatMessage(phrasesMessages.delete),
              onClick: () => setDeleteDialogState?.(true),
            },
            {
              icon: 'pen',
              label: formatMessage(phrasesMessages.edit),
              onClick: () => handleEditUserCategories?.(props?.data?.id),
            },
          ],
        },
      ]}
      {...props}
    />
  )
}

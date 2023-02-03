import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { ICellRendererParams } from 'ag-grid-community'
import React from 'react'
import { useIntl } from 'react-intl'

export interface UserGridActionColumnProps extends ICellRendererParams {
  editUser?: (id: string) => void
  showDeleteModal?: ({ show, id }: { show: boolean; id: number }) => void
  setRecordChangeHistory?: ({ show, entityId }: { show: boolean; entityId: string }) => void
}

export default function DocumentGridActionColumn({
  editUser,
  showDeleteModal,
  setRecordChangeHistory,
  ...props
}: UserGridActionColumnProps) {
  const { formatMessage } = useIntl()

  return (
    <GridActionColumn
      {...props}
      menuItems={[
        {
          label: formatMessage(phrasesMessages.public),
          children: [
            {
              icon: 'pen',
              label: formatMessage(phrasesMessages.edit),
              onClick: () => editUser?.(props.data.id),
            },
            {
              icon: 'trashAlt',
              label: formatMessage(phrasesMessages.delete),
              onClick: () => showDeleteModal?.({ show: true, id: props.data.id }),
            },
            {
              icon: 'historyAlt',
              label: formatMessage(phrasesMessages.recordHistory),
              onClick: () => setRecordChangeHistory?.({ show: true, entityId: props.data.id }),
            },
          ],
        },
      ]}
    />
  )
}

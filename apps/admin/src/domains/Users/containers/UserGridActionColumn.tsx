import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { ICellRendererParams } from 'ag-grid-community'
import React from 'react'
import { useIntl } from 'react-intl'
import userPageMessages from '../UserPage.messages'

export interface UserGridActionColumnProps extends ICellRendererParams {
  editUser?: (id: string) => void
  navigateToDetails?: (id: string) => void
  showDeleteModal?: ({ show, id }: { show: boolean; id: string }) => void
  showHistoryModal?: ({ show, entityId }: { show: boolean; entityId: string }) => void
}

export default function UserGridActionColumn({
  editUser,
  navigateToDetails,
  showDeleteModal,
  showHistoryModal,
  ...props
}: UserGridActionColumnProps) {
  const { formatMessage } = useIntl()

  return (
    <GridActionColumn
      {...props}
      menuItems={[
        {
          label: formatMessage(userPageMessages.general),
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
              icon: 'paragraph',
              label: formatMessage(phrasesMessages.details),
              onClick: () => navigateToDetails?.(props.data.id),
            },
            {
              icon: 'history',
              label: formatMessage(phrasesMessages.recordHistory),
              onClick: () => showHistoryModal?.({ show: true, entityId: props.data.id }),
            },
          ],
        },
      ]}
    />
  )
}

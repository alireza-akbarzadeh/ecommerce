import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { ICellRendererParams } from 'ag-grid-community'
import { FC } from 'react'
import { useIntl } from 'react-intl'

interface IGridActionType extends ICellRendererParams {
  onEdit(id: number): void
  onDelete(show: boolean, id: string): void
}

const GridAction: FC<IGridActionType> = ({ onDelete, onEdit, ...props }) => {
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
    />
  )
}

export default GridAction

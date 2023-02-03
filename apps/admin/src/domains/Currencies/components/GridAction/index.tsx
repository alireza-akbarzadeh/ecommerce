import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { IGridActionType } from '../../types/types'

const GridAction: FC<IGridActionType> = (props) => {
  const { onDelete, onEdit, ...otherProps } = props
  const { formatMessage } = useIntl()
  return (
    <GridActionColumn
      {...otherProps}
      menuItems={[
        {
          label: formatMessage(phrasesMessages.public),
          children: [
            {
              icon: 'pen',
              label: formatMessage(phrasesMessages.edit),
              onClick: () => onEdit(otherProps.data.id),
            },
            {
              icon: 'trashAlt',
              label: formatMessage(phrasesMessages.delete),
              onClick: () => onDelete(true, otherProps.data.id),
            },
          ],
        },
      ]}
    />
  )
}

export default GridAction

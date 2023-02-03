import { HBButton, HBIcon } from '@hasty-bazar/core'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import queryBuilderMessages from '../HBQueryBuilder.messages'

interface AddGroupActionProps {
  handleOnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const AddGroupAction: FC<AddGroupActionProps> = ({ handleOnClick }) => {
  const { formatMessage } = useIntl()
  return (
    <HBButton
      onClick={handleOnClick}
      size="small"
      endIcon={<HBIcon type="plus" />}
      sx={{ minWidth: 50 }}
    >
      {formatMessage(queryBuilderMessages.group)}
    </HBButton>
  )
}

export default AddGroupAction

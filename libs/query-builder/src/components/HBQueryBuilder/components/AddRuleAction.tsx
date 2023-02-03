import { HBButton, HBIcon } from '@hasty-bazar/core'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import queryBuilderMessages from '../HBQueryBuilder.messages'

interface AddRuleActionProps {
  handleOnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const AddGroupAction: FC<AddRuleActionProps> = ({ handleOnClick }) => {
  const { formatMessage } = useIntl()
  return (
    <HBButton
      onClick={handleOnClick}
      size="small"
      endIcon={<HBIcon type="plus" />}
      sx={{ marginRight: 2, minWidth: 50 }}
    >
      {formatMessage(queryBuilderMessages.rule)}
    </HBButton>
  )
}

export default AddGroupAction

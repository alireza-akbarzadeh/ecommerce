import { HBIconButton } from '@hasty-bazar/core'
import { FC } from 'react'

interface RemoveActionProps {
  handleOnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const AddGroupAction: FC<RemoveActionProps> = ({ handleOnClick }) => {
  return <HBIconButton onClick={handleOnClick} icon="trash" sx={{ marginLeft: 2 }} />
}

export default AddGroupAction

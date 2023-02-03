import { Modal } from '@mui/material'
import ModalContent from './modalContent'

interface WorkflowHistoryProps {
  open: boolean
  onClose: () => void
  id: string
  type: string
}

function WorkflowHistory({ id, onClose, open, type }: WorkflowHistoryProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent id={id} onClose={onClose} type={type} />
    </Modal>
  )
}

export default WorkflowHistory

import { Modal } from '@mui/material'
import ModalContent from './modalContent'

interface RecordChangeHistoryProps {
  open: boolean
  onClose: () => void
  id: string
  type: string
}

function RecordChangeHistory({ id, onClose, open, type }: RecordChangeHistoryProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent id={id} onClose={onClose} type={type} />
    </Modal>
  )
}

export default RecordChangeHistory

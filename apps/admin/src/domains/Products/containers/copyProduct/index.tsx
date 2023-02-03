import { Modal } from '@mui/material'
import ModalContent from './modalContent'

interface CopyProductProps {
  open: boolean
  onClose: () => void
  id: string
}

function CopyProduct({ id, onClose, open }: CopyProductProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent id={id} onClose={onClose} />
    </Modal>
  )
}

export default CopyProduct

import AddProducts from './addProduct'
import CommunicationBetweenProducts from './communicationBetweenProduct'
import ContentSettings from './contentSettings'
import DuplicationSettings from './duplicationSettings'
import Ordering from './ordering'

export const enum StepsEnum {
  ProductDetails = 'product-details',
  ContentSettings = 'content-settings',
  Ordering = 'ordering',
  duplicationSettings = 'duplication-settings',
  communicationBetweenProductAndSend = 'communication-between-product-and-send',
}

interface ProductFormProps {
  step: StepsEnum
}

function ProductForm({ step }: ProductFormProps) {
  const Components: Record<StepsEnum, React.ReactNode> = {
    [StepsEnum.ProductDetails]: <AddProducts />,
    [StepsEnum.ContentSettings]: <ContentSettings />,
    [StepsEnum.Ordering]: <Ordering />,
    [StepsEnum.duplicationSettings]: <DuplicationSettings />,
    [StepsEnum.communicationBetweenProductAndSend]: <CommunicationBetweenProducts />,
  }
  return <>{Components[step]} </>
}

export default ProductForm

import AddProducts from './addProduct'
import CommunicationBetweenProducts from './communicationBetweenProduct'
import ContentSettings from './contentSettings'
import Ordering from './ordering'

export const enum StepsEnum {
  ProductDetails = 'product-details',
  ContentSettings = 'content-settings',
  Ordering = 'ordering',
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
    [StepsEnum.communicationBetweenProductAndSend]: <CommunicationBetweenProducts />,
  }
  return <>{Components[step]} </>
}

export default ProductForm

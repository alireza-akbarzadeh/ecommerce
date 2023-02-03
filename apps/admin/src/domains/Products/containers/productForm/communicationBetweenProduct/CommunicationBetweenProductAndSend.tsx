import { useRouter } from 'next/router'
import { memo } from 'react'
import ProductFormContainer from '../../productFormContainer'
import CommunicationBetweenProduct from './communicationBetweenProducts'
import OtherRelatedProductGroups from './otherRelatedProductGroups'
import ProductPackagingInformation from './productPackagingInformation'
import ShippingInformation from './shippingInformation'
import ShippingPayments from './shippingPayments'

function CommunicationBetweenProductAndSend() {
  const router = useRouter()

  return (
    <ProductFormContainer withDetails>
      <CommunicationBetweenProduct />
      <OtherRelatedProductGroups />
      <ShippingInformation />
      <ShippingPayments />
      <ProductPackagingInformation />
    </ProductFormContainer>
  )
}

export default memo(CommunicationBetweenProductAndSend)

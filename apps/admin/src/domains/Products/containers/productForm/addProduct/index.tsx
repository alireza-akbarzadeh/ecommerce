import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import { useRouter } from 'next/router'
import AddConfigurableProduct from './AddConfigurableProduct'
import AddSimpleProduct from './AddSimpleProduct'

function AddProducts() {
  const router = useRouter()
  const productType = getProductType(router.pathname)

  return productType === 'simple' ? <AddSimpleProduct /> : <AddConfigurableProduct />
}

export default AddProducts

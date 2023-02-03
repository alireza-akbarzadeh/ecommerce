import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import {
  useGetAdminCatalogConfigurableProductsByIdQuery,
  useGetAdminCatalogSimpleProductsByIdQuery,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ProductContext } from '../../contexts/productContext'
import CommunicationBetweenProductAndSend from './CommunicationBetweenProductAndSend'

function CommunicationBetweenProducts() {
  const router = useRouter()
  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType
  const args = {
    'client-name': 'admin',
    'client-version': '1.0.0',
    id: router.query.id as string,
  }
  const options = {
    skip: !router.query.id,
  }
  const productData =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdQuery(args, options)
      : useGetAdminCatalogConfigurableProductsByIdQuery(args, options)

  useEffect(() => {
    productData.refetch()
  }, [router.query.id])
  return (
    <ProductContext.Provider
      value={{
        productState: productData.data?.data?.productStatus || EnumFormHeaderStatus.draft,
        productDetails: productData.data?.data,
      }}
    >
      <CommunicationBetweenProductAndSend />
    </ProductContext.Provider>
  )
}

export default CommunicationBetweenProducts

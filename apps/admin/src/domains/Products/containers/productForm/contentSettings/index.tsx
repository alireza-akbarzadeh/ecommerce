import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import {
  useGetAdminCatalogConfigurableProductsByIdQuery,
  useGetAdminCatalogSimpleProductsByIdQuery,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import { GetProductQueryResultApiResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useRouter } from 'next/router'
import ProductFormContainer from '../../productFormContainer'
import ProductImagesAndVideos from './ProductImagesAndVideos'
import ProductIntroduction from './ProductIntroduction'
import ProductReview from './ProductReview'
import ProductSpecifications from './productSpecifications'

function ContentSettings() {
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

  const isEditableProduct =
    productData.data?.data?.productStatus === EnumFormHeaderStatus.draft && !productData.isLoading

  const disabled =
    defaultProductType === 'configurable'
      ? !isEditableProduct && productType !== 'simple'
      : !isEditableProduct
  const isChildProduct = !!(productData?.data?.data as GetProductQueryResultApiResult['data'])
    ?.parentProductId

  return (
    <ProductFormContainer withDetails>
      <ProductImagesAndVideos disabled={!isEditableProduct} />
      <ProductIntroduction disabled={disabled || isChildProduct} />
      <ProductReview disabled={disabled || isChildProduct} />
      <ProductSpecifications disabled={!isEditableProduct} />
    </ProductFormContainer>
  )
}

export default ContentSettings

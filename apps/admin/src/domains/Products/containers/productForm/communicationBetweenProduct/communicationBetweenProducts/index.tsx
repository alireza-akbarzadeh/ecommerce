import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { GetAllRelatedProductsQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import communicationMessages from '../communicationBetweenProduct.messages'
import RelatedProductsGrid, { ProductRelationTypeCodeEnum } from './RelatedProductsGrid'

function CommunicationBetweenProduct() {
  const [{ FamilyProducts, RelatedProducts, SimilarProducts }, setItemsCount] = useState<
    Record<string, number>
  >({
    FamilyProducts: 0,
    RelatedProducts: 0,
    SimilarProducts: 0,
  })
  const statusLabel = (FamilyProducts || 0) + (RelatedProducts || 0) + (SimilarProducts || 0)
  const { formatMessage } = useIntl()
  const onLoaded = (
    data: GetAllRelatedProductsQueryResult[],
    ProductRelationTypeCode: keyof typeof ProductRelationTypeCodeEnum,
  ) => {
    const counts = {
      [ProductRelationTypeCode]: data.length ? 1 : 0,
    }
    setItemsCount((prev) => ({ ...prev, ...counts }))
  }
  return (
    <ProductExplanation
      summaryProps={{
        icon: 'infoCircle',
        statusLabel: String(statusLabel),

        title: formatMessage(communicationMessages.communicationBetweenProduct),
      }}
    >
      <RelatedProductsGrid
        onLoaded={(data) => onLoaded(data, 'RelatedProducts')}
        title={formatMessage(communicationMessages.relatedProducts)}
        ProductRelationTypeCode={ProductRelationTypeCodeEnum.RelatedProducts}
      />
      <RelatedProductsGrid
        onLoaded={(data) => onLoaded(data, 'SimilarProducts')}
        title={formatMessage(communicationMessages.similarProducts)}
        ProductRelationTypeCode={ProductRelationTypeCodeEnum.SimilarProducts}
      />
      <RelatedProductsGrid
        onLoaded={(data) => onLoaded(data, 'FamilyProducts')}
        title={formatMessage(communicationMessages.familyProducts)}
        ProductRelationTypeCode={ProductRelationTypeCodeEnum.FamilyProducts}
      />
    </ProductExplanation>
  )
}

export default CommunicationBetweenProduct

import { ProductFacet } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBCardWidgetProps } from '@hasty-bazar/core'
import { useMemo } from 'react'

export const useSearchFilterResult = (productResultData: ProductFacet[], collectionId: string) => {
  const resultData = useMemo(
    () =>
      productResultData?.map?.((product): HBCardWidgetProps['data'] & { type: string } => ({
        rate: product?.productRate,
        rateCount: product?.totalRateCount,
        imageUrl: product?.defaultImage,
        id: product?.id ?? '',
        link: '',
        title: product?.name,
        oldPrice: product?.originalPrice,
        currencyName: product?.currency?.name,
        discountPercentage: product?.discount,
        price: product?.finalPrice,
        deliveryMethod: product?.deliveryMethod
          ? { name: product?.deliveryMethod?.deliveryTime }
          : undefined,
        quantity: product?.onHandQty ?? undefined,
        quantityHTML: product?.quantityHTML,
        campaigns: product?.campaign ?? undefined,
        type: 'SEARCH_AND_COLLECTION_RESULT',
        parentId: product?.parentId ?? '',
        storeName: product?.vendor?.storeName,
        vendorId: product?.vendor?.id,
      })),
    [productResultData, collectionId],
  )
  return { resultData }
}

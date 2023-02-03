import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { ProductRelationTypeEnums } from '@hasty-bazar-commerce/core/enums'
import CardWidgetCustom from '@hasty-bazar-commerce/domains/Landing/components/CardWidgetCustom'
import { useLazyGetWebCatalogProductsByProductIdPublishedRelatedProductQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { ContentData } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { CollectionData, HBCardWidgetList, HBDialog, HBLoading } from '@hasty-bazar/core'
import { Stack } from '@mui/material'
import { FC, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import ContainersMessages from './Containers.message'

interface IBuyFromNotificationModalProps {
  open: boolean
  onClose: () => void
  productId: string
}

const SimilarProductsModal: FC<IBuyFromNotificationModalProps> = (props) => {
  const { onClose, open, productId } = props
  const { formatMessage } = useIntl()

  const [getQuery, { isLoading, data }] =
    useLazyGetWebCatalogProductsByProductIdPublishedRelatedProductQuery()

  useEffect(() => {
    if (!!productId && open) {
      getQuery({
        ...ApiConstants,
        productRelationType: ProductRelationTypeEnums.similarProducts,
        productId,
      })
    }
  }, [open])

  const convertToContentData = useMemo(() => {
    let contents: ContentData[] = []
    if (!data?.data?.items) return
    contents = data?.data?.items?.map((item) => {
      return {
        currencyName: item.currencyName,
        deliveryMethod: { name: item.productDeliveryTypeTitle },
        discountPercentage: 0,
        id: item.id,
        imageUrl: item.defaultImage ?? '',
        name: item.name,
        oldPrice: `${item.oldPrice ?? ''}`,
        price: `${item.price ?? ''}`,
        rate: item.rating,
        rateCount: item.ratingCount,
        title: item.name,
      }
    })

    return contents
  }, [data])
  return (
    <HBDialog
      open={open}
      title={formatMessage({ ...ContainersMessages.similarProducts })}
      onReject={onClose}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <Stack direction="row" justifyContent="center" alignItems="center">
        {isLoading ? (
          <HBLoading />
        ) : (
          <HBCardWidgetList
            type="BUSINESS_SLIDER_DEFAULT"
            content={{ title: '', data: convertToContentData as CollectionData[] }}
            prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
            cardWidgetCustom={CardWidgetCustom}
          />
        )}
      </Stack>
    </HBDialog>
  )
}

export default SimilarProductsModal

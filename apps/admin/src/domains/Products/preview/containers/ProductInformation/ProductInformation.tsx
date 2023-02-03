import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { INTRODUCTION_FACTOR } from '@hasty-bazar-admin/domains/Products/containers/productForm/contentSettings/ProductIntroduction'
import { PREVIEW_FACTOR } from '@hasty-bazar-admin/domains/Products/containers/productForm/contentSettings/ProductReview'
import { useGetAdminCatalogProductsPreviewByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  EntityType,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { useScrollDirection } from '@hasty-bazar/core'
import { Box, Divider, Stack } from '@mui/material'
import { ScrollDirection } from 'libs/core/src/hooks/useScrollDirection'
import { useRouter } from 'next/router'
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import ProductionDetailMessages from '../../productDetail.messages'
import { ProductAttributesSection } from './Attributes'
import { Comments } from './Comments'
import { SectionWrapper, TopNavigation } from './components'
import { ProductInfo } from './ProductInfo'

export type sectionType = {
  label: string
  component: ReactNode
}

const ProductInformation: FC = () => {
  const { formatMessage } = useIntl()
  const { id } = useRouter().query as { id: string }
  const productData = useGetAdminCatalogProductsPreviewByIdQuery({
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    id,
  })

  const product = productData.data?.data || {}
  const activeUniqueProduct =
    productData.data?.data?.uniqueProducts?.find((item) => item.id === id) || {}
  const scrollDirection = useScrollDirection(0)
  const isFirstRun = useRef<boolean>(true)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [scrollTrigger, setScrollTrigger] = useState<boolean>(false)

  const previewData = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    entityId: id,
    entityTypeId: EntityTypeEnums.Product as unknown as EntityType,
    contentType: ContentTypeEnums.Html,
    factor: PREVIEW_FACTOR,
  })

  const introductionData = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    entityId: id,
    entityTypeId: EntityTypeEnums.Product as unknown as EntityType,
    contentType: ContentTypeEnums.Html,
    factor: INTRODUCTION_FACTOR,
  })

  const introduction = introductionData.data?.data?.items?.find(
    (item) => item.factor === INTRODUCTION_FACTOR,
  )
  const review = previewData.data?.data?.items?.find((item) => item.factor === PREVIEW_FACTOR)
  const productInfoSections = useMemo(() => {
    let sections: sectionType[] = [
      {
        label: formatMessage(ProductionDetailMessages.commentsSection),
        component: <Comments />,
      },
    ]

    if (activeUniqueProduct?.attributes && !!activeUniqueProduct.attributes.length)
      sections.unshift({
        label: formatMessage(ProductionDetailMessages.attributesSection),
        component: <ProductAttributesSection content={activeUniqueProduct.attributes} />,
      })
    if (review?.value)
      sections.unshift({
        label: formatMessage(ProductionDetailMessages.reviewSection),
        component: (
          <ProductInfo
            label={formatMessage(ProductionDetailMessages.reviewSection)}
            content={review.value}
          />
        ),
      })
    if (introduction?.value)
      sections.unshift({
        label: formatMessage(ProductionDetailMessages.intoductionSection),
        component: (
          <ProductInfo
            label={formatMessage(ProductionDetailMessages.intoductionSection)}
            content={introduction?.value}
          />
        ),
      })
    return sections
  }, [activeUniqueProduct, review, introduction])

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setScrollTrigger(true)
  }

  const scrollIntoView = () => {
    if (scrollTrigger && containerRef && containerRef.current) {
      const El = containerRef.current
      window.scrollTo({
        top: El.offsetTop - (scrollDirection === ScrollDirection.up ? 250 : 200),
        behavior: 'smooth',
      })
      setTimeout(() => {
        setScrollTrigger(false)
      }, 500)
    }
    return
  }

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    scrollIntoView()
  }, [activeTab])

  return (
    <Stack spacing={4}>
      <TopNavigation
        value={activeTab}
        handleChangeTab={handleChangeTab}
        sections={productInfoSections}
      />
      <Stack
        divider={
          <Divider
            variant="fullWidth"
            sx={({ spacing }) => ({
              borderColor: 'grey.100',
              borderWidth: spacing(1),
            })}
          />
        }
        spacing={6}
        px={{ xs: 6, md: 0 }}
      >
        {productInfoSections.map((item, index) => {
          return (
            <Box key={index} ref={activeTab === index ? containerRef : null}>
              <SectionWrapper scrollTrigger={scrollTrigger} setActiveTab={setActiveTab} id={index}>
                {item.component}
              </SectionWrapper>
            </Box>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default ProductInformation

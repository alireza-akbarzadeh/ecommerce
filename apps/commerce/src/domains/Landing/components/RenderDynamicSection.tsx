import SaveVendorButton from '@hasty-bazar-commerce/containers/SaveVendorButton'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCatalogProductDetailByHsinQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import {
  ContentData,
  SectionByContentQueryResult,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import {
  GetCollectionArgumentsModel,
  ProductFilter,
  usePostWebGeneralDataCollectionResultMutation,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import {
  CardType,
  HBBannerTwoRowsWidget,
  HBBrandWidget,
  HBBuyerCategoryWidget,
  HBCardWidgetList,
  HBFiveAdsWidget,
  HBHTMLWidget,
  HBImageSliderWidget,
  HBImageWidget,
  HBMostWidget,
  HBOfferCardMultiRowWidget,
  HBProductGroupWidget,
  HBSellerWidget,
  HBThreeAdsWidget,
  HBVideoWidget,
} from '@hasty-bazar/core'
import { Grid } from '@mui/material'
import produce from 'immer'
import { HBBrandWidgetProps } from 'libs/core/src/components/HBWidgets/HBBrandWidget'
import { HBBuyerCategoryWidgetProps } from 'libs/core/src/components/HBWidgets/HBBuyerCategoryWidget'
import { ICardWidgetListProps } from 'libs/core/src/components/HBWidgets/HBCardWidget/HBCardWidgetList'
import { HBFiveAdsWidgetProps } from 'libs/core/src/components/HBWidgets/HBFiveAdsWidget'
import { HBHTMLWidgetProps } from 'libs/core/src/components/HBWidgets/HBHTMLWidget'
import { HBImageSliderWidgetProps } from 'libs/core/src/components/HBWidgets/HBImageSliderWidget'
import { HBImageWidgetProps } from 'libs/core/src/components/HBWidgets/HBImageWidget'
import { HBMostWidgetProps } from 'libs/core/src/components/HBWidgets/HBMostWidget'
import { HBOfferCardMultiRowWidgetProps } from 'libs/core/src/components/HBWidgets/HBOfferCardMultiRowWidget'
import {
  HBProductGroupWidgetProps,
  ProductGroupType,
} from 'libs/core/src/components/HBWidgets/HBProductGroupWidget'
import { HBSellerListWidgetProps } from 'libs/core/src/components/HBWidgets/HBSellerWidget'
import { ThreeIdsProps } from 'libs/core/src/components/HBWidgets/HBThreeAdsWidget'
import { HBVideoWidgetProps } from 'libs/core/src/components/HBWidgets/HBVideoWidget'
import { useRouter } from 'next/router'
import React, { FC, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import landingMessages from '../landing.messages'
import { LoadingPage } from '../loadingPage'
import CardWidgetCustom from './CardWidgetCustom'

interface RenderDynamicSectionProps {
  sections?: SectionByContentQueryResult[] | null
}

const renderSection = (section: SectionByContentQueryResult) => {
  const content = section.content!
  const widget = {
    [`ImageSlider.${section.componentType}`]: (
      <HBImageSliderWidget
        data={section?.content?.data! as HBImageSliderWidgetProps['data']}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        metaData={section?.content?.metaData}
      />
    ),
    'ImageSlider.ADS_SLIDER_FIVE': (
      <HBFiveAdsWidget
        {...(content as HBFiveAdsWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
      />
    ),
    'ImageSlider.ADS_SLIDER_THREE': (
      <HBThreeAdsWidget
        {...(content as ThreeIdsProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
      />
    ),
    'ImageSlider.IMAGE_TWO_ROWS': (
      <HBBannerTwoRowsWidget
        data={section!.content!.data! as HBImageWidgetProps[]}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
      />
    ),
    [`BusinessSlider.${section.componentType}`]: (
      <HBCardWidgetList
        type={section.componentType! as CardType}
        content={content as ICardWidgetListProps['content']}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        cardWidgetCustom={CardWidgetCustom}
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_MOST': (
      <HBMostWidget
        {...(content as HBMostWidgetProps)}
        columnIndex={section.columnIndex!}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_OFFER': (
      <HBOfferCardMultiRowWidget
        {...(content as HBOfferCardMultiRowWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_BRANDS': (
      <HBBrandWidget
        {...(content as HBBrandWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        pageDisplayType={section.pageDisplayType!}
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_BUYERCATEGORY': (
      <HBBuyerCategoryWidget
        {...(content as HBBuyerCategoryWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_SIMPLE': (
      <HBProductGroupWidget
        {...(content as HBProductGroupWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        type={section.componentType! as ProductGroupType}
        pageDisplayType={section.pageDisplayType!}
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_CATEGORY': (
      <HBProductGroupWidget
        {...(content as HBProductGroupWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        type={section.componentType! as ProductGroupType}
        pageDisplayType={section.pageDisplayType!}
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_SELLER': (
      <HBSellerWidget
        {...(content as HBSellerListWidgetProps)}
        saveVendor={SaveVendorButton}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        folowerTitle={<FormattedMessage {...landingMessages.follower} />}
      />
    ),
    [`Image.${section.componentType}`]: (
      <HBImageWidget
        {...(content as HBImageWidgetProps)}
        imageUrl={process.env.NEXT_PUBLIC_CDN! + content?.imageUrl}
        type={section?.componentType as string}
        closable={section.closable}
      />
    ),
    [`Html.${section.componentType}`]: <HBHTMLWidget {...(content as HBHTMLWidgetProps)} />,
    [`Video.${section.componentType}`]: (
      <HBVideoWidget
        {...(content as HBVideoWidgetProps)}
        prefixVideoUrl={process.env.NEXT_PUBLIC_CDN!}
        columnIndex={section.columnIndex!}
      />
    ),
  }

  return widget[`${section.widgetTypeText}.${section.componentType}`]
}

const RenderParentSection = (
  section: SectionByContentQueryResult & {
    parameters: any
  },
) => {
  const { asPath, query } = useRouter()
  const isBusinessSlider = section.widgetTypeText === 'BusinessSlider'
  const [getBusinessData, { data: sectionsData, isLoading = true }] =
    usePostWebGeneralDataCollectionResultMutation()

  const fullData = produce(section as SectionByContentQueryResult, (draft) => {
    const metaData = draft.content?.metaData
    if (isBusinessSlider && metaData) {
      const queryId = JSON.parse(draft.content?.metaData!).queryId
      if (queryId !== undefined && queryId !== 1) {
        draft!.content!.data = sectionsData?.data?.find(
          (sec: GetCollectionArgumentsModel) => sec.id === queryId.toString(),
        )?.data as ContentData[]
        return draft
      }
      return draft
    }
    return draft
  })
  const queryId = section?.content?.metaData
    ? JSON.parse(section?.content?.metaData!).queryId
    : undefined

  if (isBusinessSlider && (!sectionsData || asPath.startsWith('/collection')) && !isLoading) {
    getBusinessData({
      ...ApiConstants,
      body: [
        {
          id: queryId,
          parameters: section.parameters,
        },
      ] as GetCollectionArgumentsModel[],
    })
  }

  if (isBusinessSlider && !sectionsData && !asPath.startsWith('/collection')) {
    return (
      <Grid item xs={section.columnIndex} mb={5} key={section.id + 'skeleton'}>
        <LoadingPage type={section.componentType! as unknown as CardType} />
      </Grid>
    )
  }
  if ((isBusinessSlider && !fullData?.content?.data?.length) || !section?.content) return null
  return (
    <>
      {!!section.columnDistance && (
        <Grid item xs={section.columnDistance} key={section.id + 'columnDistance'} />
      )}
      <Grid
        item
        xs={
          section.componentType === 'BUSINESS_SLIDER_MOST' && section.columnIndex! < 40
            ? 40
            : section.columnIndex
        }
        md={section.columnIndex}
        mb={5}
        key={section.id! + section?.name! + 'section'}
      >
        {renderSection(fullData)}
      </Grid>
    </>
  )
}

const RenderDynamicSection: FC<RenderDynamicSectionProps> = (props) => {
  const { asPath, query } = useRouter()
  const { data: productDetail } = useGetWebCatalogProductDetailByHsinQuery(
    {
      ...ApiConstants,
      hsin: query?.hsin?.[0] || '',
    },
    { skip: !asPath.startsWith('/product') },
  )

  let parameters = useMemo(() => {
    let params = {}

    if (asPath.startsWith('/collection') || asPath.startsWith('/vendor')) {
      let filter: ProductFilter = Object.entries(query).reduce(
        (prev, [key, value]: [keyof ProductFilter, any]) => {
          if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
            prev = { ...prev, [key]: JSON.parse(value) }
          } else prev = { ...prev, [key]: value }
          return prev
        },
        {},
      )

      let filterParameters: Partial<{
        categories: string
        brands: string
        vendors: string
      }> = {
        categories: [
          ...(filter?.categories ?? []),
          ...(filter.baseFilter?.categories ?? []),
        ].toString(),
        brands: [...(filter?.brands ?? []), ...(filter.baseFilter?.brands ?? [])].toString(),
        vendors: [...(filter?.vendors ?? []), ...(filter.baseFilter?.vendors ?? [])].toString(),
      }

      Object.keys(filterParameters).forEach((k: keyof typeof filterParameters) => {
        if (filterParameters?.[k]?.length === 0) filterParameters[k] = '-1'
      })

      if (Object.values(filterParameters).some((value) => value !== '-1')) {
        Object.keys(filterParameters).forEach((k: keyof typeof filterParameters) => {
          if (filterParameters[k] === '-1') delete filterParameters[k]
        })
      }

      if (asPath.startsWith('/vendor')) {
        delete filterParameters?.categories
        delete filterParameters?.brands
      }

      params = { ...filterParameters }
    } else if (asPath.startsWith('/product/')) {
      const activeProduct = productDetail?.data?.uniqueProducts?.find(
        (p) => p.id === query?.hsin?.[0],
      )

      if (query?.hsin) {
        params = { products: query?.hsin?.[0] }
        if (activeProduct?.category?.id)
          params = { ...params, categories: activeProduct?.category?.id }
        if (productDetail?.data?.vendor?.id)
          params = { ...params, vendors: productDetail?.data?.vendor?.id }
        if (activeProduct?.brandId)
          params = { ...params, brands: activeProduct?.brandId.toString() }
      }
    }
    return params
  }, [asPath, query, productDetail?.data])

  return (
    <Grid container columns={40}>
      {props?.sections?.map((section) => (
        <React.Fragment key={section.id}>
          <RenderParentSection parameters={parameters} {...section} />
        </React.Fragment>
      ))}
    </Grid>
  )
}

export default RenderDynamicSection

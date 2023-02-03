import {
  ContentData,
  SectionByContentQueryResult,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetCollectionArgumentsModel,
  usePostAdminGeneralDataCollectionResultMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
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
import { FC, useEffect, useMemo } from 'react'

interface RenderDynamicSectionProps {
  sections?: SectionByContentQueryResult[] | null
}

const renderSection = (section: SectionByContentQueryResult) => {
  const content = section.content!
  const widget = {
    [`ImageSlider.${section.componentType}`]: (
      <HBImageSliderWidget
        data={section?.content?.data! as HBImageSliderWidgetProps['data']}
        metaData={section?.content?.metaData}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
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
      <HBBannerTwoRowsWidget data={section?.content?.data! as HBImageWidgetProps[]} />
    ),
    [`BusinessSlider.${section.componentType}`]: (
      <HBCardWidgetList
        type={section?.componentType! as CardType}
        content={content as ICardWidgetListProps['content']}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        noAction
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_MOST': (
      <HBMostWidget
        {...(content as HBMostWidgetProps)}
        columnIndex={section?.columnIndex!}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        noAction
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_OFFER': (
      <HBOfferCardMultiRowWidget {...(content as HBOfferCardMultiRowWidgetProps)} noAction />
    ),
    'BusinessSlider.BUSINESS_SLIDER_BRANDS': (
      <HBBrandWidget
        {...(content as HBBrandWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        noAction
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_BUYERCATEGORY': (
      <HBBuyerCategoryWidget {...(content as HBBuyerCategoryWidgetProps)} noAction />
    ),
    'BusinessSlider.BUSINESS_SLIDER_SIMPLE': (
      <HBProductGroupWidget
        {...(content as HBProductGroupWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        type={section?.componentType! as ProductGroupType}
        noAction
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_CATEGORY': (
      <HBProductGroupWidget
        {...(content as HBProductGroupWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        type={section?.componentType! as ProductGroupType}
        noAction
      />
    ),
    'BusinessSlider.BUSINESS_SLIDER_SELLER': (
      <HBSellerWidget
        {...(content as HBSellerListWidgetProps)}
        prefixImageUrl={process.env.NEXT_PUBLIC_CDN!}
        noAction
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
      <HBVideoWidget {...(content as HBVideoWidgetProps)} columnIndex={section.columnIndex!} />
    ),
  }

  return widget[`${section.widgetTypeText}.${section.componentType}`]
}

const RenderParentSection = (
  section: SectionByContentQueryResult & {
    isLoading: boolean
  },
) => {
  const isBusinessSlider = section.widgetTypeText === 'BusinessSlider'

  if ((isBusinessSlider && !section?.content?.data?.length) || !section?.content) return null

  return (
    <>
      {!!section.columnDistance && <Grid item xs={section.columnDistance} />}
      <Grid
        item
        xs={
          section.componentType === 'BUSINESS_SLIDER_MOST' && section.columnIndex! < 40
            ? 40
            : section.columnIndex
        }
        md={section.columnIndex}
        mb={5}
        key={section?.id! + section?.name! + 'section'}
      >
        {renderSection(section)}
      </Grid>
    </>
  )
}

const RenderDynamicSection: FC<RenderDynamicSectionProps> = (props) => {
  const [getBusinessData, { data: sectionsData, isLoading }] =
    usePostAdminGeneralDataCollectionResultMutation()

  const sectionsIds = useMemo(
    () =>
      props?.sections
        ?.filter(
          (section: SectionByContentQueryResult) => section.widgetTypeText === 'BusinessSlider',
        )
        .map((m) => (m.content?.metaData ? JSON.parse(m.content?.metaData!).queryId : undefined))
        .filter((_) => _ !== undefined),
    [props?.sections],
  )

  const fullData = produce(props.sections as SectionByContentQueryResult[], (draft) =>
    draft?.forEach((section) => {
      const metaData = section.content?.metaData
      if (section.widgetTypeText === 'BusinessSlider' && metaData) {
        const queryId = JSON.parse(section.content?.metaData!).queryId
        if (queryId !== undefined && queryId !== 1) {
          section!.content!.data = sectionsData?.data?.find(
            (sec: GetCollectionArgumentsModel) => sec.id === queryId.toString(),
          )?.data as ContentData[]
          return section
        }
        return section
      }
      return section
    }),
  )

  useEffect(() => {
    let parameters = {}
    getBusinessData({
      'client-name': 'get-sections',
      'client-version': '1.0.0',
      body: sectionsIds!
        .filter((val) => +val > 500)
        .map((sectionId) => ({
          id: sectionId,
          parameters,
        })) as GetCollectionArgumentsModel[],
    })
  }, [sectionsIds])

  return (
    <Grid container columns={40}>
      {fullData?.map((section) => (
        <RenderParentSection isLoading={isLoading} {...section} key={section.id} />
      ))}
    </Grid>
  )
}

export default RenderDynamicSection

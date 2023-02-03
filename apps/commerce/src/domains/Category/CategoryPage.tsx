import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  ContentData,
  SectionByContentQueryResult,
  useGetWebCmsPagesPlatformTypeByPlatformTypeNameAndNameQuery,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import {
  CollectionDto,
  usePostWebGeneralDataCollectionResultMutation,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { Box, styled } from '@mui/material'
import produce from 'immer'
import { useEffect, useMemo } from 'react'
import RenderDynamicSection from '../Landing/components/RenderDynamicSection'

const ContainerStyle = styled(Box)(({ theme }) => ({
  maxWidth: 1128,
}))

const CategoryPage = () => {
  // const centerSections = props.data?.pageParts?.[0].sections
  const { data } = useGetWebCmsPagesPlatformTypeByPlatformTypeNameAndNameQuery({
    ...ApiConstants,
    name: 'category',
    platformType: 1021001,
  })

  const centerParts = data?.data?.pageParts?.find((item) => item.id === '8')
  const sectionsIds = useMemo(
    () =>
      centerParts?.sections
        ?.filter(
          (section: SectionByContentQueryResult) => section.widgetTypeText === 'BusinessSlider',
        )
        .map((m) => JSON.parse(m.content?.metaData!).queryId as string)
        .filter((_) => _ !== undefined),
    [centerParts],
  )

  // const { data: sectionsData, refetch } = useGetWebGeneralDataCollectionResultByCollectionIdsQuery(
  const [getBussinessData, { data: sectionsData }] = usePostWebGeneralDataCollectionResultMutation()

  const sections = data?.data?.pageParts?.[0]?.sections
  const fullData = produce(sections as SectionByContentQueryResult[], (draft) =>
    draft?.forEach((section) => {
      const metaData = section.content?.metaData
      if (section.widgetTypeText === 'BusinessSlider' && metaData) {
        const queryId = JSON.parse(section.content?.metaData!).queryId
        if (queryId !== undefined && queryId !== 1) {
          section!.content!.data! = sectionsData?.data?.find(
            (sec: CollectionDto) => sec.id === queryId.toString(),
          )?.data as ContentData[]
          return section
        }
        return section
      }
      return section
    }),
  )

  useEffect(() => {
    if (sectionsIds)
      getBussinessData({
        ...ApiConstants,
        body: sectionsIds
          .filter((val) => +val > 500)
          .map((sectionId) => ({ id: sectionId, parameters: {} })),
      })
  }, [sectionsIds])

  return (
    <ContainerStyle>
      <RenderDynamicSection sections={fullData} />
      {/* <RenderDynamicSection sections={centerSections} /> */}
    </ContainerStyle>
  )
}

export default CategoryPage

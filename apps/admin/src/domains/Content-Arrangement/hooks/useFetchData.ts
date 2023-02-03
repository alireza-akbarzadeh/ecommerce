import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useGetAdminCmsPagesGetTemplatePagesQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'

const useFetchData = () => {
  const { query: { pagePartId, sectionId, pageId, action } = {}, push } = useRouter()
  const [showPage, setShowPage] = useState<boolean>(false)
  const [showPagePart, setShowPagePart] = useState<boolean>(false)
  const [showSection, setShowSection] = useState<boolean>(false)

  const [expandedPage, setExpandedPage] = useState<boolean>(false)
  const [expandedPagePart, setExpandedPagePart] = useState<boolean>(false)
  const [expandedSection, setExpandedSection] = useState<boolean>(false)
  const { data: { data: { items: platFormTypes = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '1',
      businessTypeCode: 1021,
      pageSize: 1000,
    })
  const { data: { data: { items: templatePages = [] } = {} } = {} } =
    useGetAdminCmsPagesGetTemplatePagesQuery({
      'client-name': 'cms',
      'client-version': '1',
      pageNumber: 1,
      pageSize: 1000,
    })

  useEffect(() => {
    if (action === 'create') {
      if (pageId && pagePartId) {
        setShowPage(true)
        setShowPagePart(true)
        setShowSection(true)
        setExpandedPage(false)
        setExpandedPagePart(false)
        setExpandedSection(true)
      } else if (pageId) {
        setShowPage(true)
        setShowPagePart(true)
        setShowSection(false)
        setExpandedPage(false)
        setExpandedPagePart(true)
        setExpandedSection(false)
      } else {
        setShowPage(true)
        setShowPagePart(false)
        setShowSection(false)
        setExpandedPage(true)
        setExpandedPagePart(false)
        setExpandedSection(false)
      }
    } else if (action === 'edit') {
      if (pageId && pagePartId && sectionId) {
        setShowPage(true)
        setShowPagePart(true)
        setShowSection(true)
        setExpandedPage(false)
        setExpandedPagePart(false)
        setExpandedSection(true)
      } else if (pageId && pagePartId) {
        setShowPage(true)
        setShowPagePart(true)
        setShowSection(false)
        setExpandedPage(false)
        setExpandedPagePart(true)
        setExpandedSection(false)
      } else if (pageId) {
        setShowPage(true)
        setShowPagePart(false)
        setShowSection(false)
        setExpandedPage(true)
        setExpandedPagePart(false)
        setExpandedSection(false)
      }
    }
  }, [pagePartId, sectionId, pageId, action])

  return {
    platFormTypes,
    showPage,
    showPagePart,
    showSection,
    expandedPage,
    expandedPagePart,
    expandedSection,
    templatePages,
  }
}
export default useFetchData

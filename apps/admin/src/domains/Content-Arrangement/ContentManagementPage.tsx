import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import { HBViewContainerWithTree } from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree'
import TreeViewItem from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree/components/TreeViewItem/TreeViewItem'
import { BusinessTypeEnums, ContentTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import {
  CreatePageModel,
  CreatePagePartModel,
  CreateSectionModel,
  useGetAdminCmsWidgetsQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBIcon, HBIconButton, RenderTree } from '@hasty-bazar/core'
import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { useGetAdminCmsPagesQuery } from './cmsApi.generated.enhanced'
import HBWidget from './containers/HBCreatorWidget/HBWidget'
import PageInformationForm from './containers/HBPageInformation/PageInformationForm'
import HBPagePartForm from './containers/HBPagePart/PagePartForm'
import { SectionContainerDetailsForm } from './containers/HBSectionContainerDetails'
import PageTitleBar from './containers/PageTitleBar'
import ContentManagementPageMessages from './ContentManagementPage.messages'
import useFetchData from './hooks/useFetchData'
import { treeDataToFlat } from './util'

const breadcrumbs = [
  { url: '/', title: <FormattedMessage id={sidebarMessages.dashboard.defaultMessage} /> },
  { url: '#', title: <FormattedMessage id={sidebarMessages.contentManagement.defaultMessage} /> },
]

export type ShowTostType = {
  open: boolean
  message: string
  type?: 'error' | 'success'
}

const ContentManagementPage = () => {
  const { formatMessage } = useIntl()
  const { push, query: { sectionId, pageId, action } = {} } = useRouter()
  const [searched, setSearched] = useState('')
  const [expandedLevel, setExpandedLevel] = useState<number[]>([])
  const { showPage, showPagePart, showSection, expandedPage, expandedPagePart } = useFetchData()
  const [expandedPagePreview, setExpandedPagePreview] = useState<boolean>(expandedPage)
  const [expandedPagePartPreview, setExpandedPagePartPreview] = useState<boolean>(expandedPagePart)
  const [expandedAdditionalInformation, setExpandedAdditionalInformation] = useState<boolean>(
    action === 'edit',
  )

  useEffect(() => {
    setExpandedPagePreview(expandedPage)
  }, [expandedPage])

  useEffect(() => {
    setExpandedPagePartPreview(expandedPagePart)
  }, [expandedPagePart])

  const formProviderProps = useForm<CreateSectionModel>({
    mode: 'all',
  })

  const pageFormProviderProps = useForm<CreatePageModel>({
    mode: 'all',
  })

  const pagePartFormProviderProps = useForm<CreatePagePartModel>({
    mode: 'all',
  })

  const { data: { data: { items: widgetsEnum = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnums.ContentType,
    })

  const { data: { data: { items = [] } = {} } = {} } = useGetAdminCmsWidgetsQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })
  const widgetId = formProviderProps.watch('widgetId')
  //@ts-ignore
  const { widgetTypeCode } = items?.find((item) => item.id === widgetId?.value) || {}

  const { reset } = formProviderProps

  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const treeData = useGetAdminCmsPagesQuery({
    'client-name': 'cms',
    'client-version': '0',
    pageSize: 1000,
  })

  let treeFlatData = useMemo(
    () =>
      treeDataToFlat(treeData.data?.data?.items || [], {
        firstLevelPrefix: 'pagePart-',
        secondLevelPrefix: 'section-',
      }),
    [treeData.data?.data?.items],
  )

  const onNodeSelect = (nodeId: string, type: string) => {
    setSelectedNodeId(nodeId)
    if (nodeId.includes('section')) {
      const pagePartId = treeFlatData.find((item) => item.id === nodeId)?.pid
      const pageId = treeFlatData.find((item) => item.id === pagePartId)?.pid
      const sectionId = nodeId.split('-')[1]
      if (sectionId && nodeId.includes('section')) {
        push(
          {
            pathname: `/content-management/${type === 'edit' ? 'edit' : 'create'}`,
            query: {
              sectionId,
              pageId,
              pagePartId: pagePartId?.split('-')[1],
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
      }
    } else if (nodeId.includes('pagePart')) {
      const pageId = treeFlatData.find((item) => item.id === nodeId)?.pid
      push(
        {
          pathname: `/content-management/${type === 'edit' ? 'edit' : 'create'}`,
          query: {
            pageId,
            pagePartId: nodeId?.split('-')[1],
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    } else {
      push(
        {
          pathname: `/content-management/${type === 'edit' ? 'edit' : 'create'}`,
          query: {
            pageId: nodeId,
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    }
  }

  useEffect(() => {
    if (sectionId) {
      setSelectedNodeId('section-' + sectionId)
    }
    if (action === 'create' || action === 'show') {
      pageFormProviderProps.reset({})
      formProviderProps.reset({})
      setSelectedNodeId('')
    }
  }, [sectionId, pageId, action])

  const recursiveAddParent = (pid: string, allTreeData: RenderTree[]) => {
    const parentItem = allTreeData.find((x) => x?.id === pid)
    if (parentItem) {
      treeFlatData.push(parentItem)
      if (parentItem?.pid) {
        recursiveAddParent(parentItem?.pid, allTreeData)
      }
    }
  }

  if (searched) {
    const allTreeData = [...treeFlatData]
    treeFlatData = allTreeData.filter((x) => x.name.includes(searched))
    treeFlatData.forEach((item: RenderTree) => {
      if (item.pid) {
        recursiveAddParent(item?.pid, allTreeData)
      }
    })
    treeFlatData = treeFlatData.filter(
      (value, index, self) => self.findIndex((v) => v.id === value.id) === index,
    )
  }

  const finalExpanded = useMemo<string[]>((): string[] => {
    let result = undefined

    if (expandedLevel.length > 0 && !searched) {
      result = treeFlatData.map((x: RenderTree) => expandedLevel?.includes(x?.level || 0) && x.id)
    } else {
      result = searched && !treeData.isLoading ? treeFlatData?.map((x) => x.id) : []
    }
    return result.filter((x) => x) as string[]
  }, [searched, expandedLevel])

  return (
    <HBViewContainerWithTree
      treeProps={{
        id: 'content-management',
        setExpandedLevel,
        maxExpandedLevel: 3,
        expanded: finalExpanded,
        showSearch: true,
        handleSearch: (search: string) => setSearched(search),
        treeItemsConfig: {
          isSuccess: treeData.isSuccess,
        },
        ItemComponent: TreeViewItem as any,
        treeItems: treeFlatData || [],
        sx: {
          width: '100%',
          minWidth: '100%',
        },
        onNodeSelect: ((e: unknown, id: string) => {
          onNodeSelect(id, 'edit')
        }) as any,
        selected: selectedNodeId as any,
        onClickAddChild: (id) => {
          onNodeSelect(id, 'create')
          reset({})
        },
        unVisibleAddButton: (id: string) => {
          return (
            id.includes('section') ||
            (!id.includes('section') && !id.includes('pagePart')) ||
            !(treeFlatData?.find((item) => item.id === id) as any)?.isExtendable
          )
        },
      }}
      breadcrumb={
        <BreadCrumbSection
          title={formatMessage(ContentManagementPageMessages.pageTitle)}
          breadItems={breadcrumbs}
        />
      }
      pageTitleBar={
        <PageTitleBar
          sectionFormProvider={formProviderProps}
          pageFormProvider={pageFormProviderProps}
          pagePartFormProvider={pagePartFormProviderProps}
        />
      }
    >
      {showPage && (
        <HBExplanation
          elevation={0}
          expanded={expandedPagePreview}
          onChange={(event, expandedPreview) => {
            setExpandedPagePreview(expandedPreview)
          }}
          summary={
            <HBExplanationSummary
              title={formatMessage(ContentManagementPageMessages.pageInformation)}
              icon={'documentInfo'}
            />
          }
          detail={<PageInformationForm formProvider={pageFormProviderProps} />}
        />
      )}
      {showPagePart && (
        <HBExplanation
          elevation={0}
          expanded={expandedPagePartPreview}
          onChange={(event, expandedPreview) => {
            setExpandedPagePartPreview(expandedPreview)
          }}
          summary={
            <HBExplanationSummary
              title={formatMessage(ContentManagementPageMessages.pagePartInformation)}
              icon={'documentInfo'}
            />
          }
          detail={
            <HBPagePartForm
              formProvider={pagePartFormProviderProps}
              pageFormProvider={pageFormProviderProps}
            />
          }
        />
      )}
      {showSection && (
        <SectionContainerDetailsForm
          formProvider={formProviderProps}
          pagePartFormProvider={pagePartFormProviderProps}
        />
      )}
      {showSection && (
        <HBExplanation
          elevation={0}
          expanded={expandedAdditionalInformation && action === 'edit'}
          onChange={(event, expandedAdditionalInformation) => {
            setExpandedAdditionalInformation(expandedAdditionalInformation)
          }}
          summary={
            <Grid container alignItems="center">
              <HBIcon type="documentInfo" />
              <Typography variant="h5" sx={{ flexGrow: 1 }}>
                {formatMessage(ContentManagementPageMessages.widgetSectionTitle)}
              </Typography>
              {action === 'edit' &&
              widgetTypeCode !== ContentTypeEnums.Image &&
              widgetTypeCode !== ContentTypeEnums.Video ? (
                <HBIconButton
                  iconSize="medium"
                  icon="check"
                  variant="text"
                  form="widgetDetails"
                  type="submit"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : null}
            </Grid>
          }
          detail={<HBWidget fullCode={widgetTypeCode!} formProvider={formProviderProps} />}
        />
      )}
    </HBViewContainerWithTree>
  )
}

export default ContentManagementPage

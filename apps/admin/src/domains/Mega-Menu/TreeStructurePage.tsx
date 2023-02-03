import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBViewContainerWithTree } from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree'
import TreeViewItem from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree/components/TreeViewItem/TreeViewItem'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  ApiResult,
  RecallTypeCode,
  useGetAdminCmsMenugroupsByMenuGroupIdSearchMenuItemsTreeQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBForm, openToast, RenderTree } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import MainContentExplanation from './containers/structure/mainContentExplanation'
import PageTitleBar from './containers/structure/pageTitleBar'
import MegaMenuPageMessages from './MegaMenu.messages'
import {
  useGetAdminCmsMenugroupsByMenuGroupIdGetMenuItemsQuery,
  usePostAdminCmsMenugroupsByMenuGroupIdAddMenuItemMutation,
  usePutAdminCmsMenugroupsByMenuGroupIdUpdateMenuItemAndMenuItemIdMutation,
} from './menuApi.enhanced'
import { convertDataTree, maxExpandedLevel } from './utils/convert-data-tree'

export const formId = 'menu-structure-form'

type PageQueryProps = {
  id?: string
  title?: string
}
type QueryIdType = {
  id?: string
  title?: string
}
export interface IMenuItemFormType {
  code?: string | undefined
  title?: string | undefined
  displaySortOrder?: number | undefined
  isLeaf?: boolean | undefined
  recallType?: RecallTypeCode | undefined
  pageId?: PageQueryProps | undefined
  productCategories?: string | undefined
  queryId?: QueryIdType | undefined
  imageUrl?: string | undefined
}

const TreeStructurePage = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { showToast } = useToast()
  const action = router?.query?.menuGroupId?.[1] === 'add' ? 'add' : 'edit'
  const menuGroupId = router?.query?.menuGroupId?.[0] || ''
  const menuId = (router?.query?.menuId as string) || ''
  const parentId = (router?.query?.parentId as string) || ''
  const [expandedLevel, setExpandedLevel] = useState<number[]>([])

  const [selectedNodeId, setSelectedNodeId] = useState<string>(menuId)
  const [nodes, setNodes] = useState<RenderTree[]>([])

  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '/mega-menu', title: formatMessage(sidebarMessages.megaMenu) },
    { url: '#', title: formatMessage(MegaMenuPageMessages.treeStructure) },
  ]

  const [createMenuItem, { error: createError, reset: resetCreate }] =
    usePostAdminCmsMenugroupsByMenuGroupIdAddMenuItemMutation()

  const [updateMenuItem, { error: updateError, reset: resetUpdate }] =
    usePutAdminCmsMenugroupsByMenuGroupIdUpdateMenuItemAndMenuItemIdMutation()

  const handleSave = (values: IMenuItemFormType) => {
    const body = {
      ...values,
      queryId:
        typeof values?.queryId === 'string' ? values?.queryId : values?.queryId?.id || undefined,
      pageId: typeof values?.pageId === 'string' ? values?.pageId : values?.pageId?.id || undefined,
      parentId:
        action === 'add'
          ? parentId || null
          : items.find((item: any) => item.id === selectedNodeId)?.parentId,
    }
    resetCreate()
    resetUpdate()
    if (action === 'edit') {
      updateMenuItem({
        'client-name': 'update-menu-item',
        'client-version': '1.0.0',
        menuGroupId,
        menuItemId: menuId,
        updateMenuItemModel: body,
      }).then((res: { data: ApiResult }) => {
        if (res.data.success) {
          openToast({ message: formatMessage(phrasesMessages.successUpdate), type: 'success' })
        }
      })
    } else {
      createMenuItem({
        'client-name': 'create-menu-item',
        'client-version': '1.0.0',
        menuGroupId,
        addMenuItemModel: body,
      }).then((res: { data: ApiResult }) => {
        if (res.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successAdd), type: 'success' })
          //@ts-ignore
          const menuId = res.data?.data?.id
          setSelectedNodeId(menuId)
          router.push({
            pathname: `/mega-menu/structure/${menuGroupId}/edit`,
            query: {
              menuId,
            },
          })
        }
      })
    }
  }

  const [searched, setSearched] = useState('')
  const {
    //@ts-ignore
    data: { data: { items = [] } = {} } = {},
    refetch: refetchTree,
    isFetching,
  } = useGetAdminCmsMenugroupsByMenuGroupIdGetMenuItemsQuery({
    'client-name': 'get-menu-items',
    'client-version': '0',
    menuGroupId,
  })

  useEffect(() => {
    if (items) {
      const data = convertDataTree(items)
      setNodes(data)
    }
  }, [isFetching])

  const {
    //@ts-ignore
    data: { data: { items: searchItems = [] } = {} } = {},
    refetch: refetchSearchQuery,
    isFetching: searchIsFetching,
    isLoading,
    isSuccess,
  } = useGetAdminCmsMenugroupsByMenuGroupIdSearchMenuItemsTreeQuery(
    {
      'client-name': 'search',
      'client-version': '1.0.0',
      searchTerm: searched.toString().trim(),
      menuGroupId,
    },
    {
      skip: searched === '',
    },
  )

  useEffect(() => {
    if (searched.toString().length !== 0) {
      refetchSearchQuery()
    } else if (searched.toString().length === 0) {
      refetchTree()
    }
  }, [searched])

  useEffect(() => {
    if (searched.toString().length !== 0 && !searchIsFetching && searchItems) {
      const data = convertDataTree(searchItems)
      setNodes(data)
    } else if (searched.toString().length === 0 && !isFetching && items) {
      const data = convertDataTree(items)
      setNodes(data)
    }
  }, [isFetching, searchIsFetching])

  const onNodeSelect = (nodeId: string, type: string) => {
    setSelectedNodeId(nodeId)
    if (nodeId) {
      router.push({
        pathname: `/mega-menu/structure/${menuGroupId}/${type}`,
        query: {
          [type === 'add' ? 'parentId' : 'menuId']: nodeId,
        },
      })
    }
  }

  const finalExpanded = useMemo<string[]>((): string[] => {
    let result = undefined

    if (expandedLevel.length > 0 && !searched) {
      result = nodes.map((x: RenderTree) => expandedLevel?.includes(x?.level || 0) && x.id)
    } else {
      result = searched && !isLoading ? nodes?.map((x) => x.id) : []
    }
    return result.filter((x) => x) as string[]
  }, [searched, expandedLevel])

  return (
    <HBForm id="menu-structure-form" onSubmit={handleSave} mode="onSubmit">
      <HBViewContainerWithTree
        treeProps={{
          id: 'tree-structure',
          setExpandedLevel,
          maxExpandedLevel,
          expanded: finalExpanded,
          showSearch: true,
          handleSearch: (search: string) => setSearched(search),
          treeItemsConfig: {
            isSuccess,
          },
          onClickAddChild: (id) => {
            onNodeSelect(id, 'add')
          },
          ItemComponent: TreeViewItem as any,
          treeItems: nodes,
          sx: {
            width: '100%',
            minWidth: '100%',
          },
          onNodeSelect: ((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
            onNodeSelect(id, 'edit')
          }) as any,
          selected: selectedNodeId,
        }}
        breadcrumb={
          <BreadCrumbSection
            title={formatMessage(MegaMenuPageMessages.megaMenu)}
            breadItems={breadcrumbs}
          />
        }
        pageTitleBar={
          <PageTitleBar refetchTree={refetchTree} setSelectedNodeId={setSelectedNodeId} />
        }
      >
        <MainContentExplanation
          menuItemsData={items}
          menuId={menuId}
          action={action}
          handleSave={handleSave}
        />
      </HBViewContainerWithTree>
    </HBForm>
  )
}
export default TreeStructurePage

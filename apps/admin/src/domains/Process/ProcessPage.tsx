import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBViewContainerWithTree } from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree'
import TreeViewItem from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree/components/TreeViewItem/TreeViewItem'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import MainContentExplanation from '@hasty-bazar-admin/domains/Process/containers/mainContentExplanation'
import { useGetAdminGeneralDataProcessesGetAllForTreeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { RenderTree } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import processPageMessages from './ProcessPage.messages'
import { convertDataTree, maxExpandedLevel } from './utils/convertDataTree'

export default function ProcessPage() {
  const { formatMessage } = useIntl()
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [nodes, setNodes] = useState<RenderTree[]>([])
  const [expandedLevel, setExpandedLevel] = useState<number[]>([])
  const [searched, setSearched] = useState('')
  const router = useRouter()
  const id = router.query.id?.[0]

  const { data: processesTreeData, isLoading } = useGetAdminGeneralDataProcessesGetAllForTreeQuery({
    'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
    'client-version': '1.0.1.100',
  })

  let treeItems = useMemo(
    () => convertDataTree(processesTreeData?.data?.items || []) || [],
    [processesTreeData?.data?.items],
  )

  const recursiveAddParent = (pid: string, allTreeData: RenderTree[]) => {
    const parentItem = allTreeData.find((x) => x?.id === pid)
    if (parentItem) {
      treeItems.push(parentItem)
      if (parentItem?.pid) {
        recursiveAddParent(parentItem?.pid, allTreeData)
      }
    }
  }

  if (searched) {
    const allTreeData = [...treeItems]
    treeItems = allTreeData.filter((x) => x.name.includes(searched))
    treeItems.forEach((item: RenderTree) => {
      if (item?.pid) {
        recursiveAddParent(item.pid, allTreeData)
      }
    })
    treeItems = treeItems.filter(
      (value, index, self) => self.findIndex((v) => v.id === value.id) === index,
    )
  }

  useEffect(() => {
    if (id) {
      setSelectedNodeId(id)
    }
  }, [id])

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(processPageMessages.process),
    },
  ]

  const onNodeSelect = (nodeId: string, type: string) => {
    const node = treeItems.find((item) => item.id === nodeId)
    if (node?.pid) {
      setSelectedNodeId(nodeId)
      router.push(
        {
          pathname: `/process/${type}/${nodeId}`,
        },
        undefined,
        {
          shallow: true,
        },
      )
    }
  }

  const finalExpanded = useMemo<string[]>((): string[] => {
    let result = undefined

    if (expandedLevel.length > 0 && !searched) {
      result = treeItems.map((x: RenderTree) => expandedLevel?.includes(x?.level || 0) && x.id)
    } else {
      result = searched && !isLoading ? treeItems?.map((x) => x.id) : []
    }
    return result.filter((x) => x) as string[]
  }, [searched, expandedLevel])

  return (
    <HBViewContainerWithTree
      treeProps={{
        id: 'process',
        setExpandedLevel,
        maxExpandedLevel,
        expanded: finalExpanded,
        showSearch: true,
        handleSearch: (search: string) => setSearched(search),
        ItemComponent: TreeViewItem as any,
        treeItems: treeItems || [],
        sx: {
          width: '100%',
          minWidth: '100%',
        },
        onNodeSelect: ((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
          onNodeSelect(id, 'edit')
        }) as any,
        selected: selectedNodeId,
        onClickAddChild: (id) => {
          onNodeSelect(id, 'add')
        },
        unVisibleAddButton: (id) => {
          // TODO: it has been commented for now. activate later
          // const node = nodes.find((item) => item.id === id)
          return true // node?.pid ? false : true
        },
      }}
      breadcrumb={
        <BreadCrumbSection
          title={formatMessage(processPageMessages.process)}
          breadItems={breadcrumbs}
        />
      }
      pageTitleBar={<></>}
    >
      <MainContentExplanation />
    </HBViewContainerWithTree>
  )
}

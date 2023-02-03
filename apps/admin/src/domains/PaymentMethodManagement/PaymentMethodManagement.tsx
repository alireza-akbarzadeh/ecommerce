import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBViewContainerWithTree } from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree'
import TreeViewItem from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree/components/TreeViewItem/TreeViewItem'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { RenderTree } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import MainContentExplanation, {
  PaymentMethodManagementFormModel,
} from './containers/MainContentExplanation'
import PageTitleBar from './containers/PageTitleBar'
import { useGetAdminPaymentPaymentMethodGetAllQuery } from './paymentApi.enhanced'
import paymentMethodManagementPageMessages from './PaymentMethodManagementPage.messages'
import { convertDataTree, maxExpandedLevel } from './utils/convertDataTree'

export default function PaymentMethodManagementPage() {
  const { formatMessage } = useIntl()
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [nodes, setNodes] = useState<RenderTree[]>([])
  const [searched, setSearched] = useState('')
  const router = useRouter()
  const [expandedLevel, setExpandedLevel] = useState<number[]>([])
  const id = router.query.id?.[0]
  const formProviderProps = useForm<PaymentMethodManagementFormModel>({
    mode: 'all',
  })

  const { data: PaymentMethodManagementTreeData } = useGetAdminPaymentPaymentMethodGetAllQuery({
    'client-name': 'Swagger on HIT.Hastim.Payment.Endpoints.AdminApi',
    'client-version': '1.0.0.0',
  })

  useEffect(() => {
    setNodes(convertDataTree(PaymentMethodManagementTreeData?.data?.paymentMethods || []))
  }, [PaymentMethodManagementTreeData])

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
      title: formatMessage(paymentMethodManagementPageMessages.paymentMethodManagement),
    },
  ]

  const onNodeSelect = (nodeId: string) => {
    const node = nodes.filter((item) => item.id === nodeId)[0]
    if (node.pid) {
      setSelectedNodeId(nodeId)
      if (nodeId) {
        router.push({
          pathname: `/paymentMethodManagement/edit/${nodeId}`,
          query: {
            paymentMethodId: node.pid,
          },
        })
      }
    }
  }

  const onNodeAdd = (nodeId: string) => {
    router.push({
      pathname: '/paymentMethodManagement/add',
      query: {
        paymentMethodId: nodeId,
      },
    })
  }

  useEffect(() => {
    if (searched) {
      const filteredNodes = nodes.filter((x) => x.name.includes(searched))
      filteredNodes.forEach((item) => {
        if (item.pid) {
          const parentItem = nodes.find((x) => x?.id === item?.pid)
          if (parentItem) {
            filteredNodes.push(parentItem as RenderTree)
          }
        }
      })
      setNodes(filteredNodes)
    } else {
      setNodes(convertDataTree(PaymentMethodManagementTreeData?.data?.paymentMethods || []))
    }
  }, [searched])

  const finalExpanded = useMemo<string[]>((): string[] => {
    let result = undefined

    if (expandedLevel.length > 0 && !searched) {
      result = nodes.map((x: RenderTree) => expandedLevel?.includes(x?.level || 0) && x.id)
    } else {
      result = searched ? nodes?.map((x) => x.id) : []
    }
    return result.filter((x) => x) as string[]
  }, [searched, expandedLevel])

  return (
    <HBViewContainerWithTree
      treeProps={{
        id: 'payment-method',
        setExpandedLevel,
        maxExpandedLevel,
        expanded: finalExpanded,
        showSearch: true,
        handleSearch: (search: string) => setSearched(search),
        ItemComponent: TreeViewItem as any,
        treeItems: nodes,
        sx: {
          width: '100%',
          minWidth: '100%',
        },
        onNodeSelect: ((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
          onNodeSelect(id)
        }) as any,
        selected: selectedNodeId,
        onClickAddChild: (id) => {
          onNodeAdd(id)
        },
        unVisibleAddButton: (id) => {
          const node = nodes.find((item) => item.id === id)
          return node?.pid ? true : false
        },
      }}
      breadcrumb={
        <BreadCrumbSection
          title={formatMessage(paymentMethodManagementPageMessages.paymentMethodManagement)}
          breadItems={breadcrumbs}
        />
      }
      pageTitleBar={<PageTitleBar formProvider={formProviderProps} />}
    >
      <MainContentExplanation formProvider={formProviderProps} />
    </HBViewContainerWithTree>
  )
}

import { HBViewContainerWithTree } from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree'
import TreeViewItem from '@hasty-bazar/admin-shared/containers/HBViewContainerWithTree/components/TreeViewItem/TreeViewItem'
import { HBForm, RenderTree } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { Forms, PageTitleBar } from './containers'
import useProductGroupPageMain from './hooks/useProductGroupPageMain'
import productGroupMessages from './ProductGroup.messages'
import {
  convertDataTree,
  convertDataTreeAfterSearch,
  maxExpandedLevel,
} from './utils/convertDataTree'
import { classes, IProductGroupsFormTypes } from './types'

const baseData = {
  productNatureTypeCode: 1011001,
  code: '',
  name: '',
  latinName: '',
  description: '',
  iconPath: '',
  stateCode: '',
  isAllocatableToProduct: false,
  displaySortTypeCode: '',
}

const MainPage = (props: { children: ReactNode | ReactNode[] }) => {
  const { query: { slug = [], ...other } = {} } = useRouter()
  const [action, nodeId] = slug
  const { formatMessage } = useIntl()
  const [searched, setSearched] = useState('')
  const [expandedLevel, setExpandedLevel] = useState<number[]>([])
  const FormProvider = useForm<IProductGroupsFormTypes>({
    mode: 'all',
  })

  const { collectionId, screenDisplayId } = useWatch({
    control: FormProvider.control,
  })

  const {
    sellerLimitationTypeItems,
    displayOrderTypeItems,
    commissionLawsItems,
    returnLawsItems,
    displayExtractTypeItems,
    data,
    refetchData,
    isFetching,
    items,
    isSuccess,
    isLoading,
    refetchCategories,
    screenDisplayItems,
    collectionDataItems,
    selectedNodeId,
    setSelectedNodeId,
    createCategory,
    updateCategory,
    breadcrumbs,
    onClickAddChild,
    nodes,
    setNodes,
    onNodeSelect,
  } = useProductGroupPageMain(nodeId)

  const getSearch = (_searched?: string) => {
    let temp = []
    if (_searched) {
      const filteredListAfterSearch = items?.filter((x) => x?.name?.includes(_searched))
      if (filteredListAfterSearch) temp = convertDataTreeAfterSearch(filteredListAfterSearch, items)
    } else if (items && items.length > 0) {
      temp = convertDataTree(items || [])
    }
    if (JSON.stringify(temp) !== JSON.stringify(nodes)) {
      setNodes(temp)
    }
  }

  useEffect(() => {
    getSearch(searched)
  }, [items, searched])

  useEffect(() => {
    if (!isFetching && action === 'edit' && nodeId) {
      //@ts-ignore
      FormProvider.reset({
        ...data,
        productNatureTypeCode: 1011001,
        iconPath: data.iconPath ?? '',
        stateCode: data.stateCode ?? '',
        description: data.description ?? '',
        parentName: data?.parentName ? (data?.parentName !== 'null' ? data?.parentName : '') : '',
        isAllocatableToProduct: data?.isAllocatableToProduct ?? false,
        displaySortTypeCode: data?.displaySortTypeCode ?? '',
        latinName: data.latinName ? data.latinName?.slice(4) : data.code,
        sellerLimitationTypeCode: sellerLimitationTypeItems.find(
          (item) => item.value == data?.sellerLimitationTypeCode?.toString(),
        ),
        displayOrderTypeCode: displayOrderTypeItems.find(
          (item) => item.value == data?.displayOrderType?.toString(),
        ),
        displayExtractTypeCode: displayExtractTypeItems.length
          ? displayExtractTypeItems?.find((item) => item.value == data?.displayExtractTypeCode)
          : null,
      })
    }
    if (action === 'add' && nodeId) {
      FormProvider.reset({
        parentId: nodeId,
        parentName: data?.name!,
        ...baseData,
      })
    } else if (action === 'add' || !nodeId || !action) {
      FormProvider.reset({
        ...baseData,
      })
    }
  }, [
    isFetching,
    action,
    nodeId,
    sellerLimitationTypeItems,
    displayOrderTypeItems,
    displayExtractTypeItems,
  ])

  useEffect(() => {
    if (commissionLawsItems?.length && !isFetching && action === 'edit' && nodeId) {
      FormProvider.setValue(
        'commisionLawId',
        commissionLawsItems.find((item) => item.value == data?.commisionLawId),
      )
    }
  }, [commissionLawsItems, isFetching, action, nodeId])

  useEffect(() => {
    if (returnLawsItems?.length && !isFetching && action === 'edit' && nodeId) {
      FormProvider.setValue(
        'returnLawId',
        returnLawsItems.find((item) => item.value == data?.returnLawId),
      )
    }
  }, [returnLawsItems, isFetching, action, nodeId])

  useEffect(() => {
    if (screenDisplayItems?.length && !isFetching && action === 'edit' && nodeId) {
      const screenDisplayItem = screenDisplayItems.find(
        (item) => item.value == data?.screenDisplayId,
      )
      FormProvider.setValue('screenDisplayId', screenDisplayItem)
    }
  }, [screenDisplayItems, isFetching, action, nodeId])

  useEffect(() => {
    if (collectionDataItems?.length && !isFetching && action === 'edit' && nodeId) {
      const collectionItem = collectionDataItems.find((item) => item.value == data?.collectionId)
      FormProvider.setValue('collectionId', collectionItem)
    }
  }, [collectionDataItems, isFetching, action, nodeId])

  useEffect(() => {
    if (collectionDataItems?.length && !isFetching && action === 'edit' && nodeId) {
      FormProvider.setValue('commissionDescription', data?.commissionDescription)
    }
  }, [collectionDataItems, isFetching, action, nodeId])

  useEffect(() => {
    if (collectionId) {
      FormProvider.setValue('pageOriginName', collectionId?.originName)
    }
    if (screenDisplayId) {
      FormProvider.setValue('pageOriginName', screenDisplayId?.originName)
    }
  }, [collectionId, screenDisplayId])

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
    <Box sx={classes.container}>
      <Box sx={{ display: other.subRoute ? 'none' : 'block' }}>
        <HBForm
          formProviderProps={FormProvider}
          onSubmit={(value) => {
            if (action === 'edit') {
              updateCategory(value)
            } else if (action === 'add') {
              createCategory(value)
            }
          }}
        >
          <HBViewContainerWithTree
            treeProps={{
              id: 'product-group',
              setExpandedLevel,
              maxExpandedLevel,
              expanded: finalExpanded,
              showSearch: true,
              handleSearch: (search: string) => setSearched(search),
              ItemComponent: TreeViewItem as any,
              treeItems: nodes,
              treeItemsConfig: {
                isSuccess,
              },
              sx: {
                width: '100%',
                minWidth: '100%',
              },
              onNodeSelect: ((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
                onNodeSelect(id)
              }) as any,
              onClickAddChild,
              selected: selectedNodeId,
            }}
            breadcrumb={
              <BreadCrumbSection
                title={formatMessage(productGroupMessages.productDevelopment)}
                breadItems={breadcrumbs}
              />
            }
            pageTitleBar={
              <PageTitleBar
                setSelectedNodeId={setSelectedNodeId}
                onClickAddChild={onClickAddChild}
                onDelete={() => {
                  refetchCategories()
                }}
              />
            }
          >
            <Forms data={data} refetchData={refetchData} />
          </HBViewContainerWithTree>
        </HBForm>
      </Box>
      {props.children}
    </Box>
  )
}

export default MainPage

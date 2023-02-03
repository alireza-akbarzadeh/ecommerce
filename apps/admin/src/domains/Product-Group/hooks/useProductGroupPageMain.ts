import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminCatalogCategoriesByIdQuery,
  useGetAdminCatalogProductRulesGetallPublishedQuery,
  useLazyGetAdminCatalogCategoriesByIdQuery,
  usePostAdminCatalogCategoriesMutation,
  usePutAdminCatalogCategoriesByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { openToast, RenderTree } from '@hasty-bazar/core'
import { useCallback, useId, useMemo, useState } from 'react'
import { useProductFurtherDetailsControls } from '../containers/ProductFurtherDetailsControls'
import { useGetAdminCatalogCategoriesQuery } from '../productGroupApi.enhanced'
import { IProductGroupsFormTypes } from '../types'
import productGroupMessages from '../ProductGroup.messages'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'

function useProductGroupPageMain(nodeId?: string) {
  const [editCategory] = usePutAdminCatalogCategoriesByIdMutation()
  const [addCategory] = usePostAdminCatalogCategoriesMutation()
  const { query: { slug = [], activePanel, ...other } = {}, push } = useRouter()
  const { formatMessage } = useIntl()
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodeId ?? '')
  const [nodes, setNodes] = useState<RenderTree[]>([])

  const breadcrumbs = [
    { url: '/', title: formatMessage(phrasesMessages.dashboard) },
    { url: '#', title: formatMessage(productGroupMessages.titleProductGroup) },
  ]

  const { screenDisplayItems, collectionDataItems } = useProductFurtherDetailsControls({
    id: nodeId,
  })

  const { data: sellerLimitationTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnums.SelectionLimitationType,
    })

  const sellerLimitationTypeItems = useMemo(
    () =>
      sellerLimitationTypeData?.data?.items?.map((item: any) => ({
        title: item.title,
        value: item.fullCode,
      })) || [],
    [sellerLimitationTypeData],
  )

  const { data: displayOrderTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnums.SortOrderType,
    })

  const displayOrderTypeItems = useMemo(
    () =>
      displayOrderTypeData?.data?.items?.map((item: any) => ({
        title: item.title,
        value: item.fullCode,
      })) || [],
    [displayOrderTypeData],
  )

  const { data: { data: { items: commissionLawsData = [] } = {} } = {} } =
    useGetAdminCatalogProductRulesGetallPublishedQuery({
      'client-name': 'generalData',
      'client-version': '0',
      pageSize: 1000,
      pageNumber: 1,
      processEventName: 'IDS_UserSignUpRule_ViewCommissionRules',
      filter: 'ProcessEventName=@ProcessEventName',
    })

  const commissionLawsItems = useMemo(
    () =>
      commissionLawsData?.map((item: any) => ({
        title: item.name,
        value: item.id,
      })) || [],
    [commissionLawsData],
  )

  const { data: { data: { items: returnLawsData = [] } = {} } = {} } =
    useGetAdminCatalogProductRulesGetallPublishedQuery({
      'client-name': 'generalData',
      'client-version': '0',
      pageSize: 1000,
      pageNumber: 1,
      processEventName: 'Catalog_ReturnRule_ViewReturnRules',
      filter: 'ProcessEventName=@ProcessEventName',
    })

  const returnLawsItems = useMemo(
    () =>
      returnLawsData?.map((item: any) => ({
        title: item.name,
        value: item.id,
      })) || [],
    [returnLawsData],
  )

  const { data: displayExtractTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnums.DisplayExtractType,
    })

  const displayExtractTypeItems = useMemo(
    () =>
      displayExtractTypeData?.data?.items?.map((item: any) => ({
        title: item.title,
        value: item.fullCode,
      })) || [],
    [displayExtractTypeData],
  )

  const {
    data: { data = {} } = {},
    refetch: refetchData,
    isFetching,
  } = useGetAdminCatalogCategoriesByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: nodeId!,
    },
    {
      skip: !nodeId,
    },
  )

  const {
    data: { data: { items = [] } = {} } = {},
    isSuccess,
    isLoading,
    refetch: refetchCategories,
  } = useGetAdminCatalogCategoriesQuery({
    'client-name': 'test',
    'client-version': '0',
    pageNumber: 0,
    pageSize: 10000,
    ordering: 'DisplaySortTypeCode',
  })

  const updateCategory = (value: IProductGroupsFormTypes) => {
    Object.keys(value).forEach((key) => {
      //@ts-ignore
      if (value[key] === '') {
        //@ts-ignore
        value[key] = null
      }
    })

    const body = {
      ...value,
      stateCode: undefined,
      stateName: undefined,
      treeItems: undefined,
      createPrudoctStartSubject: undefined,
      attributesCount: undefined,
      parentName: undefined,
      id: undefined,
      latinName: 'cat-' + value.latinName,
      code: value.code,
      defaultImage: undefined,
      imageMetaData: undefined,
      displaySortTypeCode: value?.displaySortTypeCode ? +value.displaySortTypeCode : 1,
      sellerLimitationTypeCode: value?.sellerLimitationTypeCode?.value || null,
      displayOrderTypeCode: value?.displayOrderTypeCode?.value || null,
      commisionLawId: value?.commisionLawId?.value || null,
      returnLawId: value?.returnLawId?.value || null,
      displayExtractTypeCode: value?.displayExtractTypeCode?.value || 1030003,
      screenDisplayId: value?.screenDisplayId?.value || null,
      collectionId: value?.collectionId?.value || null,
    }

    editCategory({
      'client-name': 'update-attribute',
      'client-version': '1.0.0',
      id: nodeId!,
      //@ts-ignore
      updateCategoryModel: {
        ...body,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        refetchData()
        openToast({
          message: formatMessage(productGroupMessages.updateSuccess),
          type: 'success',
        })
      }
    })
  }

  const createCategory = useCallback((value: IProductGroupsFormTypes) => {
    const obj = {
      isAllocatableToProduct: false,
      ...value,
      productNatureTypeCode: 1011001,
      parentId: value.parentId ? value.parentId : null,
      sellerLimitationTypeCode: null,
      displayOrderTypeCode: null,
      hasPriceFilter: false,
      hasProductionSerialNumber: false,
      hasExpirationDate: false,
      isApprovedRequired: false,
      isAddable: false,
      treeItems: undefined,
      commisionLawId: null,
      returnLawId: null,
      displayExtractTypeCode: 1030003,
      screenDisplayId: null,
      collectionId: null,
      latinName: 'cat-' + value.latinName,
      displaySortTypeCode: value?.displaySortTypeCode ? +value.displaySortTypeCode : 1,
    }
    addCategory({
      'client-name': 'update-attribute',
      'client-version': '1.0.0',
      //@ts-ignore
      createCategoryModel: obj,
    }).then((res: any) => {
      if (res?.data?.success) {
        refetchCategories()
        openToast({
          message: formatMessage(productGroupMessages.addSuccess),
          type: 'success',
        })
        res?.data?.data?.id &&
          push(
            {
              pathname: `/product-group/edit/${res?.data?.data?.id}`,
              query: {},
            },
            undefined,
            {
              shallow: true,
            },
          )
        setSelectedNodeId(res?.data?.data?.id)
      }
    })
  }, [])

  const [catalogCategoriesByIdQuery] = useLazyGetAdminCatalogCategoriesByIdQuery()
  const uniqId = useId()

  const redirectToAddPage = (id?: string | undefined) => {
    push(
      {
        pathname: `/product-group/add/${id || ''}`,
        query: {},
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  const onClickAddChild = (
    id?: string | undefined,
    handleExpansionClick?: () => void,
    expanded?: boolean,
  ) => {
    if (id) {
      catalogCategoriesByIdQuery({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id,
      }).then((res) => {
        if (res?.data?.data?.isAddable) {
          openToast({
            message: formatMessage(productGroupMessages.isAddableMessage),
            type: 'error',
          })
        } else {
          redirectToAddPage(id)
          const allNodes = [...nodes.filter((x) => x.id !== uniqId)]
          allNodes.push({
            icon: 'createDashboard',
            id: uniqId,
            name: formatMessage(productGroupMessages.creatingNewGroup),
            pid: id as string,
            stateCode: '1',
          })
          setNodes(allNodes)
          setSelectedNodeId(uniqId)
          if (!expanded) handleExpansionClick?.()
        }
      })
    } else {
      redirectToAddPage()
    }
  }

  const onNodeSelect = (nodeId: string) => {
    const node = nodes.filter((item) => item.id === nodeId)[0]
    if (node.pid) {
      setSelectedNodeId(nodeId)
    } else {
      setSelectedNodeId('')
    }
    if (nodeId) {
      push(
        {
          pathname: `/product-group/edit/${nodeId}`,
          query: { activePanel },
        },
        undefined,
        {
          shallow: true,
        },
      )
    }
  }

  return {
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
  }
}

export default useProductGroupPageMain

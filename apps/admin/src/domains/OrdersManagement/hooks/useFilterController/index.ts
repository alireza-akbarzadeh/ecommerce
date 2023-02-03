import { OnGridReadyParams } from '@hasty-bazar/admin-shared/core/types'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetOrdersHeaderQueryFilter,
  GetOrdersHeaderQueryResult,
  GetOrdersHeaderQueryResultApiResult,
  usePostAdminSaleOrderMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { GetStatesQueryResult } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { useRef, useState } from 'react'
import { isArray } from 'lodash'
import { useIntl } from 'react-intl'
import { gridInformationModel } from '../../types/OrderMasterGridPageProps'
interface IUseFilterController {
  userId?: string
}

const useFilterController = ({ userId }: IUseFilterController) => {
  const [rowData, setRowData] = useState<GetOrdersHeaderQueryResult>()
  const [expandedItem, setExpandItems] = useState<boolean>(false)
  const [gridInformation, setGridInformation] = useState<gridInformationModel>({
    pageNumber: 1,
    pageSize: 25,
  })

  const formRef = useRef<HTMLButtonElement>(null)
  const modelData = useRef<GetOrdersHeaderQueryFilter | null>(null)

  const { formatMessage } = useIntl()
  const setRowsData = (data: GetOrdersHeaderQueryResult | undefined) => {
    setRowData(data)
  }
  const getIds = (data: any) => {
    if (isArray(data)) {
      return data?.map((item: any) => item.id)
    }
    return ''
  }

  const getPartyIds = (data: string[]) => {
    return data.map((item: string) => {
      const jsonValue = JSON.stringify(item)
      return JSON.parse(jsonValue).partyId
    })
  }
  const [shippingProviderFilter] = usePostAdminSaleOrderMutation()

  const handleOnGrigReady = (params?: OnGridReadyParams) => {
    const { PageNumber, PageSize, Ordering, Filter, ...filterFields } = params || {}
    const data = {
      dateFilterTypeCode:
        (modelData?.current?.dateFilterTypeCode as GetBusinessTypeValuesQueryResult)?.id || null,
      fromDate: modelData?.current?.fromDate || null,
      toDate: modelData?.current?.toDate || null,
      vendorId: modelData?.current?.vendorId?.length ? getIds(modelData?.current?.vendorId) : [],
      agentId: modelData?.current?.agentId?.length ? getIds(modelData?.current?.agentId) : [],
      productId: modelData?.current?.productId?.length ? getIds(modelData?.current?.productId) : [],
      providerCode: modelData?.current?.providerCode?.length
        ? getIds(modelData?.current?.providerCode)
        : [],

      customerId: !userId
        ? modelData?.current?.customerId?.length
          ? getPartyIds(modelData?.current?.customerId)
          : []
        : [userId],
      ...(modelData?.current?.bundleId ? { bundleId: modelData?.current?.bundleId } : {}),
      ...(modelData?.current?.orderId ? { shoppingCartId: modelData?.current?.orderId } : {}),
      shippingStatusType: modelData?.current?.shippingStatusType?.length
        ? (modelData?.current.shippingStatusType as GetStatesQueryResult[])?.map(
            (item: GetStatesQueryResult) => item.code!,
          )
        : [],
      pageNumber: params?.PageNumber,
      pageSize: params?.PageSize,
      ...(params?.Filter ? { filter: params?.Filter } : {}),
      ...(params?.Ordering ? { ordering: params?.Ordering } : {}),
      ...(modelData?.current?.orderNumber ? { orderNumber: modelData?.current?.orderNumber } : ''),
    }
    shippingProviderFilter({
      'client-name': '',
      'client-version': '',
      getOrdersHeaderQueryFilter: {
        ...(data as GetOrdersHeaderQueryFilter),
        ...filterFields,
      },
    })
      .unwrap()
      .then((res: GetOrdersHeaderQueryResultApiResult) => {
        setRowsData(res?.data)
      })
    setGridInformation({
      pageSize: params?.PageSize as number,
    })
  }

  const handleSubmit = (data: GetOrdersHeaderQueryFilter) => {
    modelData.current = data
    const model = {
      dateFilterTypeCode:
        (data?.dateFilterTypeCode as GetBusinessTypeValuesQueryResult)?.id || null,
      fromDate: data?.fromDate || null,
      toDate: data?.toDate || null,
      ...(data?.bundleId ? { bundleId: data?.bundleId } : {}),
      shippingStatusType: data?.shippingStatusType?.length
        ? (data.shippingStatusType as GetStatesQueryResult[])?.map(
            (item: GetStatesQueryResult) => item.code!,
          )
        : [],
      providerCode: data?.providerCode?.length ? getIds(data?.providerCode) : [],
      orderNumber: data?.orderNumber || '',
      customerId: !userId
        ? data?.customerId?.length
          ? getPartyIds(data?.customerId)
          : []
        : [userId],
      vendorId: data?.vendorId?.length ? getIds(data?.vendorId) : [],
      agentId: data?.agentId?.length ? getIds(data?.agentId) : [],
      productId: data?.productId?.length ? getIds(data?.productId) : [],
      ...gridInformation,
    }

    setGridInformation({
      pageNumber: 1,
      pageSize: gridInformation.pageSize,
    })
    shippingProviderFilter({
      'client-name': 'cms',
      'client-version': 'v1',
      getOrdersHeaderQueryFilter: {
        ...(model as GetOrdersHeaderQueryFilter),
        pageNumber: 1,
      },
    })
      .unwrap()
      .then((res: GetOrdersHeaderQueryResultApiResult) => {
        if (res?.success) {
          setRowsData(res?.data)
          setExpandItems(false)
        }
      })
  }

  return {
    handleOnGrigReady,
    expandedItem,
    setExpandItems,
    formatMessage,
    handleSubmit,
    rowData,
    formRef,
    modelData,
    getIds,
  }
}

export default useFilterController

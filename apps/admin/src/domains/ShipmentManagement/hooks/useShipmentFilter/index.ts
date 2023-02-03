import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { OnGridReadyParams } from '@hasty-bazar/admin-shared/core/types'
import {
  usePostAdminSaleShipmentBundleFlatGetAllMutation,
  usePostAdminSaleShipmentBundleGetAllMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../messages'
import { IShipmentData, IShipmentModelForm } from '../../types'
interface IUseShipmentFilter {
  setShippingData: (val: IShipmentData) => void
}

const useShipmentFilter = ({ setShippingData }: IUseShipmentFilter) => {
  const [expandable, setExpandable] = useState<boolean>(false)
  const formRef = useRef<HTMLButtonElement>(null)
  const [gridInformation, setGridInformation] = useState<{ pageNumber?: number; pageSize: number }>(
    {
      pageNumber: 1,
      pageSize: 25,
    },
  )
  const formData = useRef<IShipmentModelForm | null>()
  const [postAdminSaleShipmentBundleFlatGetAll] = usePostAdminSaleShipmentBundleFlatGetAllMutation()
  const [postAdminSaleShipmentBundleGetAll] = usePostAdminSaleShipmentBundleGetAllMutation()
  const { formatMessage } = useIntl()
  const formProvider = useForm<IShipmentModelForm>({ mode: 'all' })
  const {
    formState: { isValid },
    reset,
    watch,
    clearErrors,
  } = formProvider

  const setRowsData = (data: IShipmentData) => {
    setShippingData(data)
  }
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/shipmentManagement',
      title: formatMessage(ShipmentManagementMessage.shipmentManagement),
    },
  ]

  const handleOnGridReady = (params: OnGridReadyParams) => {
    const { PageNumber, PageSize, Ordering, Filter, ...filterFields } = params || {}
    const createStatus = formData?.current?.status?.map((item) => item.code) as []
    const createProvider = formData?.current?.providerId?.map((item) => item.id) as []
    const createShipmentOrder = formData?.current?.agentId?.map((item) => item.id) as []
    const customerId = formData.current?.customerId?.map((item) => item.partyId) as []

    const data = {
      ...(formData?.current?.dateFilterTypeCode?.id
        ? { dateFilterTypeCode: +formData?.current.dateFilterTypeCode.id }
        : {}),
      ...(formData?.current?.toDate ? { toDate: formData?.current.toDate } : {}),
      ...(createProvider?.length > 0 ? { providerId: createProvider } : {}),
      ...(createStatus?.length > 0 ? { status: createStatus } : {}),
      ...(createShipmentOrder?.length > 0 ? { agentId: createShipmentOrder } : {}),
      ...(customerId?.length > 0 ? { customerId } : {}),
      ...(params?.Filter ? { filter: params?.Filter } : {}),
      ...(params?.Ordering ? { ordering: params?.Ordering } : {}),
      isProduct: undefined,
      fromDate: formData?.current?.fromDate,
      pageNumber: params?.PageNumber,
      pageSize: params?.PageSize,
    }

    if (formData?.current?.isProduct)
      postAdminSaleShipmentBundleFlatGetAll({
        'client-name': '',
        'client-version': '',
        getAllFlatShipmentOrderBundlesQueryFilter: { ...data, ...filterFields },
      }).then((res: any) => {
        setRowsData(res?.data?.data)
      })
    else
      postAdminSaleShipmentBundleGetAll({
        'client-name': '',
        'client-version': '',
        getAllShipmentOrderBundlesQueryFilter: { ...data, ...filterFields },
      }).then((res: any) => {
        setRowsData(res?.data?.data)
      })

    setGridInformation({
      pageSize: params?.PageSize as number,
    })
  }

  const handleSubmit = (data: IShipmentModelForm) => {
    formData.current = data
    const createStatus = data?.status?.map((item) => item.code) as []
    const createProvider = data?.providerId?.map((item) => item.id) as []
    const createShipmentOrder = data?.agentId?.map((item) => item.id) as []
    const customerId =
      data?.customerId?.length > 0
        ? (data?.customerId?.map((item) => item.partyId) as [])
        : undefined
    const model = {
      ...(data?.dateFilterTypeCode?.id ? { dateFilterTypeCode: +data.dateFilterTypeCode.id } : {}),
      ...(data?.toDate ? { toDate: data.toDate } : {}),
      ...(data?.customerId?.length > 0 ? { customerId } : {}),
      ...(createProvider?.length > 0 ? { providerId: createProvider } : {}),
      ...(createStatus?.length > 0 ? { status: createStatus } : {}),
      ...(createShipmentOrder?.length > 0 ? { agentId: createShipmentOrder } : {}),
      fromDate: data.fromDate,
    }
    setGridInformation({
      pageNumber: 1,
      pageSize: gridInformation.pageSize,
    })

    if (data.isProduct)
      postAdminSaleShipmentBundleFlatGetAll({
        'client-name': '',
        'client-version': '',
        getAllFlatShipmentOrderBundlesQueryFilter: {
          ...model,
          ...gridInformation,
          pageNumber: 1,
        },
      }).then((res: any) => {
        setShippingData(res?.data?.data)
        setExpandable(false)
      })
    else
      postAdminSaleShipmentBundleGetAll({
        'client-name': '',
        'client-version': '',
        getAllShipmentOrderBundlesQueryFilter: {
          ...model,
          ...gridInformation,
          pageNumber: 1,
        },
      }).then((res: any) => {
        setShippingData(res?.data?.data)
        setExpandable(false)
      })
  }

  const handleRemoveFilter = () => {
    clearErrors()
    reset()
    formRef?.current?.click()
  }

  return {
    expandable,
    breadcrumbs,
    setExpandable,
    formatMessage,
    handleSubmit,
    formProvider,
    isValid,
    isProduct: watch('isProduct') as boolean,
    handleOnGridReady,
    handleRemoveFilter,
    formRef,
  }
}

export default useShipmentFilter

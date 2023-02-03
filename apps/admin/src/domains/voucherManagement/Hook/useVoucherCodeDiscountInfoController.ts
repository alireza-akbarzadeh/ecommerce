import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { VoucherAddEdit } from '@hasty-bazar-admin/domains/voucherManagement/enum/VoucherAddEdit'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  useGetAdminSaleVoucherGetByIdQuery,
  usePostAdminSaleVoucherMutation,
  usePutAdminSaleVoucherByIdMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import useFormFieldController from '../Hook/useFormFieldController'
import { VoucherContextType, useVoucherContext } from '../context'
import { IUseReasonFormController } from '../types/IUseReasonFormController'
interface UseVoucherCodeDiscountInfoControllerType {
  id: string
}

const UseVoucherCodeDiscountInfoController = ({ id }: UseVoucherCodeDiscountInfoControllerType) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const formProvider = useForm<IUseReasonFormController>({ mode: 'all' })
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { setValue, getValues, reset } = formProvider
  const { showToast } = useToast()
  const { setSelected } = useVoucherContext() as VoucherContextType
  const { formState } = formProvider
  const { isDirty, isValid } = formState
  const [postSaleVoucher, { isSuccess: createIsSuccess, isLoading: createIsLoading }] =
    usePostAdminSaleVoucherMutation()
  const [putSaleVoucherByVoucherId, { isSuccess: updateISuccess, isLoading: updateILoading }] =
    usePutAdminSaleVoucherByIdMutation()
  const { vendorData, userSegmentationData } = useFormFieldController()
  const { data, refetch, isFetching } = useGetAdminSaleVoucherGetByIdQuery(
    {
      'client-name': '',
      'client-version': '',
      id: id!,
    },
    { skip: !id },
  )
  const handleBackApprove = () => {
    setOpenDialog(true)
  }
  const handleBack = () => {
    router.push('/voucherManagement')
  }

  const { setIsVendorExpandable } = useVoucherContext() as VoucherContextType
  const formWatch = useWatch({
    control: formProvider.control,
  })
  type userSegmentationType = { id: string; name: string }
  const handleSubmit = (values: IUseReasonFormController) => {
    const {
      code,
      maxPriceValue,
      isRefundableReturn,
      voucherValue,
      usageType,
      priceValueType,
      providerType,
      usedCount,
      minPurchaseValue,
      vendorId,
      usageLimit,
      title,
      maxTotalPrice,
      endDate,
      startDate,
      isActive,
      voucherUsageType,
      userSegmentations,
    } = values

    const userSegmentationsValue: string[] = []
    userSegmentations?.map((item) => userSegmentationsValue.push(String(item?.id)))

    const createData = {
      code: code ?? null,
      title: title || null,
      startDate,
      endDate: endDate ? endDate : undefined,
      vendorId: vendorId ? vendorId?.id : undefined,
      providerType: providerType.id,
      usageType: usageType?.id,
      voucherUsageType: voucherUsageType?.id,
      priceValueType: priceValueType?.id,
      voucherValue: voucherValue || null,
      minPurchaseValue: minPurchaseValue || null,
      maxPriceValue:
        priceValueType?.id === String(VoucherAddEdit.fixed)
          ? Number(voucherValue)
          : Number(maxPriceValue),
      usageLimit: Number(usageLimit),
      usedCount: usedCount ? +usedCount : null,
      maxTotalPrice:
        usageType?.id === String(VoucherAddEdit.disposable)
          ? Number(maxPriceValue)
          : Number(maxTotalPrice),
      isRefundableReturn: Boolean(isRefundableReturn),
      isActive,
      userSegmentations: userSegmentationsValue,
    }

    if (id && data?.data) {
      putSaleVoucherByVoucherId({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id,
        updateVoucherModel: createData,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(phrasesMessages.successUpdate), 'success')
          setSelected(res?.data?.data?.vendorId as string)
          reset(values)
        }
      })
    } else {
      postSaleVoucher({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createVoucherModel: createData,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(phrasesMessages.successAdd), 'success')
          router.push(`edit/${res?.data?.data?.id}`)
        }
      })
    }
  }
  useEffect(() => {
    if (isFetching || data?.data) {
      let userSegmentationValue: userSegmentationType[] = []
      data?.data?.userSegmentations?.forEach((item) => {
        userSegmentationValue?.push({
          id: item,
          name: userSegmentationData?.find((i) => i.id == item)?.name!,
        })
      })
      reset({
        ...(data?.data as IUseReasonFormController),
        vendorId: vendorData?.data?.data?.items?.filter(
          (vendor) => String(vendor?.id) === String(data?.data?.vendorId),
        )[0],
        usageType: {
          id: String(data?.data?.usageType),
          title: String(data?.data?.usageTypeTitle),
        },
        voucherUsageType: {
          id: String(data?.data?.voucherUsageType),
          title: String(data?.data?.voucherUsageTypeTitle),
        },
        providerType: {
          id: String(data?.data?.providerType),
          title: String(data?.data?.providerTypeTitle),
        },
        priceValueType: {
          id: String(data?.data?.priceValueType),
          title: String(data?.data?.priceValueTypeTitle),
        },
        userSegmentations: userSegmentationValue,
      })
      setSelected(data?.data?.vendorId as string)
    }
  }, [isFetching, userSegmentationData])

  useEffect(() => {
    if (id) {
      setIsVendorExpandable(formWatch.providerType?.id == String(VoucherAddEdit.vendor))
    }
  }, [formWatch.providerType?.id])
  return {
    updateISuccess,
    updateILoading,
    createIsSuccess,
    createIsLoading,
    formatMessage,
    formProvider,
    router,
    handleSubmit,
    reset,
    vendor: data?.data?.vendorId,
    stateCode: data?.data?.stateCode,
    getValues,
    setValue,
    isDirty,
    setOpenDialog,
    openDialog,
    handleBackApprove,
    handleBack,
    refetch,
    isValid,
    formWatch,
  }
}
export default UseVoucherCodeDiscountInfoController

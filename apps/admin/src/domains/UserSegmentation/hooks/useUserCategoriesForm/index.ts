import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  GetAdminGeneralDataUserSegmentationByIdApiArg,
  useGetAdminGeneralDataUserSegmentationByIdQuery,
  usePostAdminGeneralDataUserSegmentationMutation,
  usePutAdminGeneralDataUserSegmentationByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ListCreationTypeCodeEnum } from '../../enums/UserCategoriesValidationFormEnum'
import { IUserCategories } from '../../types/IUserCategories'
import { IUserCategoriesFormModel } from '../../types/IUserCategoriesFormModel'

const useUserCategoriesForm = ({ id }: IUserCategories) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const formProvider = useForm<IUserCategoriesFormModel>({ mode: 'all' })
  const router = useRouter()
  const [postAdminGeneralDataUserSegmentation] = usePostAdminGeneralDataUserSegmentationMutation()
  const [putAdminGeneralDataUserSegmentationById] =
    usePutAdminGeneralDataUserSegmentationByIdMutation()

  const { data, refetch, isLoading } = useGetAdminGeneralDataUserSegmentationByIdQuery(
    {
      'client-name': 'admin',
      'client-version': '',
      id: id!,
    },
    { skip: !id },
  )

  const { formatMessage } = useIntl()
  const {
    setValue,
    getValues,
    reset,
    formState: { isDirty, isValid },
  } = formProvider

  const { showToast } = useToast()
  const { listCreationType } = useWatch({
    control: formProvider.control,
  })

  const isManual = listCreationType?.id === ListCreationTypeCodeEnum.Manual

  const handleSubmit = (values: IUserCategoriesFormModel) => {
    const dynamicQueryData = {
      number: values.number,
      name: values.name,
      listCreationType: Number(values?.listCreationType?.id) ?? null,
      collectionId: values?.collectionId?.id,
      hasOutputLimit: values.hasOutputLimit ?? false,
      outputLimit: Number(values?.outputLimit) ?? null,
    }

    const manualData = {
      userTypeCode: Number(values?.userTypeCode?.id) ?? null,
      number: values.number,
      name: values.name,
      listCreationType: Number(values?.listCreationType?.id) ?? null,
      hasOutputLimit: values.hasOutputLimit ?? false,
      outputLimit: Number(values?.outputLimit) ?? null,
    }
    if (id) {
      putAdminGeneralDataUserSegmentationById({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id,
        updateUserSegmentationModel: isManual ? manualData : dynamicQueryData,
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            showToast(formatMessage(phrasesMessages.successUpdate), 'success')
            reset(values)
            refetch()
          }
        })
    } else {
      postAdminGeneralDataUserSegmentation({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createUserSegmentationModel: isManual ? manualData : dynamicQueryData,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(phrasesMessages.successAdd), 'success')
          router.push(`edit/${res?.data?.data?.id}`)
        }
      })
    }
  }

  const handleConfirm = () => {
    setOpenDialog(true)
  }
  const handleApproveBack = () => {
    router.push('/userCategories')
  }

  useEffect(() => {
    if (data?.data) {
      if (id) {
        reset({
          ...(data?.data as GetAdminGeneralDataUserSegmentationByIdApiArg),
          dataSaveTypeCode: {
            id: data?.data?.dataSaveTypeCode?.toString(),
            title: data?.data?.dataSaveTypeCodeTitle,
          },
          userTypeCode: {
            id: data?.data?.userTypeCode?.toString(),
            title: data?.data?.userTypeCodeTitle?.toString(),
          },
          queryResultTypeCode: {
            id: data?.data?.queryResultTypeCode?.toString(),
            title: data?.data?.queryResultTypeCodeTitle,
          },
          interValTypeCode: {
            id: data?.data?.intervalTypeCode?.toString(),
            title: data?.data?.intervalTypeCodeTitle,
          },
          listCreationType: {
            id: data?.data?.listCreationTypeCode?.toString(),
            title: data?.data?.listCreationTypeCodeTitle,
          },
        })
      }
    }
  }, [isLoading])

  return {
    formatMessage,
    formProvider,
    handleSubmit,
    getValues,
    setValue,
    isDirty,
    setOpenDialog,
    openDialog,
    handleConfirm,
    handleApproveBack,
    data,
    refetch,
    isValid,
  }
}

export default useUserCategoriesForm

import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import ReasonManageMentMessages from '@hasty-bazar-admin/domains/reasonManagement/ReasonManageMent.messages'
import { IUseReasonFormController } from '@hasty-bazar-admin/domains/reasonManagement/types/IUseReasonFormController'
import {
  useGetAdminGeneralDataReasonsSettingByIdQuery,
  usePostAdminGeneralDataReasonsSettingMutation,
  usePutAdminGeneralDataReasonsSettingByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
const useReasonFormController = () => {
  const { query, push } = useRouter()
  const id = query.id?.[0]
  const { formatMessage } = useIntl()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const formRef = useRef<HTMLButtonElement>(null)
  const [postAdminGeneralDataReasonsSetting] = usePostAdminGeneralDataReasonsSettingMutation()
  const formProvider = useForm<IUseReasonFormController>({ mode: 'all' })

  const { data, refetch, isFetching } = useGetAdminGeneralDataReasonsSettingByIdQuery(
    {
      'client-name': 'admin',
      'client-version': '',
      id: id!,
    },
    { skip: !id },
  )

  const [putAdminGeneralDataReasonsSetting] = usePutAdminGeneralDataReasonsSettingByIdMutation()
  const { formState, reset } = formProvider
  const { isDirty, isValid } = formState

  const handleBack = () => {
    push('/reasonManagement')
  }

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/reasonManagement',
      title: formatMessage(ReasonManageMentMessages.reasonSetting),
    },
    {
      url: '#',
      title: formatMessage(
        id ? ReasonManageMentMessages.editReasonSetting : ReasonManageMentMessages.addReasonSetting,
      ),
    },
  ]

  const handleSubmit = (values: IUseReasonFormController) => {
    const { userTypeCode, effectOnCustomerGrade } = values
    const data = {
      ...values,
      userTypeCode: Number(userTypeCode?.id),
      effectOnCustomerGrade,
    }
    if (id) {
      putAdminGeneralDataReasonsSetting({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id,
        //@ts-ignore
        updateReasonsSettingModel: data,
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(phrasesMessages.successUpdate),
            type: 'success',
          })
          reset(values)
        }
      })
    } else {
      postAdminGeneralDataReasonsSetting({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        //@ts-ignore
        createReasonsSettingModel: data,
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(phrasesMessages.saveSuccess),
            type: 'success',
          })
          formatMessage(phrasesMessages.saveSuccess)
          push(`edit/${res?.data?.data?.id}`)
        }
      })
    }
  }
  useEffect(() => {
    if (isFetching || data?.data) {
      if (id) {
        reset({
          ...data?.data,
          userTypeCode: {
            id: String(data?.data?.userTypeCode),
            title: String(data?.data?.userTypeCodeTitle),
          },
        })
      }
    }
  }, [isFetching])

  const handleBackApprove = () => {
    formRef.current?.click()
    setOpenDialog(false)
    refetch()
  }
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }
  return {
    formatMessage,
    breadcrumbs,
    formProvider,
    handleSubmit,
    isDirty,
    id,
    handleBackApprove,
    handleBack,
    openDialog,
    setOpenDialog,
    data,
    refetch,
    isValid,
    handleOpenDialog,
    formRef,
  }
}

export default useReasonFormController

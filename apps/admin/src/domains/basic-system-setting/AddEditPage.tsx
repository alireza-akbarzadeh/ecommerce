import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  CreateSystemSettingModel,
  useGetAdminGeneralDataSystemSettingByIdQuery,
  usePostAdminGeneralDataSystemSettingMutation,
  usePutAdminGeneralDataSystemSettingByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import basicSystemSettingMessages from './BasicSystemSetting.messages'
import BasicSystemSettingsForm from './containers/BasicSystemSettingsForm'

export type BasicSystemSettingFormType = CreateSystemSettingModel & {
  id?: string
}

const AddEditPage = () => {
  const router = useRouter()
  const id = router.query.id?.[0]
  const { formatMessage } = useIntl()
  const [addSystemSettings] = usePostAdminGeneralDataSystemSettingMutation()
  const [updateSystemSettings] = usePutAdminGeneralDataSystemSettingByIdMutation()
  const { showToast } = useToast()
  const FormProvider = useForm({ mode: 'all' })

  const { data: systemSettingsData } = useGetAdminGeneralDataSystemSettingByIdQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      id: id!,
    },
    { skip: !id },
  )

  useEffect(() => {
    if (id) {
      FormProvider.reset({
        ...systemSettingsData?.data,
      })
    }
  }, [systemSettingsData])

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/basic-system-setting',
      title: formatMessage(basicSystemSettingMessages.basicSystemSetting),
    },
    {
      url: '#',
      title: id
        ? formatMessage(basicSystemSettingMessages.editBasicSystemSettings)
        : formatMessage(basicSystemSettingMessages.addBasicSystemSettings),
    },
  ]

  const handleSubmit = (data: BasicSystemSettingFormType) => {
    if (id) {
      updateSystemSettings({
        'client-name': 'cms',
        'client-version': 'v1',
        id,
        updateSystemSettingModel: {
          ...data,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(basicSystemSettingMessages.updateSuccess), 'success')
          router.push('/basic-system-setting')
        } else
          showToast(
            errorsToString(res.error) || formatMessage(basicSystemSettingMessages.updateError),
            'error',
          )
      })
    } else {
      addSystemSettings({
        'client-name': 'cms',
        'client-version': 'v1',
        createSystemSettingModel: {
          ...data,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(basicSystemSettingMessages.addSuccess), 'success')
          router.push('/basic-system-setting')
        } else
          showToast(
            errorsToString(res.error) || formatMessage(basicSystemSettingMessages.addError),
            'error',
          )
      })
    }
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(basicSystemSettingMessages.basicSystemSetting)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <HBForm<BasicSystemSettingFormType>
          onSubmit={handleSubmit}
          mode="all"
          defaultValues={{
            // TODO : web services have been changed, need to update this
            // isActive: true,
            id,
          }}
          formProviderProps={id ? FormProvider : undefined}
        >
          <BasicSystemSettingsForm isEditMode={!!id} />
        </HBForm>
      </Box>

      <HBRecordHistory data={systemSettingsData?.data} isBorder isShowAccordion disabled={!id} />
    </>
  )
}
export default AddEditPage

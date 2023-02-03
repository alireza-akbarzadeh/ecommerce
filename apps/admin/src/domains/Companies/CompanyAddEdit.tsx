import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory, HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  useGetAdminIdrOrganizationByIdQuery,
  useGetAdminIdrOrganizationGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useWorkflowInfo,
  useGetAdminIdrOrganizationGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useWorkflowTransitions,
  usePostAdminIdrOrganizationChangeStateMutation as useChangeState,
  usePostAdminIdrOrganizationMutation,
  usePutAdminIdrOrganizationByIdMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { GetGeosQueryResult } from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import companiesMessage from './companies.message'
import { CompanyForm } from './containers'

export type CompanyAddEditPageProps = {
  id?: string
}

export type CompanyAddEditFormType = {
  id?: string
  logoPath?: string | null
  title: string
  organizationType: GetBusinessTypeValuesByBusinessTypeQueryResult
  iBan?: string | null
  nationalCode?: string | null
  economicCode?: string | null
  registerationNo?: string | null
  phoneNo?: string | null
  email?: string | null
  address?: string | null
  provinceId?: GetGeosQueryResult
  cityId?: GetGeosQueryResult
}

const CompanyAddEditPage: FC<CompanyAddEditPageProps> = ({ id }) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/companies',
      title: formatMessage(companiesMessage.companiesTitle),
    },
    {
      url: '#',
      title: id
        ? formatMessage(companiesMessage.companyEdit)
        : formatMessage(companiesMessage.companyAdd),
    },
  ]

  const [addCompany] = usePostAdminIdrOrganizationMutation()
  const [updateCompany] = usePutAdminIdrOrganizationByIdMutation()
  const { data: { data: companyItem } = {}, refetch } = useGetAdminIdrOrganizationByIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: id!,
    },
    { skip: !id },
  )

  const formProvider = useForm<CompanyAddEditFormType>({
    mode: 'all',
  })

  useEffect(() => {
    //@ts-ignore
    formProvider.reset(companyItem)
  }, [companyItem])

  const clearEmptyFields = (values: CompanyAddEditFormType) => {
    Object.keys(values).forEach((key) => {
      //@ts-ignore
      if (values[key] === '') {
        //@ts-ignore
        values[key] = undefined
      }
    })
  }

  const handleAddSubmit = (values: CompanyAddEditFormType) => {
    clearEmptyFields(values)
    addCompany({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      createOrganizationModel: {
        title: values.title,
        address: values?.address,
        cityId: values?.cityId?.id,
        provinceId: values?.provinceId?.id,
        economicCode: values?.economicCode,
        email: values?.email,
        iBan: values?.iBan,
        nationalCode: values?.nationalCode,
        organizationType: values?.organizationType?.id,
        phoneNo: values?.phoneNo,
        registerationNo: values?.registerationNo,
        logoPath: values?.logoPath,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        router.replace('/companies/edit/' + res?.data?.data?.id)
        openToast({
          message: formatMessage(companiesMessage.successfullySaved),
          type: 'success',
        })
      }
    })
  }

  const handleUpdateSubmit = (values: CompanyAddEditFormType) => {
    clearEmptyFields(values)
    updateCompany({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: id!,
      updateOrganizationModel: {
        title: values.title,
        address: values?.address,
        cityId: values?.cityId?.id || (values?.cityId as string),
        provinceId: values?.provinceId?.id || (values?.provinceId as string),
        economicCode: values?.economicCode,
        email: values?.email,
        iBan: values?.iBan,
        nationalCode: values?.nationalCode,
        organizationType: values?.organizationType?.id || (values?.organizationType as string),
        phoneNo: values?.phoneNo,
        registerationNo: values?.registerationNo,
        logoPath: values?.logoPath,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        refetch()
        openToast({
          message: formatMessage(companiesMessage.successfullySaved),
          type: 'success',
        })
      }
    })
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(companiesMessage.companiesTitle)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={20}
        sx={{
          borderRadius: ({ spacing }) => spacing(1),
          border: ({ palette }) => `1px solid ${palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <Stack justifyContent="space-between" direction="row" alignItems="center" mb={8}>
          <Typography variant="h6">{formatMessage(companiesMessage.companiesTitle)}</Typography>
          {id && (
            <HBWorkflow
              entityId={id!}
              factor="1"
              machineCode={StateMachineCode.Company}
              onChangeState={refetch}
              stateCode={companyItem?.stateCode}
              useChangeState={useChangeState}
              useGetState={useWorkflowInfo}
              useGetStateList={useWorkflowTransitions}
            />
          )}
        </Stack>
        <HBForm
          formProviderProps={formProvider}
          onSubmit={id ? handleUpdateSubmit : handleAddSubmit}
        >
          <CompanyForm formProvider={formProvider} handleSubmit={handleAddSubmit} />
        </HBForm>
      </Box>
      <HBRecordHistory data={companyItem} isBorder isShowAccordion disabled={!id} />
    </>
  )
}
export default CompanyAddEditPage

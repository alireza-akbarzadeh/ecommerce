import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  useGetAdminSaleApiPlatformShippingContractByIdQuery,
  usePostAdminSaleApiPlatformShippingContractMutation,
  usePutAdminSaleApiPlatformShippingContractByIdMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBForm } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import Form from './containers/From'
import PlatformCarrierAgrrementsMessages from './PlatformCarrierAgreementSettings.message'
import { VendorShippingAgreementsType } from './types'
interface multiColumnsModel {
  id: string
  providerName: string
  providerShippingStateTitle: string
}

const AddEditPage = () => {
  const router = useRouter()
  const id = router.query.id?.[0]
  const { formatMessage } = useIntl()
  const { showToast } = useToast()
  const FormProvider = useForm({ mode: 'all' })
  const [addSalePlatformShipping] = usePostAdminSaleApiPlatformShippingContractMutation()
  const [updateSalePlatformShipping] = usePutAdminSaleApiPlatformShippingContractByIdMutation()
  const [activeConfirmButton, setActiveConfirmButton] = useState<boolean>(false)

  const {
    data: salePlatformShippingData,
    isLoading: salePlatformShippingDataIsLoading,
    refetch,
  } = useGetAdminSaleApiPlatformShippingContractByIdQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      id: id!,
    },
    { skip: !id },
  )

  useEffect(() => {
    if (id && !salePlatformShippingDataIsLoading) {
      salePlatformShippingData?.data?.applyOnlyOnException
        ? setActiveConfirmButton(true)
        : setActiveConfirmButton(false)
      FormProvider.reset({
        ...salePlatformShippingData?.data,
        shippingAgents: salePlatformShippingData?.data?.shippingAgents?.map((shippingAgent) => ({
          id: shippingAgent?.shippingAgentId,
          providerName: shippingAgent?.shippingAgentTitle,
        })),
        shippingProviders: salePlatformShippingData?.data?.shippingProviders?.map(
          (shippingProvider) => ({
            id: shippingProvider?.shippingProviderId,
            providerName: shippingProvider?.shippingProviderTitle,
          }),
        ),
      })
    }
  }, [salePlatformShippingDataIsLoading, salePlatformShippingData])

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/PlatformCarrierAgreementSettings/',
      title: formatMessage(PlatformCarrierAgrrementsMessages.dataPlatformCarrierAgrrementsMessages),
    },
    {
      url: '#',
      title: id
        ? formatMessage(PlatformCarrierAgrrementsMessages.editPlatformShippingAgreement)
        : formatMessage(PlatformCarrierAgrrementsMessages.addPlatformShippingAgreement),
    },
  ]

  const handleSubmit = (data: VendorShippingAgreementsType) => {
    const model = {
      ...data,
      shippingProviderIds: (data?.shippingProviders as any)?.length
        ? (data?.shippingProviders as any)?.map((item: multiColumnsModel) => item?.id)
        : [],
      shippingAgentIds: (data?.shippingAgents as any)?.length
        ? (data?.shippingAgents as any)?.map((item: multiColumnsModel) => item?.id)
        : [],
      costCoverageAmount: data?.costCoverageAmount ? data?.costCoverageAmount : null,
      maxCostCoveragePrice: data?.maxCostCoveragePrice ? data?.maxCostCoveragePrice : null,
    }

    if (id) {
      updateSalePlatformShipping({
        'client-name': 'cms',
        'client-version': 'v1',
        id,
        //@ts-ignore//
        updatePlatformShippingContractModel: {
          ...model,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(PlatformCarrierAgrrementsMessages.updateSuccess), 'success')
          refetch()
        }
      })
    } else {
      addSalePlatformShipping({
        'client-name': 'cms',
        'client-version': 'v1',
        //@ts-ignore//
        createPlatformShippingContractModel: {
          ...model,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(PlatformCarrierAgrrementsMessages.addSuccess), 'success')
          router.push(`/PlatformCarrierAgreementSettings/edit/${res?.data?.data}`)
        }
      })
    }
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(PlatformCarrierAgrrementsMessages.platformCarrierAgreement)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: ({ spacing }) => spacing(2),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <Typography variant="h5">
          {formatMessage(PlatformCarrierAgrrementsMessages.dataPlatformCarrierAgrrementsMessages)}
        </Typography>
        <HBForm<VendorShippingAgreementsType>
          onSubmit={handleSubmit}
          mode="all"
          formProviderProps={id ? FormProvider : undefined}
        >
          <Form {...{ refetch, activeConfirmButton }} />
        </HBForm>
      </Box>
    </>
  )
}

export default AddEditPage

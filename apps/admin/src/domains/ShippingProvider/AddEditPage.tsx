import { HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  CreateShippingProviderModel,
  useGetAdminSaleApiShippingProvidersByIdQuery,
  usePostAdminSaleApiShippingProvidersMutation,
  usePutAdminSaleApiShippingProvidersByIdMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBForm } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ContractDetailSallowedGeographicLocation from './containers/allowedGeographicLocation/ContractDetails'
import ContractDetailsExceptionCategoryGroup from './containers/exceptionCategoryGroup/ContractDetails'
import ContractDetailsExclusionsOnWorkingDays from './containers/exclusionsOnWorkingDays/ContractDetails'
import Form from './containers/Form'
import useGetGridsTotalCount from './hooks/useGetGridsTotalCount'
import ShippingProviderMessages from './shippingProvider.message'
import CreateAccordionTitle from './components/CreateAccordionTitle'

type ShippingProviderType = CreateShippingProviderModel

const AddEditPage = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { showToast } = useToast()
  const id = router.query.id?.[0]
  const FormProvider = useForm({ mode: 'all' })
  const [shippingProviderAdd] = usePostAdminSaleApiShippingProvidersMutation()
  const [shippingProviderEdit] = usePutAdminSaleApiShippingProvidersByIdMutation()
  const { categoryExceptionsTotalItems, mappingCitiesTotalItems, outOfServiceTotalItems } =
    useGetGridsTotalCount(id!)

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/shippingProvider/',
      title: formatMessage(ShippingProviderMessages.shippingProviderInfo),
    },
    {
      url: '#',
      title: id
        ? formatMessage(ShippingProviderMessages.shippingProviderEdit)
        : formatMessage(ShippingProviderMessages.shippingProviderAdd),
    },
  ]

  const { data: saleShippingProviderData, refetch } = useGetAdminSaleApiShippingProvidersByIdQuery(
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
        ...saleShippingProviderData?.data,
        limitationType: String(saleShippingProviderData?.data?.limitationType),
      })
    }
  }, [saleShippingProviderData])

  const onSubmit = (data: ShippingProviderType) => {
    const {
      commissionAmountInPercent,
      minimumCommissionAmount,
      maximumCommissionAmount,
      onlineServiceURL,
      limitationType,
      logo,
      ...otherData
    } = data

    const model = {
      commissionAmountInPercent: commissionAmountInPercent || null,
      minimumCommissionAmount: minimumCommissionAmount || null,
      maximumCommissionAmount: maximumCommissionAmount || null,
      onlineServiceURL: onlineServiceURL || null,
      limitationType: limitationType || undefined,
      logo: logo || null,
      ...otherData,
    }
    if (id) {
      shippingProviderEdit({
        'client-name': 'cms',
        'client-version': 'v1',
        id,
        updateShippingProviderModel: {
          ...model,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(ShippingProviderMessages.updateSuccess), 'success')
          refetch()
        }
      })
    } else {
      shippingProviderAdd({
        'client-name': 'cms',
        'client-version': 'v1',
        createShippingProviderModel: {
          ...model,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          const currentPageId = res?.data?.data?.id
          showToast(formatMessage(ShippingProviderMessages.addSuccess), 'success')
          router.replace(`/shippingProvider/edit/${currentPageId}`)
        }
      })
    }
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(ShippingProviderMessages.shippingProvider)}
        breadItems={breadcrumbs || []}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <Typography variant="h5">
          {formatMessage(ShippingProviderMessages.shippingProviderInfo)}
        </Typography>
        <HBForm<ShippingProviderType>
          onSubmit={onSubmit}
          mode="all"
          formProviderProps={id ? FormProvider : undefined}
        >
          <Form refetch={refetch} />
        </HBForm>
      </Box>
      {id && (
        <>
          <HBAdminAccordion
            icon="history"
            title={
              <CreateAccordionTitle
                title="exceptionOfTheCommodityGroup"
                totalCount={categoryExceptionsTotalItems!}
              />
            }
          >
            <ContractDetailsExceptionCategoryGroup />
          </HBAdminAccordion>
          <HBAdminAccordion
            icon="history"
            title={
              <CreateAccordionTitle
                title="allowedGeographicLocation"
                totalCount={mappingCitiesTotalItems!}
              />
            }
          >
            <ContractDetailSallowedGeographicLocation />
          </HBAdminAccordion>
          <HBAdminAccordion
            icon="history"
            title={
              <CreateAccordionTitle
                title="calendarOfWorkingDaysExceptions"
                totalCount={outOfServiceTotalItems!}
              />
            }
          >
            <ContractDetailsExclusionsOnWorkingDays />
          </HBAdminAccordion>
        </>
      )}
    </>
  )
}

export default AddEditPage

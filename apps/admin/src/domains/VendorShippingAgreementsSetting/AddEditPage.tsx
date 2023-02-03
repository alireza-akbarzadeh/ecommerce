import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  CreateVendorShippingContract,
  useGetAdminSaleApiVendorShippingContractGetByIdQuery,
  usePostAdminSaleApiVendorShippingContractMutation,
  usePutAdminSaleApiVendorShippingContractByIdMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBForm } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import Form from './containers/From'
import useDataItemsQuery from './hooks/useDataItemsQuery'
import VendorShippingAgrrementsMessages from './VendorShippingAgreements.message'

export type VendorShippingAgreementsType = CreateVendorShippingContract
interface ProductModel {
  hsin: string
  id: string
  name: string
  vendor: string
}

const AddEditPage = () => {
  const router = useRouter()
  const id = router.query.id?.[0]
  const { categoriesIsLoading, productsIsLoading } = useDataItemsQuery()
  const { formatMessage } = useIntl()
  const [addSaleVendorShipping] = usePostAdminSaleApiVendorShippingContractMutation()
  const [updateSaleVendorShipping] = usePutAdminSaleApiVendorShippingContractByIdMutation()
  const { showToast } = useToast()
  const FormProvider = useForm({ mode: 'all' })

  const {
    data: saleVendorShippingData,
    refetch,
    isLoading: saleVendorShippingIsLoading,
  } = useGetAdminSaleApiVendorShippingContractGetByIdQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      id: id!,
    },
    { skip: !id },
  )

  useEffect(() => {
    if (id && !categoriesIsLoading && !productsIsLoading && !saleVendorShippingIsLoading) {
      FormProvider.reset({
        ...saleVendorShippingData?.data,
        productId: saleVendorShippingData?.data?.products?.map((product) => ({
          id: product.productId,
          name: product.productTitle,
          vendor: saleVendorShippingData?.data?.vendorTitle,
        })),
        categoryId: saleVendorShippingData?.data?.categories?.map(
          (categorie) => categorie.categoryId,
        ),
        vendorId: {
          id: saleVendorShippingData?.data?.vendorId,
          fullName: saleVendorShippingData?.data?.vendorTitle,
        },
        ...(saleVendorShippingData?.data?.contractType
          ? { contractType: saleVendorShippingData?.data?.contractType.toString() }
          : { contractType: '1050001' }),
      })
    }
  }, [saleVendorShippingIsLoading, categoriesIsLoading, productsIsLoading, saleVendorShippingData])

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/vendorShippingAgreementSetting/',
      title: formatMessage(VendorShippingAgrrementsMessages.vendorShippingAgreement),
    },
    {
      url: '#',
      title: id
        ? formatMessage(VendorShippingAgrrementsMessages.editVendorShippingAgreement)
        : formatMessage(VendorShippingAgrrementsMessages.addVendorShippingAgreement),
    },
  ]

  const handleSubmit = (data: VendorShippingAgreementsType) => {
    const {
      productId,
      shippingObligationType,
      categoryId,
      minPurchaseAmount,
      costCoverageType,
      coverageAmount,
      shippingCostInOrigin,
      shippingCostInElseWhere,
      vendorId,
      contractType,
      ...otherData
    } = data

    const model = {
      ...otherData,
      productId: productId ? (productId as any).map((item: ProductModel) => item.id) : [],
      vendorId: (vendorId as any)?.id || null,
      shippingObligationType: Number(shippingObligationType) || null,
      categoryId: categoryId ? categoryId.filter((id) => !!id) : [],
      minPurchaseAmount: minPurchaseAmount || null,
      costCoverageType: Number(costCoverageType) || null,
      coverageAmount: coverageAmount || null,
      shippingCostInOrigin: shippingCostInOrigin || null,
      contractType: Number(contractType) || null,
      shippingCostInElseWhere: shippingCostInElseWhere || null,
    }

    if (id) {
      updateSaleVendorShipping({
        'client-name': 'cms',
        'client-version': 'v1',
        id,
        //@ts-ignore
        updateVendorShippingContract: {
          ...model,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(VendorShippingAgrrementsMessages.updateSuccess), 'success')
          refetch()
        }
      })
    } else {
      addSaleVendorShipping({
        'client-name': 'cms',
        'client-version': 'v1',
        //@ts-ignore
        createVendorShippingContract: {
          ...model,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(VendorShippingAgrrementsMessages.addSuccess), 'success')
          router.replace('/vendorShippingAgreementSetting/')
        }
      })
    }
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(VendorShippingAgrrementsMessages.dataVendorShippingAgreement)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: 4,
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <Typography variant="h5">
          {formatMessage(VendorShippingAgrrementsMessages.dataVendorShippingAgreement)}
        </Typography>
        <Typography sx={{ color: 'grey.500' }} mt={6}>
          {formatMessage(VendorShippingAgrrementsMessages.formDescription)}
        </Typography>
        <HBForm<VendorShippingAgreementsType>
          onSubmit={handleSubmit}
          mode="all"
          formProviderProps={id ? FormProvider : undefined}
        >
          <Form refetch={refetch} />
        </HBForm>
      </Box>
    </>
  )
}

export default AddEditPage

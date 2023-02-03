import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { CommissionBusinessType } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { format } from 'date-fns'
import {
  useGetAdminCatalogCommissionByIdQuery,
  usePostAdminCatalogCommissionMutation,
  usePutAdminCatalogCommissionByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBForm } from '@hasty-bazar/core'
import { Box, Grid, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ComissionSettingMessages from './CommissionSetting.message'
import FormHeader from './components/FormHeader'
import { CommissionAddEditForm } from './containers'
import { CommissionAddEditFormType } from './types'

const CommissionAddEditPage: FC = () => {
  const router = useRouter()
  const id = router.query.id?.[0]
  const { formatMessage } = useIntl()
  const FormProvider = useForm<CommissionAddEditFormType>()
  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(ComissionSettingMessages.dashboard),
    },
    {
      url: '/commissionSetting',
      title: formatMessage(ComissionSettingMessages.commissionSetting),
    },
    {
      url: '#',
      title: id
        ? formatMessage(ComissionSettingMessages.editCommissionSetting)
        : formatMessage(ComissionSettingMessages.addCommissionSetting),
    },
  ]
  const { showToast } = useToast()
  const [postCommission] = usePostAdminCatalogCommissionMutation()
  const { data: { data } = {}, refetch } = useGetAdminCatalogCommissionByIdQuery(
    {
      'client-name': '',
      'client-version': '',
      id: id as string,
    },
    { skip: !id },
  )

  const [putCommission] = usePutAdminCatalogCommissionByIdMutation()
  const handleSubmit = async (values: CommissionAddEditFormType) => {
    const createUpdateModel = {
      ...(values.startDate ? { startDate: values?.startDate } : {}),
      endDate: values.endDate ? values?.endDate : null,
      categoryId: values.categoryId === '' ? null : values.categoryId,
      productId: (values.productId as any)?.id === '' ? null : (values.productId as any)?.id!,
      vendorId: values.vendorId?.id === '' ? null : (values.vendorId as any)?.id!,
      brandId: values?.brandId === '' ? null : values.brandId!,
      commissionType: Number(values?.commissionType),
      settlementDays: Number(values?.settlementDays),
      calculationType: values?.calculationType,
      minCommissionPrice: values?.minCommissionPrice ? values.minCommissionPrice : null,
      maxCommissionPrice: values.maxCommissionPrice ? values.maxCommissionPrice : null,
      targetValue: values.targetValue,
      description: values?.description ? values?.description : null,
      isOriginalPriceUsedForCommission:
        values?.commissionType?.toString() === CommissionBusinessType.Seller.toString()
          ? values?.isOriginalPriceUsedForCommission
          : null,
      isVatDeductedFromCommission:
        values?.commissionType?.toString() === CommissionBusinessType.Seller.toString()
          ? values?.isVatDeductedFromCommission
          : null,
    }
    if (!id) {
      postCommission({
        'client-name': '',
        'client-version': '',
        createCommissionModel: createUpdateModel,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(phrasesMessages.successAdd), 'success')
          router.replace('/commissionSetting')
        }
      })
    } else {
      putCommission({
        'client-name': 'update-commission',
        'client-version': '1.0.0',
        updateCommissionModel: createUpdateModel,
        id: id!,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(phrasesMessages.successUpdate), 'success')
          router.replace('/commissionSetting')
        }
      })
    }
  }

  useEffect(() => {
    if (id) {
      //@ts-ignore
      FormProvider.reset({
        ...data,
        number: data?.number!,
        brandId: data?.brandId!,
        productId: {
          id: data?.productId!,
          name: data?.productTitle!,
        },
        vendorId: {
          id: data?.vendorId!,
          fullName: data?.vendorTitle!,
        },
        categoryId: data?.categoryId!,
        isOriginalPriceUsedForCommission: data?.isOriginalPriceUsedForCommission ?? false,
        isVatDeductedFromCommission: data?.isVatDeductedFromCommission ?? false,
      })
    }
  }, [data])

  return (
    <Box display="flex" justifyContent="space-between">
      <Grid container>
        <Grid item xs={12}>
          <BreadCrumbSection
            title={formatMessage(ComissionSettingMessages.commissionSetting)}
            breadItems={breadcrumbs}
          />
          <Box
            bgcolor="common.white"
            px={8}
            pt={6}
            pb={10}
            borderRadius={4}
            sx={{
              width: 1,
              border: (theme) => `1px solid ${theme.palette.grey[200]}`,
              minHeight: 300,
            }}
          >
            <Stack spacing={4}>
              <HBForm<CommissionAddEditFormType>
                onSubmit={handleSubmit}
                mode="all"
                formProviderProps={id ? FormProvider : undefined}
              >
                <FormHeader {...{ id }} {...{ refetch }} />
                <CommissionAddEditForm />
              </HBForm>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
export default CommissionAddEditPage

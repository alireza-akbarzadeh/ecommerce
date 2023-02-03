import HBSelectController from '@hasty-bazar-commerce/containers/HBSelectController'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { FormPatternsEnums } from '@hasty-bazar-commerce/core/enums'
import { useGetWebCatalogCategoriesGetAllCategoriesForCommerceQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { usePostWebIdrCommercesVendorRequestMutation } from '@hasty-bazar-commerce/services/idrApi.generated'
import {
  useGetWebLocalityIranByProvinceIdQuery,
  useGetWebLocalityIranQuery,
} from '@hasty-bazar-commerce/services/localityApi.generated'
import { HBButton, HBForm, HBFormItemTextField, openToast } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import sellerLandingMessages from '../../SellerLanding.messages'
import { RowSection } from './sellerRegistration.style'
import { SellerRegisterationType } from './types'

function Form() {
  const contentFormProvider = useForm<SellerRegisterationType>({ mode: 'all' })
  const { isValid } = contentFormProvider.formState
  const { formatMessage } = useIntl()

  const { data: { data: { items = [] } = {} } = {}, isLoading } =
    useGetWebCatalogCategoriesGetAllCategoriesForCommerceQuery({
      ...ApiConstants,
      pageNumber: 0,
      pageSize: 10000,
      ordering: 'DisplaySortTypeCode',
    })

  const { data: provincesData } = useGetWebLocalityIranQuery({
    ...ApiConstants,
  })

  const { data: { data: { items: cities = [] } = {} } = {} } =
    useGetWebLocalityIranByProvinceIdQuery(
      {
        ...ApiConstants,
        provinceId: provincesData?.data?.items?.[5]?.id || ' ',
      },
      {
        skip: !provincesData,
      },
    )

  const [addVendorRequest] = usePostWebIdrCommercesVendorRequestMutation()

  const handleSubmit = (values: SellerRegisterationType) => {
    const categoryName = items?.find((x) => x.id === values.categoryName)?.name
    const cityName = cities?.find((x) => x.id === values.cityName)?.title
    addVendorRequest({
      ...ApiConstants,
      registerVendorRequestModel: {
        ...values,
        categoryName,
        cityName,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        openToast({
          message: formatMessage(sellerLandingMessages.successAdd),
          type: 'success',
        })
        contentFormProvider.reset({
          categoryName: '',
          cityName: '',
          contactPhone: '',
          fullName: '',
        })
        contentFormProvider.clearErrors()
      }
    })
  }

  return (
    <HBForm<SellerRegisterationType>
      formProviderProps={contentFormProvider}
      onSubmit={handleSubmit}
      mode="all"
    >
      <Typography mb={8} variant="h6">
        {formatMessage(sellerLandingMessages.enterYourInfo)}
      </Typography>
      <RowSection mb={8}>
        <Stack flex={1}>
          <HBFormItemTextField
            fullWidth
            required
            formName={'fullName'}
            label={formatMessage(sellerLandingMessages.fullName)}
            rules={{
              required: {
                value: true,
                message: formatMessage(sellerLandingMessages.fullNameError),
              },
            }}
            autoComplete={'off'}
          />
        </Stack>
        <Stack flex={1}>
          <HBSelectController
            label={formatMessage(sellerLandingMessages.cityName)}
            name={'cityName'}
            required
            menuItem={
              cities?.map((item) => ({
                title: item.title,
                value: item.id,
              })) || []
            }
            disabled={false}
            formRules={{ required: true }}
          />
        </Stack>
      </RowSection>
      <RowSection>
        <Stack flex={1}>
          <HBFormItemTextField
            fullWidth
            required
            formName={'contactPhone'}
            type="number"
            helperTextType="helperText"
            label={formatMessage(sellerLandingMessages.contactPhone)}
            rules={{
              required: {
                value: true,
                message: formatMessage(sellerLandingMessages.contactPhoneError),
              },
              pattern: {
                value: new RegExp(FormPatternsEnums.PhoneNumber),
                message: formatMessage(sellerLandingMessages.contactPhoneIsWrong),
              },
            }}
            autoComplete={'off'}
          />
        </Stack>
        <Stack flex={1}>
          <HBSelectController
            label={formatMessage(sellerLandingMessages.categoryName)}
            name={'categoryName'}
            required
            menuItem={
              items
                ?.filter((x) => x.parentId === null)
                ?.map((item) => ({
                  title: item?.name,
                  value: item?.id,
                  iconPath: item?.iconPath,
                })) || []
            }
            disabled={false}
            formRules={{ required: true }}
          />
        </Stack>
      </RowSection>
      <Stack mt={6} direction="row-reverse">
        <HBButton variant="contained" loading={isLoading} disabled={!isValid} type="submit">
          {formatMessage(sellerLandingMessages.submitButton)}
        </HBButton>
      </Stack>
    </HBForm>
  )
}

export default Form

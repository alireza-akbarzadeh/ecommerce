import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import {
  ApiResult,
  CreateSimpleProductResultApiResult,
  useGetAdminCatalogCategoriesByIdAcceptionsQuery,
  useGetAdminCatalogCategoriesProductCategoryQuery,
  useGetAdminCatalogConfigurableProductsByIdQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery,
  useGetAdminGeneralDataCurrencyGetAllQuery,
  useGetAdminGeneralDataTaxTypesGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { removeEmptyFields } from '@hasty-bazar/admin-shared/utils'
import { openToast } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { FieldValues, useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import {
  useGetAdminCatalogApiUnitOfMeasurementGetAllQuery,
  useGetAdminCatalogSimpleProductsByIdQuery,
} from '../../../catalogApi.enhanced'
import AddSimpleProductMessages from './AddProduct.messages'

const FORM_ID = 'addProductForm'
const WEIGHT_TYPE_CODE = 1002002
const PUBLISH_STATE_CODE = '2'
const PAGE_SIZE = 10000

const PRODUCT_ORIGIN_BUSINESS_TYPE_ID = '1031'

interface Props<DataType, ResponseType> {
  updateProduct: (values: DataType) => Promise<ResponseType>
  createProduct: (values: DataType) => Promise<ResponseType>
}
function useProductRequirementData<DataType extends FieldValues = any, ResponseType = any>({
  createProduct,
  updateProduct,
}: Props<DataType, ResponseType>) {
  const router = useRouter()
  const productType = getProductType(router.pathname)
  const id = router.query?.id as string
  const action = router.query?.action as string

  const queryArgs = {
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    id,
  }
  const options = {
    skip: !id,
  }
  const {
    data: productData,
    refetch,
    isLoading,
  } = productType === 'configurable'
    ? useGetAdminCatalogConfigurableProductsByIdQuery(queryArgs, options)
    : useGetAdminCatalogSimpleProductsByIdQuery(queryArgs, options)

  const [tags, setTags] = useState<string[]>([])
  const { formatMessage } = useIntl()

  const formProviderProps = useForm<any>({
    mode: 'all',
    defaultValues: {
      sku: '',
      name: '',
    },
  })

  const { categoryId, weight, vendorId, unitOfMeasureId } = useWatch({
    control: formProviderProps.control,
  })

  const { data: { data: { items: productCondition = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      businessTypeId: '1019',
    })

  const categoryAcceptingItemsLoading = useGetAdminCatalogCategoriesByIdAcceptionsQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: String(categoryId),
      pageSize: PAGE_SIZE,
      pageNumber: 1,
    },
    { skip: !categoryId },
  )

  const { data: { data: { items: productGroup = [] } = {} } = {} } =
    useGetAdminCatalogCategoriesProductCategoryQuery({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      pageSize: PAGE_SIZE,
    })

  const { data: { data: { items: productOrigin = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      businessTypeId: PRODUCT_ORIGIN_BUSINESS_TYPE_ID,
    })

  const { data: { data: { items: unitMeasurement = [] } = {} } = {} } =
    useGetAdminCatalogApiUnitOfMeasurementGetAllQuery({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      pageSize: PAGE_SIZE,
    })

  const { data: { data: { items: currencies = [] } = {} } = {} } =
    useGetAdminGeneralDataCurrencyGetAllQuery({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
    })

  const { data: { data: { items: taxTypes = [] } = {} } = {} } =
    useGetAdminGeneralDataTaxTypesGetAllQuery({
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
      'client-version': '1.0.1.100',
    })

  const handleSubmit = async (values: DataType) => {
    const postModel: Nullable<DataType> = {
      ...values,
      tags: String(tags.join(',')),
    }
    if (action === 'edit') {
      try {
        const putResult = await updateProduct(removeEmptyFields(postModel))
        const putResultSuccess = ((putResult as any)?.data as ApiResult)?.success
        if (putResultSuccess) {
          openToast({
            message: formatMessage(AddSimpleProductMessages.successPut),
            type: 'success',
          })
          if (productType === 'configurable') {
            router.push(`/products/${productType}-product/edit/duplication-settings/${id}`)
          } else {
            router.push(`/products/${productType}-product/edit/content-settings/${id}`)
          }
        }
      } catch {}

      return
    }

    try {
      const res = await createProduct(removeEmptyFields(postModel))

      const id = ((res as any)?.data as CreateSimpleProductResultApiResult).data?.id

      if (id) {
        openToast({
          message: formatMessage(AddSimpleProductMessages.successPost),
          type: 'success',
        })
        if (productType === 'simple') {
          router.push(`/products/${productType}-product/edit/content-settings/${id}`)
        } else {
          router.push(`/products/${productType}-product/edit/duplication-settings/${id}`)
        }
      }
    } catch (error) {}
  }

  const categoryAcceptingItems =
    categoryAcceptingItemsLoading.data?.data?.items?.map(({ valueName, valueCode }) => ({
      title: valueName!,
      value: Number(valueCode)!,
    })) || []

  const productConditionItems = useMemo(
    () =>
      categoryAcceptingItems.length
        ? categoryAcceptingItems
        : productCondition?.map(({ id, title }) => ({
            value: Number(id!),
            title: title!,
          })),
    [categoryAcceptingItems, productCondition],
  )

  const unitMeasurementItems = useMemo(() => {
    const __unitMeasurement = unitMeasurement
      ?.filter((item) => item.stateCode === PUBLISH_STATE_CODE)
      ?.filter(({ measuringUnitType }) => measuringUnitType === WEIGHT_TYPE_CODE)
    __unitMeasurement?.sort((current, next) => {
      if (current?.displaySort! > next?.displaySort!) return 1
      else return -1
    })

    const _unitMeasurement =
      __unitMeasurement?.map(({ name, id }) => ({
        title: name!,
        value: id!,
      })) || []

    if (_unitMeasurement?.length && !unitOfMeasureId) {
      formProviderProps.setValue(
        'unitOfMeasureId',
        __unitMeasurement?.find((unit) => unit.isBaseUnit === true)?.id,
      )
    }
    return _unitMeasurement
  }, [unitMeasurement])

  const productState: EnumFormHeaderStatus = productData?.data?.productStatus!
  const disabled =
    action === 'edit' &&
    (productState === EnumFormHeaderStatus.ConfirmationOfContent ||
      productState === EnumFormHeaderStatus.published ||
      productState === EnumFormHeaderStatus.disable)
  const { name, originalPrice } = useWatch({
    control: formProviderProps.control,
  })
  const hasData = !!name
  const disabledFinalPrice = !originalPrice
  useEffect(() => {
    if (productData) {
      const { tags, ...restData } = productData.data || {}
      if (!hasData) {
        formProviderProps.reset(restData)
      }
      if (tags) {
        setTags(tags.split(','))
      }
    }
  }, [productData, productCondition, productOrigin, currencies, taxTypes, hasData])

  const defaultCurrencyTitle = useAppSelector((state) => String(state.app.defaultCurrencyTitle))

  const foundCurrency = useMemo(
    () => currencies?.find((item) => item.name === defaultCurrencyTitle)?.id,
    [defaultCurrencyTitle, currencies],
  )
  useEffect(() => {
    if (foundCurrency) {
      formProviderProps.setValue('currencyId', foundCurrency)
    }
  }, [foundCurrency])
  return {
    formProviderProps: formProviderProps as UseFormReturn<DataType, any>,
    handleSubmit,
    disabled,
    disabledFinalPrice,
    productGroup,
    tags,
    setTags,
    weight,
    productConditionItems,
    unitMeasurementItems,
    taxTypes,
    currencies,
    productOrigin,
    productType,
    action,
    FORM_ID,
    vendorId,
    defaultCurrencyTitle,
    id,
    productData,
    isLoading,
    categoryId,
    unitOfMeasureId,
    refetch,
    productCondition,
    unitMeasurement,
    categoryAcceptingItemsLoading,
  }
}

export default useProductRequirementData

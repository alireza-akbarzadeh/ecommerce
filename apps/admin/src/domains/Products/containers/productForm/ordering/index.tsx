import {
  useGetAdminCatalogConfigurableProductsByIdOrderInventorySettingQuery,
  useGetAdminCatalogSimpleProductsByIdOrderInventorySettingQuery,
  usePutAdminCatalogConfigurableProductsByIdGroupEditingChildrenOrderInventorySettingMutation,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  usePutAdminCatalogConfigurableProductsByIdOrderInventorySettingMutation,
  usePutAdminCatalogSimpleProductsByIdOrderInventorySettingMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { removeEmptyFields } from '@hasty-bazar/admin-shared/utils'
import { HBForm } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ProductFormContainer from '../../productFormContainer'
import InventoryDataGrid from './inventoryDataGrid'
import OrderingMessages from './Ordering.messages'
import OrderValueStockControlValue from './orderValueStockControlValue'
import OrderValueStockControlValueMessages from './orderValueStockControlValue/OrderValueStockControlValue.messages'
import ProductPriceSetting from './productPriceSetting'

export type OrderValueStockControlValueInterface = Partial<{
  maximalPerOrder: number
  maximalSellWithoutInventory: number
  minimalForAlert: number
  minimalPerOrder: number
  multiplesOrder: number
  numberForShowCountInventory: number
  saveForAllChildren: boolean
}>

export const INVENTORY_FORM_ID = 'orderValueStockControlValue'
function Ordering() {
  const { query: { id: slugId } = {} } = useRouter()
  const router = useRouter()

  const defaultExpanded = router.asPath.includes(INVENTORY_FORM_ID)
  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType

  const { showToast } = useToast()

  const [addOrderInventorySetting] =
    productType === 'simple'
      ? usePutAdminCatalogSimpleProductsByIdOrderInventorySettingMutation()
      : usePutAdminCatalogConfigurableProductsByIdOrderInventorySettingMutation()

  const { formatMessage } = useIntl()

  const queryArgs = {
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    id: String(slugId),
  }

  const { data: { data: orderInventorySetting = {} } = {} } =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdOrderInventorySettingQuery(queryArgs)
      : useGetAdminCatalogConfigurableProductsByIdOrderInventorySettingQuery(queryArgs)

  const [groupEdit, groupEditStates] =
    usePutAdminCatalogConfigurableProductsByIdGroupEditingChildrenOrderInventorySettingMutation()
  const hasEditData = useMemo(
    () => Object.keys(removeEmptyFields(orderInventorySetting || {})).length > 0,
    [orderInventorySetting],
  )

  useEffect(() => {
    if (orderInventorySetting && hasEditData) {
      Object.keys(orderInventorySetting).forEach((key) => {
        if (orderInventorySetting) {
          if (key === 'multiplesOrder') {
            formProviderProps.setValue(key, orderInventorySetting[key] || 1)
          } else
            formProviderProps.setValue(
              key as keyof OrderValueStockControlValueInterface,
              orderInventorySetting[key as keyof typeof orderInventorySetting] as number,
            )
        }
      })
    }
  }, [orderInventorySetting])

  const handleSubmit = async ({
    saveForAllChildren,
    ...values
  }: OrderValueStockControlValueInterface) => {
    const setOrderAndInventorySettingModel = values

    try {
      if (saveForAllChildren) {
        await groupEdit({
          'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
          'client-version': '1',
          id: router.query?.parentId as string,
          setOrderAndInventorySettingModel,
        }).unwrap()
      } else {
        await addOrderInventorySetting({
          'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
          'client-version': '1.0.1.100',
          id: String(slugId),
          setOrderAndInventorySettingModel,
        }).unwrap()
      }

      showToast(formatMessage(OrderValueStockControlValueMessages.successPost), 'success')
    } catch {
      formProviderProps.reset({})
    }
  }

  const formProviderProps = useForm<OrderValueStockControlValueInterface>({
    mode: 'onChange',
    defaultValues: {
      multiplesOrder: 1,
    },
  })

  const statusLabel = hasEditData ? '1' : '0'

  const isDisabled = productType === 'configurable'
  const disabled = formProviderProps.formState.isValid === false || groupEditStates.isLoading
  return (
    <ProductFormContainer withDetails>
      <ProductPriceSetting />

      <InventoryDataGrid />

      <ProductExplanation
        disabled={isDisabled}
        defaultExpanded={defaultExpanded}
        summaryProps={{
          title: formatMessage(OrderingMessages.orderValueStockControlValue),
          icon: 'setting',
          statusLabel,

          submitButton: true,
          submitButtonProps: {
            onClick: disabled ? undefined : formProviderProps.handleSubmit(handleSubmit),
            tooltipTitle: formatMessage(OrderingMessages.saveForOneRecord),
          },
          groupSubmitButtonProps:
            defaultProductType !== productType
              ? {
                  onClick: disabled
                    ? undefined
                    : formProviderProps.handleSubmit((data) =>
                        handleSubmit({
                          ...data,
                          saveForAllChildren: true,
                        }),
                      ),
                  tooltipTitle: formatMessage(OrderingMessages.saveForAllRecords),
                }
              : undefined,
        }}
      >
        <HBForm<OrderValueStockControlValueInterface>
          formProviderProps={formProviderProps}
          onSubmit={() => {}}
          id={INVENTORY_FORM_ID}
        >
          <OrderValueStockControlValue hasEditData={hasEditData} />
        </HBForm>
      </ProductExplanation>
    </ProductFormContainer>
  )
}

export default Ordering

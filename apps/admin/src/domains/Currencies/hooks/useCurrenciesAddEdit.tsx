import { currenciesMessage } from '@hasty-bazar-admin/domains/Currencies/Currencies.message'
import {
  useGetAdminGeneralDataCurrencyGetAllQuery,
  usePostAdminGeneralDataCurrencyMutation,
  usePutAdminGeneralDataCurrencyByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { openToast } from '@hasty-bazar/core'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { AddEditStatusOneProps, CurrenciesAddEditProps } from '../types/types'

const useCurrenciesAddEdit = (props: AddEditStatusOneProps) => {
  const { open, onClose, id, onSave } = props
  const { formatMessage } = useIntl()

  const { data: { data: { items: stateRow = [] } = {} } = {} } =
    useGetAdminGeneralDataCurrencyGetAllQuery(
      {
        'client-name': 'admin',
        'client-version': '1.0.0',
        id,
        filter: 'Id_Equal_--Id',
      },
      { skip: !id, refetchOnMountOrArgChange: true },
    )

  const contentFormProvider = useForm<CurrenciesAddEditProps>({
    mode: 'all',
  })

  const { isDirty, isValid } = contentFormProvider.formState
  const [addState, { isLoading: isLoadingAdd }] = usePostAdminGeneralDataCurrencyMutation()
  const [updateState, { isLoading: isLoadingUpdate }] = usePutAdminGeneralDataCurrencyByIdMutation()

  useEffect(() => {
    if (id) {
      contentFormProvider.reset({
        id: stateRow?.[0]?.id!,
        name: stateRow?.[0]?.name!,
        latinName: stateRow?.[0]?.latinName!,
        code: stateRow?.[0]?.code!,
        symbol: { id: stateRow?.[0]?.symbol!, symbol: stateRow?.[0]?.symbol! },
        isActive: stateRow?.[0]?.isActive!,
        isDefault: stateRow?.[0]?.isDefault!,
        conversionFactor: +stateRow?.[0]?.conversionFactor!,
        numberOfDecimal: +stateRow?.[0]?.numberOfDecimal!,
        tradingCurrency: stateRow?.[0]?.tradingCurrency!,
      })
    }
  }, [id, stateRow])

  const handleSubmit = (values: CurrenciesAddEditProps) => {
    if (!id) {
      handleSave(values)
    } else {
      handleEdit(values)
    }
  }

  const handleSave = (values: CurrenciesAddEditProps) => {
    addState({
      'client-name': 'hasty-bazar',
      'client-version': '1.0.0',
      createCurrencyModel: {
        ...values,
        symbol: values?.symbol?.id!,
        isActive: true,
      },
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          openToast({
            message: formatMessage(currenciesMessage.addSuccess),
            type: 'success',
          })
          onSave()
        }
      })
  }

  const handleEdit = (values: CurrenciesAddEditProps) => {
    updateState({
      'client-name': 'hasty-bazar',
      'client-version': '1.0.0',
      id: String(id),
      updateCurrencyModel: {
        ...values,
        symbol: values?.symbol?.id!,
      },
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          openToast({
            message: formatMessage(currenciesMessage.updateSuccess),
            type: 'success',
          })
          onSave()
        }
      })
  }

  const handleCancel = () => {
    contentFormProvider.reset()
    onClose()
  }

  return {
    id,
    stateRow,
    formatMessage,
    open,
    handleCancel,
    contentFormProvider,
    handleSubmit,
    isDirty,
    isValid,
    isLoadingAdd,
    isLoadingUpdate,
  }
}

export default useCurrenciesAddEdit

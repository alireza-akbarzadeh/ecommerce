import useGetMinimal from '@hasty-bazar-commerce/core/hook/useGetMinimal'
import { usePostWebSaleOrdersReshoppingMutation } from '@hasty-bazar-commerce/services/saleApi.generated'
import { openToast } from '@hasty-bazar/core'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import HooksMessages from './hooks.messages'

const useReshopping = () => {
  const { refetch: refetchMinimal } = useGetMinimal()
  const { formatMessage } = useIntl()

  const [reshoppingMutation, { isLoading: addingToBasketLoading, data: reshoppingData }] =
    usePostWebSaleOrdersReshoppingMutation()

  useEffect(() => {
    if (!reshoppingData?.success) return
    refetchMinimal()
    openToast({
      message: formatMessage({ ...HooksMessages.buyOrderSuccess }),
      type: 'success',
      vertical: 'top',
    })
  }, [reshoppingData])
  return { reshoppingMutation, addingToBasketLoading, reshoppingData }
}

export default useReshopping

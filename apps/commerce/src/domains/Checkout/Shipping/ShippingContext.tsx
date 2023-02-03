import { ShippingMethodTypeEnum } from '@hasty-bazar-commerce/core/enums'
import {
  Inquiry,
  ShoppingCartShipmentPriceResponse,
  ShoppingCartSummaryDto,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { createContext, ReactNode, useContext, useState } from 'react'

interface IShippingProvider {
  children: ReactNode
}

type ShippingContextType = {
  openCreateDialog: boolean
  inquiries: Inquiry[] | null
  shippingMethod: ShippingMethodTypeEnum
  shippingSummary: ShoppingCartSummaryDto | null
  setShippingMethod: (method: ShippingMethodTypeEnum) => void
  setShippingBundle: (shippingData: ShoppingCartShipmentPriceResponse) => void
  addNewAddress: () => void
  closeCreateAddressModal: () => void
  handleChangeDeliveryTime: (bundleId: string, frameId: string) => void
}

const ShippingContextDefaultValues: ShippingContextType = {
  openCreateDialog: false,
  inquiries: null,
  shippingMethod: ShippingMethodTypeEnum.Total,
  shippingSummary: null,
  setShippingMethod: () => {},
  setShippingBundle: () => {},
  addNewAddress: () => {},
  closeCreateAddressModal: () => {},
  handleChangeDeliveryTime: () => {},
}

const ShippingContext = createContext<ShippingContextType>(ShippingContextDefaultValues)

export function ShippingProvider({ children }: IShippingProvider) {
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodTypeEnum>(
    ShippingMethodTypeEnum.Total,
  )
  const [shippingBundle, setShippingBundle] = useState<ShoppingCartShipmentPriceResponse | null>(
    null,
  )
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false)

  const handleChangeDeliveryTime = (bundleId: string, frameId: string) => {
    const newShippingBundle = JSON.parse(
      JSON.stringify(shippingBundle),
    ) as ShoppingCartShipmentPriceResponse
    const bundle = newShippingBundle?.inquiries?.find((bundle) => bundle.bundleId === bundleId)
    const bundleProvider = bundle?.providers?.find((provider) => provider.isDefault)

    let providerTimeSheet = bundleProvider?.deliveryTimes?.flatMap((providerTimeSheet) => {
      const newDeliveryTimeFrame = providerTimeSheet?.deliveryTimeFrames?.map((timeTable) => ({
        ...timeTable,
        isDefault: false,
      }))
      return {
        ...providerTimeSheet,
        deliveryTimeFrames: newDeliveryTimeFrame,
      }
    })
    providerTimeSheet?.forEach((timeFrame) => {
      const timeOption = timeFrame.deliveryTimeFrames?.map((item) => {
        if (item.id === frameId) {
          item.isDefault = true
        }
        return item
      })
      return timeOption
    })
    bundleProvider!.deliveryTimes = providerTimeSheet
    setShippingBundle(newShippingBundle)
  }

  const addNewAddress = () => {
    setOpenCreateDialog(true)
  }
  const closeCreateAddressModal = () => {
    setOpenCreateDialog(false)
  }

  const value: ShippingContextType = {
    handleChangeDeliveryTime,
    openCreateDialog,
    addNewAddress,
    closeCreateAddressModal,
    shippingMethod,
    setShippingMethod,
    setShippingBundle,
    shippingSummary: shippingBundle?.summaryCart || null,
    inquiries: shippingBundle?.inquiries || null,
  }

  return <ShippingContext.Provider value={value}>{children}</ShippingContext.Provider>
}

export function useShipping() {
  return useContext(ShippingContext)
}

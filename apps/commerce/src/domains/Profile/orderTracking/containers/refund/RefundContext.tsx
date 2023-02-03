import { CommerceDetailOrderItem } from '@hasty-bazar-commerce/services/saleApi.generated'
import React, { createContext, FC, PropsWithChildren, useState } from 'react'

interface IAllRefundationProps {
  orderId: string
  refundReason: string
  complaint: string
  formValidation?: boolean
}

export interface IRefundedProductFile {
  link: string
  preview?: string
  type: 'video' | 'image'
}

export interface IRefundedProduct extends Required<Pick<CommerceDetailOrderItem, 'quantity'>> {
  productId: string
  refundedCount?: number
  refundReason?: string
  complaint?: string
  files?: IRefundedProductFile[]
  formValidation?: boolean
}

interface IProductRefundationProps {
  orderId: string
  refundedProducts: IRefundedProduct[]
}

interface RefundationStateProps {
  allRefundation: IAllRefundationProps | null
  productRefundation: IProductRefundationProps | null
  products: CommerceDetailOrderItem[]
}

const ConsignmentCancelationStateContext = createContext<RefundationStateProps>({
  allRefundation: null,
  productRefundation: null,
  products: [],
})
const RefundUpdaterContext = createContext<{
  setAllRefundation: (value: IAllRefundationProps | null) => void
  setProductRefundation: (value: IProductRefundationProps | null) => void
  setProducts: (value: CommerceDetailOrderItem[]) => void
}>({
  setAllRefundation: () => {},
  setProductRefundation: () => {},
  setProducts: () => {},
})

const RefundProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [allRefundation, setAllRefundation] = useState<IAllRefundationProps | null>(null)
  const [productRefundation, setProductRefundation] = useState<IProductRefundationProps | null>(
    null,
  )
  const [products, setProducts] = useState<CommerceDetailOrderItem[]>([])
  return (
    <ConsignmentCancelationStateContext.Provider
      value={{
        allRefundation,
        productRefundation,
        products,
      }}
    >
      <RefundUpdaterContext.Provider
        value={{
          setProducts,
          setAllRefundation,
          setProductRefundation,
        }}
      >
        {children}
      </RefundUpdaterContext.Provider>
    </ConsignmentCancelationStateContext.Provider>
  )
}

function useRefund() {
  const consignmentCancelation = React.useContext(ConsignmentCancelationStateContext)
  if (typeof consignmentCancelation === 'undefined') {
    throw new Error('useConsignmentCancelation must be used within a provider')
  }
  return consignmentCancelation
}

function useRefundUpdater() {
  const setConsignmentCancel = React.useContext(RefundUpdaterContext)
  if (typeof setConsignmentCancel === 'undefined') {
    throw new Error('useRefundUpdater must be used within a provider')
  }
  const setAllRefundation = (value: IAllRefundationProps) => {
    setConsignmentCancel.setAllRefundation({ ...value })
    setConsignmentCancel.setProductRefundation(null)
  }

  const setProductRefundation = (value: IProductRefundationProps) => {
    setConsignmentCancel.setProductRefundation({ ...value })
    setConsignmentCancel.setAllRefundation(null)
  }

  const setProducts = (value: CommerceDetailOrderItem[]) => {
    setConsignmentCancel.setProducts([...value])
  }
  return { setAllRefundation, setProductRefundation, setProducts }
}

const setAllRefundationInitialValue = (orderId: string) => {
  return {
    complaint: '',
    orderId,
    refundReason: '',
  } as IAllRefundationProps
}

export { RefundProvider, useRefundUpdater, useRefund, setAllRefundationInitialValue }

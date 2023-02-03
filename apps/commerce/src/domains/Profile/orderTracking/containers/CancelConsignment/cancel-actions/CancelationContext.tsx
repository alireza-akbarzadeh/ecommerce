import { CommerceDetailOrderItem } from '@hasty-bazar-commerce/services/saleApi.generated'
import React, { createContext, FC, PropsWithChildren, useState } from 'react'

interface IAllCancelationProps {
  shoppingCartId: string
  cancelationReason: string
}

export interface IcanceledProduct extends Required<Pick<CommerceDetailOrderItem, 'quantity'>> {
  productId: string
  cancelationReason?: string
  count?: number
  formValidation?: boolean
}

interface IProductCancelationProps {
  shoppingCartId: string
  canceledProducts: IcanceledProduct[]
}

interface ConsignmentCancelationStateProps {
  allCancelation: IAllCancelationProps | null
  productCancelations: IProductCancelationProps | null
  products: CommerceDetailOrderItem[]
}

const ConsignmentCancelationStateContext = createContext<ConsignmentCancelationStateProps>({
  allCancelation: null,
  productCancelations: null,
  products: [],
})
const ConsignmentCancelationUpdaterContext = createContext<{
  setAllConsignmentCancelation: (value: IAllCancelationProps | null) => void
  setProductConsignmentCancelation: (value: IProductCancelationProps | null) => void
  setProducts: (value: CommerceDetailOrderItem[]) => void
}>({
  setAllConsignmentCancelation: () => {},
  setProductConsignmentCancelation: () => {},
  setProducts: () => {},
})

const ConsignmentCancelationProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [allConsignmentCancelation, setAllConsignmentCancelation] =
    useState<IAllCancelationProps | null>(null)
  const [productConsignmentCancelation, setProductConsignmentCancelation] =
    useState<IProductCancelationProps | null>(null)
  const [products, setProducts] = useState<CommerceDetailOrderItem[]>([])
  return (
    <ConsignmentCancelationStateContext.Provider
      value={{
        allCancelation: allConsignmentCancelation,
        productCancelations: productConsignmentCancelation,
        products,
      }}
    >
      <ConsignmentCancelationUpdaterContext.Provider
        value={{
          setProducts,
          setAllConsignmentCancelation,
          setProductConsignmentCancelation,
        }}
      >
        {children}
      </ConsignmentCancelationUpdaterContext.Provider>
    </ConsignmentCancelationStateContext.Provider>
  )
}

function useConsignmentCancelation() {
  const consignmentCancelation = React.useContext(ConsignmentCancelationStateContext)
  if (typeof consignmentCancelation === 'undefined') {
    throw new Error('useConsignmentCancelation must be used within a provider')
  }
  return consignmentCancelation
}

function useConsignmentCancelationUpdater() {
  const setConsignmentCancel = React.useContext(ConsignmentCancelationUpdaterContext)
  if (typeof setConsignmentCancel === 'undefined') {
    throw new Error('useConsignmentCancelationUpdater must be used within a provider')
  }
  const setAllConsignmentCancelation = (value: IAllCancelationProps) => {
    setConsignmentCancel.setAllConsignmentCancelation({ ...value })
    setConsignmentCancel.setProductConsignmentCancelation(null)
  }

  const setProductConsignmentCancelation = (value: IProductCancelationProps) => {
    setConsignmentCancel.setProductConsignmentCancelation({ ...value })
    setConsignmentCancel.setAllConsignmentCancelation(null)
  }

  const setProducts = (value: CommerceDetailOrderItem[]) => {
    setConsignmentCancel.setProducts([...value])
  }
  return { setAllConsignmentCancelation, setProductConsignmentCancelation, setProducts }
}

export {
  ConsignmentCancelationProvider,
  useConsignmentCancelationUpdater,
  useConsignmentCancelation,
}

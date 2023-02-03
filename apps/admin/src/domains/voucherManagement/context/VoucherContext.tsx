import * as React from 'react'

export type VoucherContextType = {
  selected: string
  setSelected: (val: string) => void
  setIsVendorExpandable: (val: boolean) => void
  isVendorExpandable: boolean
}
export const VoucherContext = React.createContext<VoucherContextType | null>({
  setSelected: () => {},
  selected: '',
  isVendorExpandable: false,
  setIsVendorExpandable: () => {},
} as VoucherContextType)

export const VoucherProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = React.useState<string>()
  const [isVendorExpandable, setIsVendorExpandable] = React.useState<boolean>(false)

  return (
    <VoucherContext.Provider
      value={{ selected: selected!, setIsVendorExpandable, isVendorExpandable, setSelected }}
    >
      {children}
    </VoucherContext.Provider>
  )
}
export const useVoucherContext = () => React.useContext(VoucherContext)

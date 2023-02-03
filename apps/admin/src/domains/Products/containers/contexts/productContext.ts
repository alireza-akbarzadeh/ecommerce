import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import { GetProductQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { createContext } from 'react'

interface IProductContextData {
  productDetails?: GetProductQueryResult
  productState: EnumFormHeaderStatus
}

export const ProductContext = createContext<IProductContextData>({
  productState: EnumFormHeaderStatus.draft,
})

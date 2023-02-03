import {
  GetAllOtherVendorsQueryModel,
  ProductDetailDto,
  UniqueProductDto,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { createContext, ReactNode, useContext, useState } from 'react'

type ProductDetailContextType = {
  product: ProductDetailDto | null
  valuingProductDetail: (product: ProductDetailDto) => void
  specificSelectedValues: Record<string, string>
  setSpecificSelectedValues: (value: Record<string, string>) => void
  updateSpecificSelectedValues: (key: string, value: string) => void
  activeUniqueProduct: UniqueProductDto | null
  setActiveUniqueProduct: (uniqueProduct: UniqueProductDto) => void
  setActiveOtherVendors: (vendors: GetAllOtherVendorsQueryModel[]) => void
  activeOtherVendors: GetAllOtherVendorsQueryModel[] | null
}

const productDetailContextDefaultValues: ProductDetailContextType = {
  valuingProductDetail: () => {},
  product: null,
  specificSelectedValues: {},
  updateSpecificSelectedValues: () => {},
  activeUniqueProduct: null,
  setActiveUniqueProduct: () => {},
  activeOtherVendors: null,
  setSpecificSelectedValues: () => {},
  setActiveOtherVendors: () => {},
}

const ProductDetailContext = createContext<ProductDetailContextType>(
  productDetailContextDefaultValues,
)

export function useProductDetail() {
  return useContext(ProductDetailContext)
}

type Props = {
  children: ReactNode
}

export function ProductDetailProvider({ children }: Props) {
  const [product, setProduct] = useState<ProductDetailDto | null>(null)
  const [specificSelectedValues, setSpecificSelectedValues] = useState<Record<string, string>>({})
  const [activeUniqueProduct, setActiveUniqueProduct] = useState<UniqueProductDto | null>(null)
  const [activeOtherVendors, setActiveOtherVendors] = useState<
    GetAllOtherVendorsQueryModel[] | null
  >(null)
  const [posibleSpecificAttribute, setPosibleSpecificAttribute] = useState<
    Record<string, string>[][]
  >([])

  const valuingProductDetail = (product: ProductDetailDto) => {
    setProduct(product)
    valuingPosibleSpecificAttribute(product)
  }

  const valuingPosibleSpecificAttribute = (product: ProductDetailDto) => {
    const tempPosibleSpecificAttribute =
      product.uniqueProducts?.map((u) => {
        const attrbiues =
          u.specificAttributes?.map((sa) => {
            const attribue: Record<string, string> = {}
            attribue[sa.id!] = sa.valueId!
            return attribue
          }) ?? []
        return attrbiues
      }) ?? []
    setPosibleSpecificAttribute(tempPosibleSpecificAttribute)
  }

  const valuingActiveUniqueProduct = (
    attributes: Record<string, string>,
    key?: string,
    value?: string,
  ) => {
    let tempProductDetail: UniqueProductDto | null = null
    product?.uniqueProducts?.map((product) => {
      let flag = true
      product.specificAttributes?.map((attribute) => {
        if (attribute.id) {
          if (attribute.valueId != attributes[attribute.id]) {
            flag = false
            return
          }
        } else {
          flag = false
          return
        }
      })
      if (flag) {
        tempProductDetail = product
        return
      }
    })
    if (!tempProductDetail && !!key && !!value) {
      replaceSpecifAttributes(key, value)
    } else {
      setActiveUniqueProduct(tempProductDetail)
    }
  }

  const replaceSpecifAttributes = (key: string, value: string) => {
    const selectedAttributes = posibleSpecificAttribute.find((i) => i.find((j) => j[key] === value))
    let tempValue: Record<string, string> = {}
    selectedAttributes?.forEach((attr) => {
      tempValue = { ...tempValue, ...attr }
    })
    if (selectedAttributes) {
      setSpecificSelectedValues({ ...tempValue })
      valuingActiveUniqueProduct(tempValue)
    }
  }

  const updateSpecificSelectedValues = (key: string, value: string) => {
    const tempValue = specificSelectedValues
    tempValue[key] = value
    setSpecificSelectedValues({ ...tempValue })
    valuingActiveUniqueProduct(tempValue, key, value)
  }

  // const valuingActiveOtherProducts = () => {
  //   // if (!product || !product.otherVendors || !activeUniqueProduct) return
  //   // let tempOtherVendors: OtherVendorDto[] = []
  //   // tempOtherVendors = product?.otherVendors?.filter(
  //   //   (i) => i.uniqueProductId === activeUniqueProduct?.id,
  //   // )
  //   // setActiveOtherVendors([...tempOtherVendors])
  //   setActiveOtherVendors([])
  // }

  // useEffect(() => {
  //   valuingActiveOtherProducts()
  // }, [activeUniqueProduct])

  const value: ProductDetailContextType = {
    product,
    valuingProductDetail,
    specificSelectedValues,
    updateSpecificSelectedValues,
    activeUniqueProduct,
    setActiveUniqueProduct,
    activeOtherVendors,
    setSpecificSelectedValues,
    setActiveOtherVendors,
  }

  return <ProductDetailContext.Provider value={value}>{children}</ProductDetailContext.Provider>
}

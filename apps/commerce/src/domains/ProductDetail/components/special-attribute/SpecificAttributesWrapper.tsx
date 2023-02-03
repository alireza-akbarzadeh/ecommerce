import { FC } from 'react'
import { useProductDetail } from '../../ProductDetailContext'
import RadioAttribute from './RadioAttribute'
import SelectAttribute from './SelectAttribute'

const SpecificAttributesWrapper: FC = () => {
  const { product, updateSpecificSelectedValues, specificSelectedValues } = useProductDetail()
  return (
    <>
      {product?.specificAttributes?.map((attr) => {
        return attr.componentType === 'Radio Button' ? (
          <RadioAttribute onChange={updateSpecificSelectedValues} {...attr} />
        ) : attr.componentType === 'Drop Down List' ? (
          <SelectAttribute onChange={updateSpecificSelectedValues} {...attr} />
        ) : (
          <></>
        )
      })}
    </>
  )
}

export default SpecificAttributesWrapper

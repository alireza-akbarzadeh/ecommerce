import { useGetAdminCatalogProductsPreviewByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useRouter } from 'next/router'
import { FC } from 'react'
import RadioAttribute from './RadioAttribute'
import SelectAttribute from './SelectAttribute'

const { log } = console

const SpecificAttributesWrapper: FC = () => {
  const { id } = useRouter().query as { id: string }
  const productData = useGetAdminCatalogProductsPreviewByIdQuery({
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    id,
  })
  const updateSpecificSelectedValues = (key: string, value: any) => {
    log(key)
  }

  const product = productData.data?.data || {}
  return (
    <>
      {product?.specificAttributes?.map((attr) => {
        return attr?.componetType === 'Radio Button' ? (
          <RadioAttribute onChange={updateSpecificSelectedValues} {...attr} />
        ) : attr?.componetType === 'Drop Down List' ? (
          <SelectAttribute onChange={updateSpecificSelectedValues} {...attr} />
        ) : (
          <></>
        )
      })}
    </>
  )
}

export default SpecificAttributesWrapper

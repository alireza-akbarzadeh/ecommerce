import { CargoProductItem } from '@hasty-bazar-commerce/components'
import { Inquiry, ProductBundleDto } from '@hasty-bazar-commerce/services/saleApi.generated'
import { Divider, Grid, Stack } from '@mui/material'
import { FC, ReactNode } from 'react'
import { useShipping } from '../../Shipping'
import CargoShippingBox from './CargoShippingBox'

interface ICargoWrapper {
  products: ProductBundleDto[]
  bundle?: Inquiry
  withAttributes?: boolean
  shippingDetail?: boolean
  isPayment?: boolean
  additionalTitleInfo?: ReactNode
}
const CargoWrapper: FC<ICargoWrapper> = ({
  products,
  bundle,
  additionalTitleInfo,
  withAttributes = true,
  shippingDetail = true,
  isPayment,
}) => {
  const { handleChangeDeliveryTime } = useShipping()

  const onChangeProvider = (optionId: string) => {
    handleChangeDeliveryTime(bundle?.bundleId!, optionId)
  }

  return (
    <Stack spacing={6}>
      {additionalTitleInfo && (
        <>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            columnGap={6}
            rowGap={4}
            alignItems={{ md: 'center' }}
          >
            {additionalTitleInfo}
          </Stack>
          <Divider variant="fullWidth" sx={{ color: 'grey.200' }} />
        </>
      )}
      <Grid container px={{ sm: 2, xs: 0 }} rowGap={10} columnGap={15}>
        {products?.map((product, index) => {
          return (
            <Grid item xs={12} md={5} key={index}>
              <CargoProductItem
                productCartItem={product}
                withAttributes={withAttributes}
                isPayment={isPayment}
              />
            </Grid>
          )
        })}
      </Grid>
      {shippingDetail && <CargoShippingBox bundle={bundle} onChangeProvider={onChangeProvider} />}
    </Stack>
  )
}

export default CargoWrapper

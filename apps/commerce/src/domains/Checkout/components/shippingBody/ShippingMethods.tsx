import { ShippingMethodTypeEnum } from '@hasty-bazar-commerce/core/enums'
import { HBRadioButton } from '@hasty-bazar/core'
import { FormControlLabel, Grid, RadioGroup, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'
import { SectionItemWrapper } from '../../CheckoutPage.style'
import { useShipping } from '../../Shipping'

const ShippingMethods: FC = () => {
  const { shippingMethod, setShippingMethod } = useShipping()

  return (
    <SectionItemWrapper>
      <Typography variant="h4">
        <FormattedMessage {...CheckoutPageMessages.shippingMethods} />
      </Typography>
      <RadioGroup
        sx={{ pt: 4 }}
        row
        aria-labelledby="radio-buttons-group-label"
        value={shippingMethod}
        name="radio-buttons-group"
        onChange={(_, value) => {
          setShippingMethod(+value)
        }}
      >
        <Grid direction={{ xs: 'column', md: 'row' }} container columnSpacing={9}>
          <Grid item>
            <FormControlLabel
              value={ShippingMethodTypeEnum.Total}
              control={<HBRadioButton />}
              componentsProps={{ typography: { variant: 'subtitle1' } }}
              label={<FormattedMessage {...CheckoutPageMessages.shippingMethodsDefault} />}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              value={ShippingMethodTypeEnum.Fastest}
              control={<HBRadioButton />}
              componentsProps={{ typography: { variant: 'subtitle1' } }}
              label={<FormattedMessage {...CheckoutPageMessages.shippingMethodsFastest} />}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              value={ShippingMethodTypeEnum.Vendor}
              control={<HBRadioButton />}
              componentsProps={{ typography: { variant: 'subtitle1' } }}
              label={<FormattedMessage {...CheckoutPageMessages.shippingMethodsByVendor} />}
            />
          </Grid>
        </Grid>
      </RadioGroup>
    </SectionItemWrapper>
  )
}

export default ShippingMethods

import useMutationObserver from '@hasty-bazar-commerce/hooks/useMutationObserver'
import { Box, Grid } from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'
import { ContainerStyle } from './CheckoutPage.style'
import { CheckoutHeader } from './components'
import { PaymentPage } from './Payment'
import { ShippingPage, ShippingProvider } from './Shipping'

export enum CheckoutSteps {
  shipping = 'shipping',
  payment = 'payment',
}

export interface CheckoutProps {
  route: CheckoutSteps
}

const steps = {
  shipping: (
    <ShippingProvider>
      <ShippingPage />
    </ShippingProvider>
  ),
  payment: <PaymentPage />,
}

const CheckoutPage: FC<CheckoutProps> = (props) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState('')

  const calculateHeight = () => {
    if (ref.current) setHeight(`${ref.current.getBoundingClientRect().height + 10}px`)
  }
  useMutationObserver(ref, calculateHeight)
  useEffect(() => {
    calculateHeight()
  }, [ref.current])

  return (
    <>
      <ContainerStyle sx={{ paddingBottom: height }}>
        <Grid p={{ md: 6 }} direction="column" container rowGap={{ xs: 2, md: 6 }}>
          <CheckoutHeader route={props.route} />
          <Grid container item columnSpacing={6} p={{ sm: 6, md: 0 }} rowGap={{ xs: 2 }}>
            {steps[props.route]}
          </Grid>
        </Grid>
      </ContainerStyle>
      <Box
        ref={ref}
        id="summary-cart"
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          boxShadow: '0px -16px 16px rgb(0 0 0 / 4%)',
          zIndex: 100,
        }}
      />
    </>
  )
}

export default CheckoutPage

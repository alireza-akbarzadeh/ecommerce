import { HBLink } from '@hasty-bazar-commerce/components'
import { HBButton, HBIcon, HBIconType } from '@hasty-bazar/core'
import {
  Divider,
  Grid,
  Stack,
  StepButton,
  StepIconProps,
  StepLabel,
  Stepper,
  stepperClasses,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { CheckoutProps } from '../CheckoutPage'
import CheckoutPageMessages from '../CheckoutPage.messages'
import {
  CheckoutStep,
  CheckoutStepConnector,
  CheckoutStepIconRoot,
  SectionItemWrapper,
} from '../CheckoutPage.style'
interface CheckoutStepIconProps extends StepIconProps {
  stepIcon: HBIconType
}

interface stepItem {
  step: 'basket' | 'shipping' | 'payment'
  icon: HBIconType
}

const CheckoutHeader: FC<CheckoutProps> = ({ route }) => {
  const router = useRouter()
  const steps: stepItem[] = [
    { step: 'basket', icon: 'shoppingBasket' },
    { step: 'shipping', icon: 'clock' },
    { step: 'payment', icon: 'moneyWithdraw' },
  ]
  function CheckoutStepIcon(props: CheckoutStepIconProps) {
    const { active, completed, stepIcon } = props
    return (
      <CheckoutStepIconRoot ownerState={{ active }}>
        <HBIcon
          type={stepIcon}
          size="small"
          sx={{ color: completed ? 'primary.main' : 'inherit' }}
        />
      </CheckoutStepIconRoot>
    )
  }

  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault()
    if (route === 'payment') router.replace('/checkout/shipping')
    else router.push('/basket')
  }

  const handleGoToStep = (path: string) => {
    if (path === 'basket') return router.push('/basket')
    router.push(path)
  }

  return (
    <SectionItemWrapper
      sx={(theme) => ({
        width: '100%',
        zIndex: theme.zIndex.appBar,
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
          padding: 2,
          borderRadius: 0,
        },
      })}
      container
      justifyContent="space-between"
      alignItems="center"
      gap={4}
    >
      <Grid item sm>
        <Stack
          direction="row"
          alignItems="center"
          divider={
            <Divider
              orientation="vertical"
              variant="middle"
              sx={({ spacing }) => ({ height: spacing(8), color: 'grey.300' })}
            />
          }
          spacing={2}
        >
          <HBLink href="/" sx={{ lineHeight: 0 }}>
            <Image
              objectFit="contain"
              src="/assets/logo.png"
              height={40}
              width={40}
              alt="بازار اینترنتی دارتیل"
            />
          </HBLink>

          <HBButton variant="text" color="inherit" onClick={handleGoBack}>
            <HBIcon type="arrowRight" sx={{ lineHeight: 0 }} />
            <Typography variant={'button'}>
              <FormattedMessage {...CheckoutPageMessages.previousStep} />
            </Typography>
          </HBButton>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={7} mr={{ sm: -4, md: -10 }}>
        <Stepper
          alternativeLabel
          connector={<CheckoutStepConnector />}
          activeStep={steps.findIndex((item) => item.step === route)}
          sx={{
            [`&.${stepperClasses.root}`]: {
              width: (theme) => `calc(100% + ${theme.spacing(15)})`,
              mx: -7.5,
            },
          }}
        >
          {steps.map((item) => (
            <CheckoutStep key={item.step}>
              <StepButton sx={{ cursor: 'pointer' }} disableRipple>
                <StepLabel
                  onClick={() => handleGoToStep(item.step)}
                  StepIconComponent={(props) => (
                    <CheckoutStepIcon stepIcon={item.icon} {...props} />
                  )}
                >
                  <FormattedMessage {...CheckoutPageMessages?.[item.step]} />
                </StepLabel>
              </StepButton>
            </CheckoutStep>
          ))}
        </Stepper>
      </Grid>
    </SectionItemWrapper>
  )
}

export default CheckoutHeader

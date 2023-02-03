import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBClassesType, HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, Button, ButtonProps, Step, StepLabel, stepLabelClasses, Stepper } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { StepConnectorRoot } from './StepConnectorRoot'
import StepIcon from './StepIcon'

type HBPageClassNames =
  | 'mainContainer'
  | 'stepperSection'
  | 'buttonsSection'
  | 'prevButton'
  | 'nextButton'
const classes: HBClassesType<HBPageClassNames> = {
  mainContainer: {
    p: 6,
    borderRadius: 4,
    mb: 4,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 4,
  },
  stepperSection: {
    flex: 1,
  },
  buttonsSection: {
    width: { xs: '100%', sm: '25%' },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    mt: { xs: 4, sm: 0 },
  },
  prevButton: ({ palette }) => ({
    color: 'common.black',
    borderColor: ({ palette }) => palette.grey[200],
    [`&:hover`]: {
      borderColor: ({ palette }) => palette.grey[200],
      backgroundColor: ({ palette }) => palette.grey[200],
    },
  }),
  nextButton: ({ palette }) => ({
    backgroundColor: palette.info.main,

    [`&:hover`]: {
      backgroundColor: palette.info.dark,
    },
    '&.Mui-disabled': {
      opacity: '0.3',
      backgroundColor: palette.info.main,
      color: palette.info.contrastText,
    },
  }),
}

export interface ProductsStepperProps {
  activeItem?: number
  steps?: {
    label: string
    icon: HBIconType
  }[]
  onStepChange?: (step: number) => void
  nextButtonProps?: Omit<ButtonProps, 'onClick'> & {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, step: number) => void
  }
  prevButtonProps?: Omit<ButtonProps, 'onClick'> & {
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, step: number) => void
  }
}

function ProductsStepper({
  activeItem,
  nextButtonProps,
  steps = [],
  prevButtonProps,
  onStepChange,
}: ProductsStepperProps) {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState<number>(0)
  const id = router.query.id as string

  useEffect(() => {
    if (activeItem) {
      setActiveStep(activeItem)
    }
  }, [activeItem])
  const isLastStep = activeStep === steps.length - 1
  const isFirstStep = activeStep === 0

  const handleNext: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    nextButtonProps?.onClick?.(event, activeStep + 1)
  }

  const handleBack: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    prevButtonProps?.onClick?.(event, activeStep - 1)
  }

  const onClickFinalize: React.MouseEventHandler<HTMLButtonElement> = () => {
    router.push(`/products`)
  }

  return (
    <Box bgcolor="common.white" sx={classes.mainContainer}>
      <Box sx={classes.stepperSection}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<StepConnectorRoot />}>
          {steps.map(({ label, icon }, index) => {
            return (
              <Step
                onClick={() => {
                  if (id) {
                    onStepChange?.(index)
                  }
                }}
                sx={{
                  cursor: 'pointer',
                }}
                key={`${label} - ${String(index)}`}
              >
                <StepLabel
                  StepIconComponent={(props) => <StepIcon {...props} icon={icon} />}
                  sx={{
                    [`& .${stepLabelClasses.active}`]: ({ spacing }) => ({
                      fontSize: spacing(4),
                    }),
                    [`& .${stepLabelClasses.label}`]: {
                      mt: 0,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </Box>

      <Box sx={classes.buttonsSection}>
        {!isFirstStep && (
          <Button
            component="button"
            variant="outlined"
            sx={classes.prevButton}
            {...prevButtonProps}
            onClick={handleBack}
          >
            {formatMessage(phrasesMessages.back)}
          </Button>
        )}

        {isLastStep ? (
          <Button
            component="button"
            variant="contained"
            sx={classes.nextButton}
            {...nextButtonProps}
            onClick={onClickFinalize}
          >
            {formatMessage(phrasesMessages.toFinalize)}
          </Button>
        ) : (
          <Button
            component="button"
            variant="contained"
            sx={classes.nextButton}
            {...nextButtonProps}
            onClick={handleNext}
          >
            {formatMessage(phrasesMessages.nextStep)}
            <HBIcon type="arrowLeft" sx={{ mt: 1 }} />
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default ProductsStepper

import { StepConnector, stepConnectorClasses, styled } from '@mui/material'

export const StepConnectorRoot = styled(StepConnector)(({ theme: { palette } = {} }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: palette?.success.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: palette?.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    backgroundColor: palette?.grey[500],
  },
}))

import {
  Grid,
  Stack,
  Step,
  stepButtonClasses,
  stepClasses,
  stepLabelClasses,
  StepConnector,
  stepConnectorClasses,
  styled,
} from '@mui/material'

export const ContainerStyle = styled(Stack)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
  margin: '0 auto',
  backgroundColor: theme.palette.grey[100],
}))

export const SectionItemWrapper = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6, 4),
  [theme.breakpoints.down('sm')]: {
    borderRadius: 0,
  },
}))

export const CheckoutStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
}))

export const CheckoutStep = styled(Step)(({ theme }) => ({
  [`&.${stepClasses.alternativeLabel}`]: {
    [`& .${stepClasses.completed}`]: {
      color: theme.palette.primary.main,
    },
    [`& .${stepButtonClasses.root}`]: {
      padding: 0,
      margin: 0,
    },
  },
  [`& .${stepLabelClasses.root}`]: {
    [`& .${stepLabelClasses.labelContainer}`]: {
      [`& .${stepLabelClasses.alternativeLabel}`]: {
        marginTop: theme.spacing(1.5),
        [`&.${stepLabelClasses.completed}`]: {
          fontSize: theme.typography.body2.fontSize,
          fontWeight: theme.typography.body2.fontWeight,
        },
        [`& .${stepLabelClasses.active}`]: {
          fontSize: theme.typography.subtitle1,
        },
      },
    },
  },
}))

export const CheckoutStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[400],
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: theme.palette.common.black,
    }),
  }),
)

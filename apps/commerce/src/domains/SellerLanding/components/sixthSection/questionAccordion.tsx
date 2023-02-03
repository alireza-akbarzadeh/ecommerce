import { HBIconButton } from '@hasty-bazar/core'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary, {
  accordionSummaryClasses,
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import * as React from 'react'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <HBIconButton
        sx={{
          bgcolor: 'transparent',
          borderColor: 'grey.300',
          borderRadius: 2,
        }}
        variant="outlined"
        icon={'angleDown'}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  bgcolor: theme.palette.grey[300] + 10,
}))

interface RuleAccordionProps {
  title: string
  children: React.ReactNode
}

export default function QuestionAccordion({ title, children }: RuleAccordionProps) {
  return (
    <Accordion
      sx={{
        border: '1px solid',
        borderRadius: 2,
        borderColor: 'grey.300',
      }}
    >
      <AccordionSummary
        sx={{
          bgcolor: ({ palette: { grey } }) => grey[300] + 10,
          borderRadius: 2,
          borderColor: 'grey.300',
        }}
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography
          variant="h6"
          fontWeight={500}
          fontSize={16}
          sx={{
            marginInlineStart: 2,
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" fontWeight={400} lineHeight={1.5}>
          {children}
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

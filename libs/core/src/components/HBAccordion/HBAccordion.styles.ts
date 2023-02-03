import { Accordion, AccordionDetails, AccordionSummary, styled } from '@mui/material'

export const HBAccordionRootStyle = styled(Accordion)(
  ({ theme }) => `

  `,
)

export const HBAccordionSummary = styled(AccordionSummary)(
  ({ theme }) => `

  `,
) as typeof AccordionSummary

export const HBAccordionDetails = styled(AccordionDetails)(
  ({ theme }) => `

  `,
)

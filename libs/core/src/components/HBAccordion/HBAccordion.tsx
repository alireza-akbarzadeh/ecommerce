import { AccordionProps, Box } from '@mui/material'
import React, { ForwardedRef, forwardRef } from 'react'
import { HBIcon } from '..'
import { HBAccordionDetails, HBAccordionRootStyle, HBAccordionSummary } from './HBAccordion.styles'

export interface HBAccordionProps extends Omit<AccordionProps, 'ref' | 'children'> {
  summary?: React.ReactElement
  detail?: React.ReactElement
  customSummary?: React.ReactElement
}

const HBAccordion = forwardRef(
  <T extends HTMLDivElement>(props: HBAccordionProps, ref: ForwardedRef<T>) => {
    return (
      <HBAccordionRootStyle ref={ref} {...props}>
        <HBAccordionSummary
          expandIcon={props.customSummary ? null : <HBIcon size="medium" type="angleDown" />}
        >
          {props.summary && <Box sx={{ width: '100%' }}>{props.summary}</Box>}
          {props.customSummary && props.customSummary}
        </HBAccordionSummary>

        <HBAccordionDetails>{props.detail}</HBAccordionDetails>
      </HBAccordionRootStyle>
    )
  },
)

HBAccordion.displayName = 'HBAccordion'
HBAccordion.defaultProps = {}

export default HBAccordion

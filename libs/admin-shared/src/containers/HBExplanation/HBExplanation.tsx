import { HBAccordion, HBClassesType } from '@hasty-bazar/core'
import { accordionClasses, AccordionProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'

export interface HBAccordionProps extends Omit<AccordionProps, 'ref' | 'children'> {
  summary: React.ReactElement
  detail: React.ReactElement
}

type HBPageClassNames = 'HBAccordion'

const classes: HBClassesType<HBPageClassNames> = {
  HBAccordion: {
    my: 2,
    p: 1,
    boxShadow: 0,
    [`&.${accordionClasses.root}`]: {
      borderRadius: (theme) => theme.spacing(1),
    },
  },
}

const HBExplanation = forwardRef(
  <T extends HTMLDivElement>(props: HBAccordionProps, ref: ForwardedRef<T>) => {
    return <HBAccordion ref={ref} {...props} sx={classes.HBAccordion} />
  },
)

HBExplanation.displayName = 'HBExplanation'
HBExplanation.defaultProps = {}

export default HBExplanation

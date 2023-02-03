import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { HBClassesType, HBIcon } from '@hasty-bazar/core'
import { accordionClasses, AccordionProps, Box, Typography } from '@mui/material'
import {
  HBAccordionDetails,
  HBAccordionRootStyle,
  HBAccordionSummary,
} from 'libs/core/src/components/HBAccordion/HBAccordion.styles'
import React, { ForwardedRef, forwardRef } from 'react'
import { useIntl } from 'react-intl'

export interface HBAccordionProps extends Omit<AccordionProps, 'ref' | 'children'> {
  detail: React.ReactElement
}

type HBPageClassNames = 'HBAccordion'

const classes: HBClassesType<HBPageClassNames> = {
  HBAccordion: {
    my: 2,
    pl: 4,
    boxShadow: 0,
    [`&.${accordionClasses.root}`]: {
      borderRadius: 4,
    },
  },
}

const HBHistoryExplanation = forwardRef(
  <T extends HTMLDivElement>(props: HBAccordionProps, ref: ForwardedRef<T>) => {
    const { formatMessage } = useIntl()
    const [expanded, setExpanded] = React.useState<string | false>(false)

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

    return (
      <HBAccordionRootStyle
        ref={ref}
        {...props}
        expanded={expanded === 'history'}
        onChange={handleChange('history' || '')}
        sx={classes.HBAccordion}
      >
        <HBAccordionSummary
          expandIcon={<HBIcon sx={{ color: 'info.main' }} size="medium" type="angleDown" />}
        >
          <Box sx={{ width: '100%' }}>
            <HBExplanationSummary
              title={formatMessage(phrasesMessages.records)}
              icon={'historyAlt'}
            />
          </Box>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'info.main',
            }}
          >
            {expanded === 'history'
              ? formatMessage(phrasesMessages.close)
              : formatMessage(phrasesMessages.view)}
          </Typography>
        </HBAccordionSummary>

        <HBAccordionDetails>
          <div>{props.detail}</div>
        </HBAccordionDetails>
      </HBAccordionRootStyle>
    )
  },
)

HBHistoryExplanation.displayName = 'HBHistoryExplanation'
HBHistoryExplanation.defaultProps = {}

export default HBHistoryExplanation

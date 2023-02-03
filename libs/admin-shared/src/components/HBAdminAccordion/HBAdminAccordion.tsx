import { HBIcon, HBIconType } from '@hasty-bazar/core'
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Box,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'

export interface HBAdminAccordionProps extends Omit<AccordionProps, 'children' | 'title'> {
  headerStyle?: SxProps<Theme>
  title: ReactNode | string
  icon?: HBIconType
  children: React.ReactNode
}

export default function HBAdminAccordion({
  title,
  icon = 'fileEditAlt',
  expanded,
  headerStyle,
  ...props
}: HBAdminAccordionProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(!!expanded)
  useEffect(() => {
    setIsExpanded(!!expanded)
  }, [expanded])

  return (
    <Accordion
      {...props}
      expanded={isExpanded}
      sx={{
        mt: 2,
        borderRadius: 4,
        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        boxShadow: 'none',
        ...props.sx,
      }}
    >
      <AccordionSummary
        onClick={() => setIsExpanded(!isExpanded)}
        expandIcon={<HBIcon size="medium" type="angleDown" />}
        sx={{ px: 4 }}
      >
        <Stack direction={'row'} spacing={2.5} alignItems="center" sx={{ ...headerStyle }}>
          <HBIcon type={icon} size="medium" />
          {typeof title === 'string' ? (
            <Typography variant="h5">{title}</Typography>
          ) : (
            <Box sx={{ ...headerStyle }}>{title}</Box>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 6, py: 4 }}>{props.children}</AccordionDetails>
    </Accordion>
  )
}

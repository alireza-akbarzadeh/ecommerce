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

export interface HBCommerceAccordionProps extends Omit<AccordionProps, 'children' | 'title'> {
  headerStyle?: SxProps<Theme>
  title: ReactNode | string
  icon?: HBIconType
  children: React.ReactNode
  arrowStyle?: SxProps<Theme>
  reverseSummary?: boolean
}

export default function HBCommerceAccordion({
  title,
  icon = 'fileEditAlt',
  expanded,
  headerStyle,
  reverseSummary,
  arrowStyle,
  ...props
}: HBCommerceAccordionProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(!!expanded)
  useEffect(() => {
    setIsExpanded(!!expanded)
  }, [expanded])

  return (
    <Accordion
      {...props}
      expanded={isExpanded}
      sx={{
        ...props.sx,
        mt: 2,
        borderRadius: (theme) => theme.spacing(2),
        border: (theme) => `1px solid ${theme.palette.grey[300]}`,
        boxShadow: 'none',
        '&.Mui-expanded': (theme) => ({
          margin: `${theme.spacing(1, 0)} !important`,
        }),
        '&:last-of-type': {
          borderRadius: (theme) => theme.spacing(2),
        },
      }}
    >
      <AccordionSummary
        onClick={() => setIsExpanded(!isExpanded)}
        expandIcon={
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...arrowStyle }}
          >
            <HBIcon size="medium" type="angleDown" />
          </Box>
        }
        sx={(theme) => ({
          px: 2,
          flexDirection: reverseSummary ? 'row-reverse' : 'unset',
          '&.Mui-expanded': {
            minHeight: '48px !important',
          },
        })}
      >
        <Stack direction={'row'} spacing={2.5} alignItems="center" sx={{ ...headerStyle }}>
          {typeof title === 'string' ? (
            <Typography variant="subtitle1" mr={2} ml={2}>
              {title}
            </Typography>
          ) : (
            <Box sx={{ ...headerStyle }}>{title}</Box>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 6, py: 4 }}>{props.children}</AccordionDetails>
    </Accordion>
  )
}

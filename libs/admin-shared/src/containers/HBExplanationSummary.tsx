import { HBChip, HBClassesType, HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'

type HBPageClassNames = 'labelChip' | 'accordionSummary'

const classes: HBClassesType<HBPageClassNames> = {
  labelChip: ({ palette }) => ({
    backgroundColor: palette.info.light,
    color: palette.info.dark,
  }),
  accordionSummary: { display: 'flex', gap: 3, alignItems: 'center' },
}

type HBExplanationSummaryTypes = {
  title: string
  icon: HBIconType
  statusLabel?: string
}

const HBExplanationSummary: FC<HBExplanationSummaryTypes> = (props: HBExplanationSummaryTypes) => {
  const { title, icon, statusLabel } = props

  return (
    <Box sx={classes.accordionSummary}>
      <HBIcon type={icon} />
      <Typography variant="h5">{title}</Typography>
      {statusLabel && <HBChip text={statusLabel} sx={classes.labelChip} />}
    </Box>
  )
}

export default HBExplanationSummary

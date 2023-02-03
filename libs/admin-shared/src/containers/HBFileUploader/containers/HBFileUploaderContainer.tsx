import { HBClassesType } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'

type HBPageClassnames =
  | 'uploaderContainer'
  | 'uploaderContainerTitle'
  | 'uploaderItems'
  | 'uploaderContainerWrapper'

const classes: HBClassesType<HBPageClassnames> = {
  uploaderContainerWrapper: ({ spacing }) => ({
    borderRadius: spacing(0.25),
    my: 4,
  }),
  uploaderContainer: ({ palette, spacing }) => ({
    border: 1,
    borderColor: palette.grey[300],
    p: 6,
    position: 'relative',
    borderRadius: spacing(0.25),
  }),
  uploaderContainerTitle: ({ spacing, palette }) => ({
    position: 'relative',
    display: 'inline-block',
    top: spacing(-8),
    backgroundColor: palette.common.white,
    px: 2,
    color: palette.warning.main,
  }),
  uploaderItems: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
    overflowX: 'auto',
    overflowY: 'hidden',
  },
}

export type HBFileUploaderContainerProps = {
  title: ReactNode
  children: ReactNode[] | ReactNode
}

function HBFileUploaderContainer({ title, children }: HBFileUploaderContainerProps) {
  return (
    <Box sx={classes.uploaderContainerWrapper} bgcolor="common.white">
      <Box sx={classes.uploaderContainer}>
        <Typography sx={classes.uploaderContainerTitle}>{title}</Typography>
        <Box sx={classes.uploaderItems}>{children}</Box>
      </Box>
    </Box>
  )
}

export default HBFileUploaderContainer

import { HBClassesType } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ReactNode } from 'react'

type HBPageClassnames = 'uploaderItems'

const classes: HBClassesType<HBPageClassnames> = {
  uploaderItems: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
    overflowX: 'auto',
    overflowY: 'hidden',
  },
}

export type HBFileUploaderWithoutContainerProps = {
  children: ReactNode[] | ReactNode
}

function HBFileUploaderWithoutContainer({ children }: HBFileUploaderWithoutContainerProps) {
  return <Box sx={classes.uploaderItems}>{children}</Box>
}

export default HBFileUploaderWithoutContainer

import { HBAccordion } from '@hasty-bazar/core'
import { accordionDetailsClasses, accordionSummaryClasses, SxProps } from '@mui/material'
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import CommerceAccordionSummary from './CommerceAccordionSummary'
export type accordionType = 'basic' | 'changeable' | 'unStyle'

interface CommerceAccordionProps {
  summaryTitle: string | ReactNode
  summaryButton?: ReactNode
  open?: boolean
  onCLose?: () => void
  type?: accordionType
  endAdornment?: ReactNode
  summaryContentStyle?: SxProps
}

const CommerceAccordion: FC<PropsWithChildren<CommerceAccordionProps>> = ({
  summaryButton,
  summaryTitle,
  children,
  open,
  onCLose,
  type = 'basic',
  endAdornment,
  summaryContentStyle,
}) => {
  const [expanded, setExpanded] = useState<boolean>(open || false)

  useEffect(() => {
    if (open !== null && open !== undefined) setExpanded(open)
  }, [open])

  useEffect(() => {
    if (!expanded && onCLose) {
      onCLose()
    }
  }, [expanded])

  return (
    <HBAccordion
      expanded={expanded}
      sx={{
        border: (theme) =>
          type === 'changeable'
            ? expanded
              ? `1px solid ${theme.palette.grey[200]}`
              : 'none'
            : 'none',
        boxShadow: 'none',
        borderRadius: 2,
        flex: 1,
        [`& .${accordionSummaryClasses.root}`]: { minHeight: 'unset', padding: 0 },
        [`& .${accordionDetailsClasses.root}`]: {
          px: 0,
        },
        [`& .${accordionSummaryClasses.content}`]: {
          margin: ({ spacing }) => `${spacing(2)} 0`,
          [`&.${accordionSummaryClasses.expanded}`]: {
            margin: ({ spacing }) => `${spacing(type === 'changeable' ? 4 : 2)} 0 ${spacing(5)} 0`,
          },
        },
      }}
      customSummary={
        <CommerceAccordionSummary
          title={summaryTitle}
          expanded={expanded}
          changeExpanded={setExpanded}
          button={summaryButton}
          type={type}
          endAdornment={endAdornment}
          summaryContentStyle={summaryContentStyle}
        />
      }
      detail={children as any}
    ></HBAccordion>
  )
}

export default CommerceAccordion

import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBExplanationSummaryTypes } from '@hasty-bazar/admin-shared/components/HBExplanationSummary/HBExplanationSummary'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAccordionProps, HBButton, HBButtonProps } from '@hasty-bazar/core'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

type ButtonProps = Omit<HBButtonProps, 'children'> & {
  text?: string
}
interface ProductExplanationProps extends Omit<HBAccordionProps, 'children'> {
  summaryProps: HBExplanationSummaryTypes
  defaultExpanded?: boolean
  children: React.ReactNode
  prevStepButtonProps?: ButtonProps
  nextStepButtonProps?: ButtonProps
}

function ProductExplanation({
  summaryProps,
  prevStepButtonProps,
  defaultExpanded,
  nextStepButtonProps,
  children,
  ...otherProps
}: ProductExplanationProps) {
  const { formatMessage } = useIntl()

  const [expanded, setExpanded] = useState(defaultExpanded)

  const hasPrevAndNextButtons = Boolean(
    prevStepButtonProps?.onClick || nextStepButtonProps?.onClick,
  )

  useEffect(() => {
    if (otherProps.disabled) {
      setExpanded(false)
    }
  }, [otherProps.disabled])

  return (
    <HBExplanation
      expanded={expanded}
      onChange={(event, expanded) => {
        setExpanded(expanded)
      }}
      summary={
        <HBExplanationSummary
          {...summaryProps}
          submitButton={summaryProps.submitButton && expanded}
        />
      }
      detail={
        <Box p={hasPrevAndNextButtons ? 4 : undefined}>
          {children}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',

              alignItems: 'center',
              justifyContent: prevStepButtonProps?.onClick ? 'space-between' : 'flex-end',
              mt: 6,
            }}
          >
            {prevStepButtonProps?.onClick && (
              <HBButton {...prevStepButtonProps} size="small" variant="outlined">
                {prevStepButtonProps?.text || formatMessage(phrasesMessages.prev)}
              </HBButton>
            )}
            {nextStepButtonProps?.onClick && (
              <HBButton {...nextStepButtonProps} size="small">
                {nextStepButtonProps?.text || formatMessage(phrasesMessages.next)}
              </HBButton>
            )}
          </Box>
        </Box>
      }
      {...otherProps}
    />
  )
}

export default ProductExplanation

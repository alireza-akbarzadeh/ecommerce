import { HBChip, HBIcon, HBIconButton, HBIconType } from '@hasty-bazar/core'
import { Box, ButtonProps, Stack, styled, Tooltip, TooltipProps, Typography } from '@mui/material'
import { isEmpty } from 'ramda'
import { FC } from 'react'

const PREFIX_CLASSES = 'hbExplanationSummary'
export const hbExplanationSummaryClasses = {
  root: `${PREFIX_CLASSES}-root`,
  chip: `${PREFIX_CLASSES}-chip`,
  iconButton: `${PREFIX_CLASSES}-iconButton`,
}

type SubmitButtonType = ButtonProps & {
  tooltipTitle?: string
  tooltipPlacement?: TooltipProps['placement']
}
export interface HBExplanationSummaryTypes {
  title: string
  icon: HBIconType
  submitButton?: boolean
  submitButtonProps?: SubmitButtonType
  groupSubmitButtonProps?: SubmitButtonType
  statusLabel?: string
}

const HBExplanationSummaryRoot = styled(Box)(
  ({
    theme: {
      palette: { info },
    },
  }) => ({
    display: 'flex',
    gap: 3,
    alignItems: 'center',
    [`& .${hbExplanationSummaryClasses.chip}`]: {
      backgroundColor: info.light,
      color: info.dark,
    },
    [`& .${hbExplanationSummaryClasses.iconButton}`]: {
      position: 'absolute',
      right: '2.5rem',
    },
  }),
)

const HBExplanationSummary: FC<HBExplanationSummaryTypes> = ({
  title,
  icon,
  groupSubmitButtonProps,
  statusLabel,
  submitButtonProps,
  ...props
}) => {
  const disableTooltip = !submitButtonProps?.tooltipTitle && !groupSubmitButtonProps
  return (
    <HBExplanationSummaryRoot className={hbExplanationSummaryClasses.root}>
      <HBIcon type={icon} />
      <Typography variant="h5">{title}</Typography>
      {statusLabel && <HBChip text={statusLabel} className={hbExplanationSummaryClasses.chip} />}
      {props.submitButton && submitButtonProps && (
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
          }}
          className={hbExplanationSummaryClasses.iconButton}
        >
          <Tooltip
            disableFocusListener={disableTooltip}
            disableTouchListener={disableTooltip}
            disableHoverListener={disableTooltip}
            title={submitButtonProps.tooltipTitle}
            placement={submitButtonProps.tooltipPlacement || 'top'}
            arrow
          >
            <HBIconButton
              type="submit"
              icon="check"
              {...submitButtonProps}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                submitButtonProps?.onClick?.(event)
              }}
            />
          </Tooltip>
          {groupSubmitButtonProps && (
            <Tooltip
              disableFocusListener={!groupSubmitButtonProps?.tooltipTitle}
              disableTouchListener={!groupSubmitButtonProps?.tooltipTitle}
              disableHoverListener={isEmpty(groupSubmitButtonProps?.tooltipTitle)}
              title={groupSubmitButtonProps?.tooltipTitle}
              placement={groupSubmitButtonProps?.tooltipPlacement || 'top'}
            >
              <HBIconButton
                type="submit"
                icon="checkCircle"
                {...groupSubmitButtonProps}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  groupSubmitButtonProps?.onClick?.(event)
                }}
              />
            </Tooltip>
          )}
        </Stack>
      )}
    </HBExplanationSummaryRoot>
  )
}

export default HBExplanationSummary

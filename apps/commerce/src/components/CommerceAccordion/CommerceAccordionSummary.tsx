import { HBIcon } from '@hasty-bazar/core'
import { Stack, styled, SxProps, Typography } from '@mui/material'
import { FC, ReactNode } from 'react'
import { accordionType } from './CommerceAccordion'

const ClickableStyle = styled(Stack)(() => ({
  cursor: 'pointer',
}))

const CommerceAccordionSummary: FC<{
  title: ReactNode
  button?: ReactNode
  expanded: boolean
  changeExpanded: (status: boolean) => void
  type?: accordionType
  endAdornment?: ReactNode
  summaryContentStyle?: SxProps
}> = ({
  title,
  button,
  expanded,
  changeExpanded,
  type = 'basic',
  endAdornment,
  summaryContentStyle,
}) => {
  const byTypeStyle = () => {
    switch (type) {
      case 'basic':
        return { bgcolor: 'grey.100', px: 2 }
      case 'changeable':
        return { bgcolor: expanded ? 'common.white' : 'grey.100', px: 4 }
      case 'unStyle':
        return { bgcolor: 'common.white', px: 0 }
      default:
        return { bgcolor: 'grey.100', px: 2 }
    }
  }
  return (
    <ClickableStyle
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      onClick={() => changeExpanded(!expanded)}
      sx={{
        minHeight: 56,
        width: '100%',
        py: 2,
        borderRadius: 2,
        transition: 'all 0.3s',
        ...byTypeStyle(),
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={summaryContentStyle}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            border: ({ palette }) => `1px solid ${palette.grey[300]}`,
            borderRadius: 2,
            height: 32,
            width: 32,
          }}
        >
          <HBIcon
            type="angleDown"
            sx={{
              lineHeight: 0,
              color: 'grey.700',
              transition: 'transform 0.2s',
              ...(expanded && { transform: 'rotate(180deg)' }),
            }}
          />
        </Stack>
        <Typography color="text.primary" variant="subtitle1">
          {title}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2}>
        {endAdornment}
        {button}
      </Stack>
    </ClickableStyle>
  )
}

export default CommerceAccordionSummary

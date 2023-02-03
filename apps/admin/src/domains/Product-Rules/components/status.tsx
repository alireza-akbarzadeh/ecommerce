import { HBChip, HBClassesType } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import productRulesMessages from '../ProductRules.messages'

type HBPageClassNames = 'root' | 'statusChip'

const classes: HBClassesType<HBPageClassNames> = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    mb: 2,
  },
  statusChip: ({ palette }) => ({
    backgroundColor: palette.warning.light,
    color: palette.warning.main,
  }),
}

type IStatusProps = {
  statusId?: number
}

const Status: FC = ({ statusId = 1 }: IStatusProps) => {
  const { formatMessage } = useIntl()
  return (
    <Box sx={classes.root}>
      <Typography variant="subtitle1">
        {formatMessage(productRulesMessages.releaseStage)}
      </Typography>
      <HBChip
        text={
          statusId === 1
            ? formatMessage(productRulesMessages.draft)
            : statusId === 2
            ? formatMessage(productRulesMessages.release)
            : statusId === 3
            ? formatMessage(productRulesMessages.notSelected)
            : ''
        }
        sx={classes.statusChip}
      />
      <Typography
        component="span"
        sx={{
          cursor: 'pointer',
        }}
        variant="subtitle2"
        color="info.main"
      >
        {formatMessage(productRulesMessages.changeStage)}
      </Typography>
    </Box>
  )
}
export default Status

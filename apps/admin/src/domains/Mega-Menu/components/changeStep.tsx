import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import productRulesMessages from '@hasty-bazar-admin/domains/Product-Rules/ProductRules.messages'
import { HBChip, HBClassesType } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import MegaMenuPageMessages from '../MegaMenu.messages'

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

type ChangeStepProps = {
  statusId?: number
}

const ChangeStep: FC = ({ statusId = 1 }: ChangeStepProps) => {
  const { formatMessage } = useIntl()
  return (
    <Box sx={classes.root}>
      <Typography variant="subtitle1">
        {formatMessage(productRulesMessages.releaseStage)}
      </Typography>
      <HBChip
        text={
          statusId === 1
            ? formatMessage(phrasesMessages.draft)
            : statusId === 2
            ? formatMessage(phrasesMessages.published)
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
        {formatMessage(MegaMenuPageMessages.changeStage)}
      </Typography>
    </Box>
  )
}
export default ChangeStep

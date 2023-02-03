import { CampaignDto } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBCountDownTimer, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../../productDetail.messages'

const Promotion: FC<{ campagin: CampaignDto }> = ({ campagin: campaignProp }) => {
  const [campaign, setCampagin] = useState<CampaignDto | null>(campaignProp)
  return (
    <>
      {!!campaign && (
        <Stack
          direction="row-reverse"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 2 }}
        >
          <Box display="flex" alignItems={'center'}>
            <HBIcon size="medium" type="stopwatch" sx={{ color: 'error.darker', mr: 1 }} />
            <HBCountDownTimer
              targetDate={new Date(campaignProp.toDate || '0').getTime()}
              linkText=""
              sx={{
                '& > h5': (theme) => ({
                  padding: theme.spacing(0),
                  color: theme.palette.error.dark,
                  height: 18,
                  margin: 0,
                  minWidth: 18,
                  ...theme.typography.subtitle2,
                }),
                '& > p': (theme) => ({
                  color: theme.palette.error.dark,
                  fontSize: 18,
                  margin: theme.spacing(0, 1),
                  ...theme.typography.subtitle2,
                }),
              }}
              maximumShowed="hours"
              timerDown={() => setCampagin(null)}
            />
          </Box>
          <Typography variant="subtitle2" color="error.dark">
            <FormattedMessage {...ProductionDetailMessages.specialOff} />
          </Typography>
        </Stack>
      )}
    </>
  )
}

export default Promotion

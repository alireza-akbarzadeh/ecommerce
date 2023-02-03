import { Box, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import careersMessage from '../careers.message'
import { WizardList, WizardListItem, WrapperStyle } from './CareersComponents.styles'

const AbsorptionProcess: FC = () => {
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { formatMessage } = useIntl()
  const absorptionProcessData = [
    {
      text: formatMessage(careersMessage.complianceWithQualityConditions),
    },
    {
      text: formatMessage(careersMessage.complianceWithOrganizationalCulture),
    },
    {
      text: formatMessage(careersMessage.matchingSpecializedKnowledge),
    },
    {
      text: formatMessage(careersMessage.financialAgreements),
    },
    {
      text: formatMessage(careersMessage.correctnessOfEmploymentRecords),
    },
    {
      text: formatMessage(careersMessage.startCooperation),
    },
  ]

  return (
    <WrapperStyle spacing={2}>
      <Stack direction="row" alignItems="center" mb={8} mt={breakpointDownSm ? 3 : 10}>
        <Typography variant="h4" color="info.dark">
          {formatMessage(careersMessage.process)}
        </Typography>
        <Typography variant="h4" color="primary.main">
          {formatMessage(careersMessage.absorptionInHastiBazar)}
        </Typography>
      </Stack>

      <WizardList>
        {absorptionProcessData.map((item, index) => (
          <WizardListItem>
            <Box
              sx={{
                '&::before':
                  ((index === 1 || index === 3) && breakpointDownSm) ||
                  (index === 2 && breakpointDownMd)
                    ? {
                        content: "''",
                        display: 'block',
                        width: '45%',
                        border: '1px dashed',
                        borderColor: 'primary.main',
                        height: '1px',
                        position: 'absolute',
                        right: '1%',
                        top: '25px',
                        zIndex: 0,
                      }
                    : {},
              }}
            >
              <span>{item.text}</span>
            </Box>
          </WizardListItem>
        ))}
      </WizardList>
    </WrapperStyle>
  )
}

export default AbsorptionProcess

import HBNumericFieldController from '@hasty-bazar/admin-shared/containers/HBNumericFieldController'
import { Box, InputAdornment, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import PlatformCarrierAgrrementsMessages from '../PlatformCarrierAgreementSettings.message'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

interface CurrencyModel {
  title: string
  name: string
  isRequired: boolean
  isDisable?: boolean
  isPercentage: boolean
}

const Currency = ({ title, name, isRequired, isDisable = false, isPercentage }: CurrencyModel) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  return (
    <HBNumericFieldController
      label={title}
      name={name}
      disabled={isDisable}
      formRules={{
        required: isRequired,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="grey.200"
              sx={{ height: 38, width: 56, mr: -3.25, borderRadius: 1, borderLeft: 'none' }}
            >
              {isPercentage ? (
                <Typography variant="body1" color="grey.400">
                  {formatMessage(PlatformCarrierAgrrementsMessages.percentage)}
                </Typography>
              ) : (
                <Typography variant="body1" color="grey.400">
                  {`${defaultCurrencyTitle}`}
                </Typography>
              )}
            </Box>
          </InputAdornment>
        ),
      }}
    />
  )
}

export default Currency

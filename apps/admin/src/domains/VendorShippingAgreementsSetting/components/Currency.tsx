import HBNumericFieldController from '@hasty-bazar/admin-shared/containers/HBNumericFieldController'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import { Box, InputAdornment, Typography } from '@mui/material'

interface CurrencyModel {
  title: string
  name: string
  isRequired: boolean
  isDisable: boolean
  error: boolean
}

const Currency = ({ title, name, isRequired, isDisable, error }: CurrencyModel) => {
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  return (
    <HBNumericFieldController
      label={title}
      name={name}
      disabled={isDisable}
      formRules={{
        required: isRequired,
      }}
      {...{ error }}
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
              <Typography variant="body1" color="grey.400">
                {`${defaultCurrencyTitle}`}
              </Typography>
            </Box>
          </InputAdornment>
        ),
      }}
    />
  )
}

export default Currency

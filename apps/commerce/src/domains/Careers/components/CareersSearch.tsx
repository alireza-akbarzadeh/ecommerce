import { HBButton, HBTextField } from '@hasty-bazar/core'
import {
  Box,
  Grid,
  outlinedInputClasses,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import careersMessage from '../careers.message'

const CareersSearch: FC = () => {
  const { formatMessage } = useIntl()
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Grid container flexDirection="column" alignItems="center">
      <Stack direction="row" alignItems="center" mb={8} mt={9}>
        <Typography variant={breakpointDownSm ? 'h5' : 'h4'} color="primary.main">
          {formatMessage(careersMessage.job)}
        </Typography>
        <Typography variant={breakpointDownSm ? 'h5' : 'h4'} color="info.dark">
          {formatMessage(careersMessage.searchYourAtention)}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} position="relative">
        <HBTextField
          dir="rtl"
          sx={(theme) => ({
            width: { sm: 407, xs: '100%' },
            bgcolor: 'common.white',
            [`& .${outlinedInputClasses.root}`]: {
              borderRadius: theme.spacing(2),
            },
          })}
          InputProps={{
            startAdornment: (
              <Box mr={2} mt={2}>
                <Image src={'/assets/svg/search.svg'} alt="search" width={16.56} height={16.63} />
              </Box>
            ),
          }}
        />
        <HBButton
          sx={{
            width: 74,
            minWidth: 74,
            position: 'absolute',
            right: 5,
            top: 4.4,
            boxShadow: 'none',
          }}
          size="small"
        >
          {formatMessage(careersMessage.search)}
        </HBButton>
      </Stack>
    </Grid>
  )
}

export default CareersSearch

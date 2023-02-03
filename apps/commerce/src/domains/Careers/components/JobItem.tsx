import { HBButton, HBIcon } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import { Grid, Stack, styled, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import careersMessage from '../careers.message'

const ItemLabel = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(8),
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.caption.fontSize,
    marginRight: theme.spacing(4),
  },
}))

const JobItem: FC = () => {
  const { formatMessage } = useIntl()
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Stack pb={3} pt={3} borderBottom={(theme) => `1px solid ${theme.palette.grey[200]}`}>
      {/* TODO_ROXANA: api service is not ready yet */}
      <Typography variant="h6" mb={2} fontWeight={fontWeights.fontWeightBold}>
        مدیر خرید (گروه دیجیتال)
      </Typography>
      <Grid container alignItems="center">
        <Grid
          item
          lg={8}
          container
          alignItems="flex-end"
          justifyContent={{ lg: 'flex-start', sm: 'center', xs: 'center' }}
        >
          <ItemLabel>
            <HBIcon type="locationPoint" size="small" sx={{ mr: 2 }} />
            تهران
          </ItemLabel>
          <ItemLabel>تمام وقت</ItemLabel>
          <ItemLabel>Tech & Product</ItemLabel>
          <ItemLabel color="primary.main">دورکاری</ItemLabel>
        </Grid>
        <Grid item lg={4} container justifyContent="flex-end">
          <HBButton
            variant="outlined"
            sx={(theme) => ({
              minWidth: breakpointDownSm ? 100 : 150,
              minHeight: 40,
              mt: 4,
              color: `${theme.palette.info.main} !important`,
              borderColor: `${theme.palette.info.main} !important`,
            })}
          >
            {formatMessage(careersMessage.viewDetail)}
          </HBButton>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default JobItem

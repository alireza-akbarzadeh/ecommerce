import { HBButton } from '@hasty-bazar/core'
import { Box, Grid, Stack, styled, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import aboutUsMessage from '../aboutUs.messages'

const WrapperStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4, 0, 0),
  marginBottom: theme.spacing(17.5),
}))

const NewsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 500,
  height: 300,
  background:
    'linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/assets/svg/aboutWhoWeAre.svg)',
  borderRadius: theme.spacing(5),
}))

const NewsButton = styled(HBButton)(({ theme }) => ({
  minWidth: 73,
  borderColor: `${theme.palette.common.white} !important`,
  color: `${theme.palette.common.white} !important`,
  height: 48,
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    borderColor: `${theme.palette.primary.main} !important`,
  },
}))

const News: FC = () => {
  const { formatMessage } = useIntl()

  return (
    <WrapperStyle justifyContent="flex-start">
      <Stack direction="row" alignItems="center">
        <Typography variant="h4" color="info.dark">
          {formatMessage(aboutUsMessage.news)}
        </Typography>
        <Typography variant="h4" color="primary.main">
          ({formatMessage(aboutUsMessage.companyName)})
        </Typography>
      </Stack>
      <Typography variant="subtitle2" color="text.primary" mt={8} mb={8}>
        {formatMessage(aboutUsMessage.newsMessage)}
      </Typography>
      <Grid container>
        <Grid item lg={6}>
          <NewsWrapper>
            <Stack direction="column">
              <Typography variant="h4" color="common.white">
                {/* TODO_ROXANA: api service is not ready yet */}
                در تیم هوش مصنوعی چه میگذرد؟
              </Typography>

              <Box display="flex" justifyContent="center" mt={4}>
                <NewsButton variant="outlined">{formatMessage(aboutUsMessage.study)}</NewsButton>
              </Box>
            </Stack>
          </NewsWrapper>
        </Grid>
        <Grid item lg={6} container justifyContent="flex-end">
          <NewsWrapper>
            <Stack direction="column">
              <Typography variant="h4" color="common.white">
                {/* TODO_ROXANA: api service is not ready yet */}
                در تیم هوش مصنوعی چه میگذرد؟
              </Typography>

              <Box display="flex" justifyContent="center" mt={4}>
                <NewsButton variant="outlined">{formatMessage(aboutUsMessage.study)}</NewsButton>
              </Box>
            </Stack>
          </NewsWrapper>
        </Grid>
      </Grid>
    </WrapperStyle>
  )
}

export default News

import { HBButton, HBIcon } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import { Box, Container, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import notFoundMessage from './notFound.messages'

interface INotFoundProps {
  title: string
  subTitle: string
}

const NotFoundPage = (props: INotFoundProps) => {
  const { title, subTitle } = props
  const { formatMessage } = useIntl()
  const router = useRouter()

  return (
    <Stack alignItems="center" sx={{ bgcolor: 'grey.100', width: '100%', marginBottom: 10, mt: 3 }}>
      <Container>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
          <Image src="/assets/svg/page-not-found.svg" width={183} height={136} />
          <Typography variant="h6" fontWeight={fontWeights.fontWeightBold} color="grey.900">
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="grey.500"
            sx={(theme) => ({ mt: `${theme.spacing(2)} !important` })}
          >
            {subTitle}
          </Typography>
          <Box mt={4}>
            <HBButton
              variant="contained"
              type="button"
              color="primary"
              onClick={() => router.push('/')}
            >
              <Typography variant="subtitle2" color="common.white">
                {formatMessage(notFoundMessage.backToMainPage)}
              </Typography>
              <HBIcon type="arrowLeft" sx={{ display: 'flex', alignItems: 'center' }} />
            </HBButton>
          </Box>
        </Stack>
      </Container>
    </Stack>
  )
}

export default NotFoundPage

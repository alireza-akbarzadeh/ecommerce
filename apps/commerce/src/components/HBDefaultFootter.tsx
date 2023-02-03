import { usePostWebSocialNewsLettersMutation } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBButton, HBTextField, openToast } from '@hasty-bazar/core'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { Box, Divider, Grid, Stack, styled, Typography, useMediaQuery, Theme } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import hbDefaultFooterMessage from './hbDefaultFooter.messages'
import packageJson from '../../../../package.json'

const FooterWrapperStyle = styled(Stack)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.lg,
  width: '100%',
}))

const GreyWrapperStyle = styled(Stack)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(10, 0),
}))

const HBDefaultFootter: FC<{ data?: any[] }> = ({ data }) => {
  const { formatMessage } = useIntl()
  const { asPath } = useRouter()
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { data: sessionData } = useSession()
  const [emailAddress, setEmailAddress] = useState<string>('')

  const [postWebSocialNewsLettersMutation] = usePostWebSocialNewsLettersMutation()
  const sendSocialNewsLetter = () => {
    postWebSocialNewsLettersMutation({
      ...ApiConstants,
      createNewsLetterModel: {
        emailAddress,
        newsLetterTypeCode: 1103001,
        partyId: sessionData?.user?.partyId,
        registerDate: new Date().toISOString(),
      },
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          openToast({
            message: formatMessage(hbDefaultFooterMessage.operationSuccessfullyDone),
            type: 'success',
          })
        } else {
          openToast({
            message: res.messages![0].message,
            type: 'error',
          })
        }
      })
  }

  if (asPath === '/basket/' && isSmallScreen) return null
  return (
    <GreyWrapperStyle alignItems="center" spacing={10}>
      <FooterWrapperStyle
        spacing={{ xs: 6, lg: 10 }}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
        px={{ sm: 6, lg: 'unset' }}
      >
        <Stack
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'unset' },
          }}
        >
          <Link href="/" passHref>
            <Box
              component="img"
              sx={{ objectFit: 'contain' }}
              src="/assets/logo.png"
              width={64}
              height={64}
              m="0 auto"
            />
          </Link>
          <Stack
            spacing={4}
            ml={10}
            sx={{ ml: { xs: 0, sm: 10 }, p: { xs: 4, sm: 0 }, mt: { xs: 6, sm: 0 } }}
          >
            <Typography
              variant="subtitle1"
              color="text.primary"
              sx={{ textAlign: { xs: 'center', sm: 'unset' } }}
            >
              {formatMessage(hbDefaultFooterMessage.enterYourEmailToGetTheLatestNews)}
            </Typography>
            <Grid container gap={2}>
              <Grid item xs>
                <HBTextField
                  sx={{ width: '100%', bgcolor: 'common.white' }}
                  placeholder={formatMessage(hbDefaultFooterMessage.enterYourEmail)}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </Grid>
              <Grid item>
                <HBButton sx={{ minWidth: 'auto', width: 54 }} onClick={sendSocialNewsLetter}>
                  {formatMessage(hbDefaultFooterMessage.save)}
                </HBButton>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing={6}
          alignItems="center"
          justifyContent="center"
          sx={{ width: { xs: '100%', sm: 'unset' } }}
        >
          <Box width={64} height={64}>
            <Image src="/assets/samandehi.png" height={64} width={64} />
          </Box>
          <Box width={64} height={64}>
            {/* eslint-disable react/jsx-no-target-blank */}
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=304155&amp;Code=CWAVGCIodF4V8igyroue"
            >
              <img
                referrerPolicy="origin"
                src="https://Trustseal.eNamad.ir/logo.aspx?id=304155&amp;Code=CWAVGCIodF4V8igyroue"
                alt=""
                style={{ cursor: 'pointer', width: 64, height: 64 }}
                id="CWAVGCIodF4V8igyroue"
              />
            </a>
          </Box>
        </Stack>
      </FooterWrapperStyle>
      <Divider sx={{ borderColor: 'common.white', width: '100%' }} />
      <Typography
        variant="body2"
        sx={{ textAlign: { xs: 'center', sm: 'unset' }, px: { xs: 6, sm: 'unset' } }}
      >
        {formatMessage(hbDefaultFooterMessage.copyRightIntellectual, {
          version: packageJson.version,
        })}
      </Typography>
    </GreyWrapperStyle>
  )
}

export default HBDefaultFootter

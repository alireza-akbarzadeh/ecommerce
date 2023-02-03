import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { usePostWebIdrCommercesSendEmailMutation } from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box, Grid, Stack, styled, Theme, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { ContactUsForm } from '../components'
import contactUsMessage from '../contactUs.messages'

export interface IFileUpload {
  id: string
  value: string
  contentType: number
  contentDuration?: string
}

export interface IContactUsForm {
  email: string
  mobile: string
  firstName: string
  lastName: string
  subject: string
  rule: string
  message: string
  attachments: IFileUpload[]
}

const WrapperStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4, 0, 0),
  marginBottom: theme.spacing(17.5),
  marginTop: theme.spacing(4),
}))

const ContactUsFormContainer: FC = () => {
  const { formatMessage } = useIntl()
  const breakpointUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const [sendEmailMutation] = usePostWebIdrCommercesSendEmailMutation()

  const onSendEmail = (values: IContactUsForm) => {
    sendEmailMutation({
      ...ApiConstants,
      sendEmailModel: {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        mobile: values.mobile,
        subject: values.subject,
        rule: values.rule,
        message: values.message,
        filePath: values.attachments[0].value,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        openToast({
          message: formatMessage(contactUsMessage.operationSuccessfullyDone),
          type: 'success',
        })
      }
    })
  }

  return (
    <WrapperStyle
      container
      justifyContent="flex-start"
      spacing={5}
      flexDirection={{ xs: 'column-reverse', md: 'row' }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={5}
        lg={5}
        container
        alignItems="center"
        justifyContent="center"
      >
        <Image src="/assets/svg/contactUs.svg" width={412} height={299} />
      </Grid>
      <Grid item xs={12} sm={12} md={7} lg={7}>
        <Box
          py={4}
          px={{ xs: 2, sm: 4.5 }}
          sx={(theme) => ({ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: 2 })}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{ borderBottom: '1px solid', borderBottomColor: 'grey.300', pb: 4, mb: 4 }}
          >
            <Typography variant="h4" color="primary.main">
              {formatMessage(contactUsMessage.contact)}
            </Typography>
            <Typography variant="h4" color="info.dark">
              {formatMessage(contactUsMessage.us)}
            </Typography>
          </Stack>

          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            whiteSpace="nowrap"
            flexWrap="wrap"
            mb={4}
          >
            <Typography variant="subtitle2" color="grey.900">
              {formatMessage(contactUsMessage.pleaseBeforeSendEmailOrPhoneCall)}
            </Typography>
            <Typography variant="subtitle2" color="primary.main">
              {formatMessage(contactUsMessage.faq)}
            </Typography>
            <Typography variant="subtitle2" color="grey.900">
              {formatMessage(contactUsMessage.read)}
            </Typography>
          </Stack>

          <HBForm<IContactUsForm> onSubmit={(values) => onSendEmail(values)} mode="all">
            <Box sx={{ mt: 2 }}>
              <Stack spacing={8} alignItems="flex-start">
                <ContactUsForm />
              </Stack>
            </Box>
          </HBForm>
        </Box>
      </Grid>
    </WrapperStyle>
  )
}

export default ContactUsFormContainer

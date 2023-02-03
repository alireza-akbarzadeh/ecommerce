import HBTextFieldController from '@hasty-bazar-commerce/components/HBTextFieldController'
import HBSelectController from '@hasty-bazar-commerce/containers/HBSelectController'
import { FormPatternsEnums } from '@hasty-bazar-commerce/core/enums'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Grid, selectClasses, Stack, Typography, useMediaQuery, Theme } from '@mui/material'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import contactUsMessage from '../contactUs.messages'
import { IContactUsForm } from '../containers/ContactUsFormContainer'
import FileUpload from '../containers/FileUpload'

const ContactUsForm: FC = () => {
  const breakpointOnlyXs = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'))
  const { formatMessage } = useIntl()

  const topicList = [
    {
      value: formatMessage(contactUsMessage.offers),
      title: formatMessage(contactUsMessage.offers),
    },
    {
      value: formatMessage(contactUsMessage.criticismOrComplaint),
      title: formatMessage(contactUsMessage.criticismOrComplaint),
    },
    {
      value: formatMessage(contactUsMessage.pursuingPurchasesAndOrdering),
      title: formatMessage(contactUsMessage.pursuingPurchasesAndOrdering),
    },
    {
      value: formatMessage(contactUsMessage.warrantyInquiry),
      title: formatMessage(contactUsMessage.warrantyInquiry),
    },
    {
      value: formatMessage(contactUsMessage.management),
      title: formatMessage(contactUsMessage.management),
    },
    {
      value: formatMessage(contactUsMessage.accountingAndFinance),
      title: formatMessage(contactUsMessage.accountingAndFinance),
    },
  ]

  const userTypeList = [
    {
      value: formatMessage(contactUsMessage.seller),
      title: formatMessage(contactUsMessage.seller),
    },
    {
      value: formatMessage(contactUsMessage.buyer),
      title: formatMessage(contactUsMessage.buyer),
    },
  ]

  const {
    formState: { isValid },
  } = useFormContext<IContactUsForm>()

  return (
    <Grid container rowSpacing={6} columnSpacing={{ xs: 2, sm: 5 }}>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HBTextFieldController
          fullWidth
          name="email"
          label={formatMessage(contactUsMessage.email)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(contactUsMessage.isRequired, {
                msg: formatMessage(contactUsMessage.email),
              }),
            },
            pattern: {
              value: new RegExp(FormPatternsEnums.Email),
              message: formatMessage(contactUsMessage.isWrong, {
                msg: formatMessage(contactUsMessage.email),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HBTextFieldController
          fullWidth
          name="mobile"
          label={formatMessage(contactUsMessage.phoneNumber)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(contactUsMessage.isRequired, {
                msg: formatMessage(contactUsMessage.phoneNumber),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HBTextFieldController
          fullWidth
          name="firstName"
          label={formatMessage(contactUsMessage.firstName)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(contactUsMessage.isRequired, {
                msg: formatMessage(contactUsMessage.firstName),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HBTextFieldController
          fullWidth
          name="lastName"
          label={formatMessage(contactUsMessage.lastName)}
          formRules={{
            required: {
              value: true,
              message: formatMessage(contactUsMessage.isRequired, {
                msg: formatMessage(contactUsMessage.lastName),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <HBSelectController
          fullWidth
          name="subject"
          required
          label={formatMessage(contactUsMessage.topic)}
          menuItem={topicList || []}
          formRules={{
            required: {
              value: true,
              message: formatMessage(contactUsMessage.isRequired, {
                msg: formatMessage(contactUsMessage.topic),
              }),
            },
          }}
          sx={{
            [`& .${selectClasses.icon}`]: {
              backgroundColor: (theme) => theme.palette.common.white,
              right: 0,
              width: 31,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <HBSelectController
          fullWidth
          name="rule"
          required
          label={formatMessage(contactUsMessage.youAs)}
          menuItem={userTypeList || []}
          formRules={{
            required: {
              value: true,
              message: formatMessage(contactUsMessage.isRequired, {
                msg: formatMessage(contactUsMessage.youAs),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <HBTextFieldController
          fullWidth
          name="message"
          label={formatMessage(contactUsMessage.message)}
          multiline
          rows={10}
          formRules={{
            required: {
              value: true,
              message: formatMessage(contactUsMessage.isRequired, {
                msg: formatMessage(contactUsMessage.message),
              }),
            },
          }}
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <FileUpload
          accept={'.png, .jpg, .mkv'}
          multiple={false}
          labelText={
            <Grid
              container
              alignItems="center"
              p={{ xs: 1, sm: 2 }}
              pb={{ xs: 3 }}
              sx={(theme) => ({ border: `1px dashed ${theme.palette.info.main}` })}
              borderRadius={4}
              width="100%"
              spacing={{ xs: 0, sm: 1 }}
            >
              <Grid item xs={12} sm={9} md={9} lg={9} container alignItems="center">
                <Stack direction="row" alignItems="center" pr={{ xs: 1, sm: 2 }}>
                  <HBIcon type="cloudUpload" size={breakpointOnlyXs ? 'small' : 'medium'} />
                  <Stack direction="column" ml={{ xs: 1, sm: 3 }} mb={{ xs: 2.5, sm: 0 }}>
                    <Typography
                      variant={breakpointOnlyXs ? 'overline' : 'button'}
                      color="text.black"
                      whiteSpace={{ md: 'nowrap' }}
                      marginBottom={{ xs: 1, sm: 0 }}
                    >
                      {formatMessage(contactUsMessage.selectAFileOrDragAndDropItHere)}
                    </Typography>
                    <Typography
                      variant={breakpointOnlyXs ? 'caption' : 'button'}
                      color="text.secondary"
                      whiteSpace={{ md: 'nowrap' }}
                    >
                      {formatMessage(contactUsMessage.fileSizeMessage)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={3} md={3} lg={3} textAlign={{ xs: 'center' }}>
                <Typography
                  sx={(theme) => ({
                    minWidth: 100,
                    border: `1px solid ${theme.palette.grey[300]}`,
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    cursor: 'pointer',
                  })}
                  variant="caption"
                >
                  {formatMessage(contactUsMessage.chooseFile)}
                </Typography>
              </Grid>
            </Grid>
          }
        />
      </Grid>

      <Grid item container justifyContent="flex-end" mt={6}>
        <HBButton variant="contained" type="submit" color="primary" sx={{ boxShadow: 'none' }}>
          {formatMessage(contactUsMessage.send)}
        </HBButton>
      </Grid>
    </Grid>
  )
}

export default ContactUsForm

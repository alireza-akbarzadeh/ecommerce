import { fontWeights } from '@hasty-bazar/material-provider'
import { Box, List, ListItem, listItemClasses, Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import contactUsMessage from '../ContactUs/contactUs.messages'
import privacyMessage from './privacy.messages'

const PrivacyPage = () => {
  const { formatMessage } = useIntl()
  return (
    <Box>
      <Typography variant="h4" color="grey.900" mb={4}>
        {formatMessage(privacyMessage.privacy)}
      </Typography>
      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc1)}
      </Typography>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc2)}
      </Typography>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc3)}
      </Typography>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc4)}
      </Typography>

      <List
        sx={{
          listStyleType: 'disc',
          pl: 2,
          [`& .${listItemClasses.root}`]: {
            display: 'list-item',
            pl: 1,
          },
        }}
      >
        <ListItem>
          <Typography
            variant="subtitle2"
            color="grey.900"
            textAlign="justify"
            sx={{ lineHeight: '31px !important' }}
          >
            {formatMessage(privacyMessage.privacyDesc5)}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography
            variant="subtitle2"
            color="grey.900"
            textAlign="justify"
            sx={{ lineHeight: '31px !important' }}
          >
            {formatMessage(privacyMessage.privacyDesc6)}
          </Typography>
        </ListItem>
      </List>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc7)}
      </Typography>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc8)}
      </Typography>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc9)}
      </Typography>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc10)}
      </Typography>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc11)}
      </Typography>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc12)}
      </Typography>

      <Typography
        variant="subtitle2"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
      >
        {formatMessage(privacyMessage.privacyDesc13)}
      </Typography>

      <Typography
        variant="subtitle1"
        color="grey.900"
        textAlign="justify"
        sx={{ lineHeight: '31px !important' }}
        mt={5}
        mb={3}
      >
        {formatMessage(privacyMessage.privacyDesc14)}
      </Typography>

      <Stack direction="row" alignItems="center" mb={3}>
        <Typography
          variant="subtitle1"
          fontWeight={fontWeights.fontWeightMedium}
          color="text.primary"
          mr={1}
        >
          {formatMessage(contactUsMessage.centralOffice)}:
        </Typography>
        <Typography variant="subtitle2">
          {formatMessage(contactUsMessage.companyAddress)}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" mb={3}>
        <Typography
          variant="subtitle1"
          fontWeight={fontWeights.fontWeightMedium}
          color="text.primary"
          mr={1}
        >
          {formatMessage(contactUsMessage.phoneCallAndFax)}:
        </Typography>
        <Typography variant="subtitle2">{formatMessage(contactUsMessage.phone)}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" mb={3}>
        <Typography
          variant="subtitle1"
          fontWeight={fontWeights.fontWeightMedium}
          color="text.primary"
          mr={1}
        >
          {formatMessage(contactUsMessage.email)}:
        </Typography>
        <Typography variant="subtitle2">{formatMessage(contactUsMessage.emailAddress)}</Typography>
      </Stack>
    </Box>
  )
}

export default PrivacyPage

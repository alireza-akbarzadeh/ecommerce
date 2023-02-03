import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAutocompleteController, HBIcon } from '@hasty-bazar/core'
import { Grid, Stack } from '@mui/material'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

export type UserContactFormProps = {
  disabled?: boolean
  isCopy?: boolean
  userRoles?: {
    value: string
    title: string
  }[]
}

export default function SocialForm({ disabled, isCopy, userRoles }: UserContactFormProps) {
  const { formatMessage } = useIntl()

  const [openPartyRole, setOpenPartyRole] = useState<boolean>(false)

  return (
    <Grid container spacing={8} alignItems="center" pr={5} mt={3}>
      <Grid item xs={12} sm={6} md={3}>
        <HBAutocompleteController
          label={formatMessage(phrasesMessages.role)}
          fieldName="partyRoleId"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={!disabled ? userRoles || [] : []}
          formRules={{ required: true }}
          required
          autoCompleteProps={{
            disabled,
            fullWidth: true,
            onClose: () => setOpenPartyRole(false),
            onOpen: () => setOpenPartyRole(true),
            open: openPartyRole,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={2} direction="row" alignItems="center">
          <HBIcon type="instagram" sx={{ mt: 1.5 }} />
          <HBTextFieldController
            disabled={disabled || isCopy}
            formRules={{
              required: false,
            }}
            name={'instagram'}
            label={formatMessage(phrasesMessages.instagram)}
            inputProps={{ dir: 'ltr' }}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={2} direction="row" alignItems="center">
          <HBIcon type="whatsappAlt" sx={{ mt: 1.5 }} />
          <HBTextFieldController
            disabled={disabled || isCopy}
            formRules={{
              required: false,
            }}
            name={'whatsApp'}
            label={formatMessage(phrasesMessages.whatsapp)}
            inputProps={{ dir: 'ltr' }}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={2} direction="row" alignItems="center">
          <HBIcon type="linkedinAlt" sx={{ mt: 1.5 }} />
          <HBTextFieldController
            disabled={disabled || isCopy}
            formRules={{
              required: false,
            }}
            name={'linkedIn'}
            label={formatMessage(phrasesMessages.linkedin)}
            inputProps={{ dir: 'ltr' }}
          />
        </Stack>
      </Grid>
    </Grid>
  )
}

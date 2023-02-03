import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { GetPartyAccountQueryResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAutocompleteController, HBButton, HBDialog, HBIcon } from '@hasty-bazar/core'
import { HBCheckBoxController } from '@hasty-bazar/auth'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { UserAddressType } from '../UserContacts'
import UserCheckBoxControl from './UserCheckBoxControl'
import { checkPositiveIntgerNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'

export type UserContactFormProps = {
  disabled?: boolean
  isCopyAddress?: boolean
  userRoles: {
    value: string
    title: string
  }[]
  provinceData: {
    value: string
    title: string
  }[]
  citiesData: {
    value: string
    title: string
  }[]
  account: GetPartyAccountQueryResult
}

export default function UserContactForm({
  disabled,
  isCopyAddress,
  userRoles,
  provinceData,
  citiesData,
  account,
}: UserContactFormProps) {
  disabled = isCopyAddress ? true : disabled

  const [isOpenHistoryDialog, setIsOpenHistoryDialog] = useState(false)
  const { setValue, watch, getValues } = useFormContext<UserAddressType>()

  const [openPartyRole, setOpenPartyRole] = useState<boolean>(false)
  const [openProvinceId, setOpenProvinceId] = useState<boolean>(false)
  const [openCityId, setOpenCityId] = useState<boolean>(false)

  const { formatMessage } = useIntl()

  const handleProvinceChange = (event: ChangeEvent<HTMLInputElement>, newValue: any) => {
    setValue('provinceId', newValue)
    setValue('cityId', undefined)
  }

  useEffect(() => {
    const isRecipient = watch('isRecipient')
    if (isRecipient) {
      setValue('recipientName', `${account?.firstName + ' ' + account?.lastName}`)
      setValue('recipientMobileNo', `${account?.mobile}`)
    }
  }, [watch('isRecipient')])

  return (
    <Grid container spacing={8} alignItems="center" pr={5}>
      <Grid item xs={12} sm={6} md={4}>
        <HBAutocompleteController
          label={formatMessage(phrasesMessages.role)}
          fieldName="partyRoleId"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={userRoles || []}
          formRules={{ required: true }}
          required
          autoCompleteProps={{
            disabled: disabled && !isCopyAddress,
            fullWidth: true,
            onClose: () => setOpenPartyRole(false),
            onOpen: () => setOpenPartyRole(true),
            open: openPartyRole,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          disabled={disabled}
          formRules={{ required: false, maxLength: 255 }}
          label={formatMessage(phrasesMessages.title)}
          name={'title'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <UserCheckBoxControl disabled={disabled} />
          <Typography variant="button" color="text.secondary">
            {formatMessage(userPageMessages.isDefaultForm)}
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <HBAutocompleteController
          label={formatMessage(phrasesMessages.province)}
          fieldName="provinceId"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={provinceData || []}
          formRules={{ required: true }}
          required
          autoCompleteProps={{
            disabled,
            fullWidth: true,
            onClose: () => setOpenProvinceId(false),
            onOpen: () => setOpenProvinceId(true),
            open: openProvinceId,
            onChange: handleProvinceChange,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBAutocompleteController
          label={formatMessage(phrasesMessages.city)}
          fieldName="cityId"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={citiesData || []}
          formRules={{ required: true }}
          required
          autoCompleteProps={{
            disabled,
            fullWidth: true,
            onClose: () => setOpenCityId(false),
            onOpen: () => setOpenCityId(true),
            open: openCityId,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          disabled={disabled}
          formRules={{
            required: false,
            maxLength: 255,
          }}
          label={formatMessage(phrasesMessages.district)}
          name={'district'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          disabled={disabled}
          required
          formRules={{ required: { value: true, message: '' } }}
          label={formatMessage(phrasesMessages.plaque)}
          name={'plaque'}
          type="number"
          onInput={checkPositiveIntgerNumber}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          disabled={disabled}
          name={'unit'}
          formRules={{ required: true }}
          label={formatMessage(phrasesMessages.unit)}
          type="number"
          onInput={checkPositiveIntgerNumber}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          disabled={disabled}
          required
          formRules={{
            maxLength: 10,
            validate: (value) => {
              if (String(value).length < 10) return false
              return /^\d+$/gi.test(value) || !value
            },
          }}
          type="number"
          label={formatMessage(phrasesMessages.postalCode)}
          name={'postalCode'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={12}>
        <HBTextFieldController
          disabled={disabled}
          required
          formRules={{
            required: true,
            maxLength: 255,
          }}
          label={formatMessage(phrasesMessages.address)}
          name={'streetLine'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <HBCheckBoxController
            noRule
            formName="isRecipient"
            disabled={disabled}
            onChange={(e, check: boolean) => {
              setValue('isRecipient', check, { shouldDirty: true, shouldTouch: true })
              if (check === false) {
                setValue('recipientName', '')
                setValue('recipientMobileNo', '')
              }
            }}
          />
          <Typography variant="button" color="text.secondary">
            {formatMessage(phrasesMessages.deliverUser)}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          disabled={disabled}
          InputProps={{
            readOnly: !!watch('isRecipient'),
          }}
          required
          formRules={{
            required: true,
            maxLength: 255,
          }}
          label={formatMessage(userPageMessages.recipientName)}
          name={'recipientName'}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          disabled={disabled}
          InputProps={{
            readOnly: !!watch('isRecipient'),
          }}
          required
          formRules={{
            validate: (value) => {
              return /^(\+98|0)?9\d{9}$/gi.test(value) || !value
            },
            required: true,
            maxLength: 20,
          }}
          type="number"
          label={formatMessage(userPageMessages.recipientMobileNo)}
          name={'recipientMobileNo'}
        />
      </Grid>
      {!disabled && (
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="button" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <HBIcon size="small" type="history" />{' '}
              {formatMessage(userPageMessages.addressRecordHistory)}
            </Typography>
            <HBButton variant="outlined" onClick={() => setIsOpenHistoryDialog(true)}>
              {formatMessage(userPageMessages.addressRecordHistoryShow)}
            </HBButton>
            <HBDialog
              open={isOpenHistoryDialog}
              onClose={() => setIsOpenHistoryDialog(false)}
              title={
                <Typography sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <HBIcon size="small" type="history" />
                  {formatMessage(userPageMessages.addressRecordHistory)}
                </Typography>
              }
              content={<HBRecordHistory data={getValues()} isBorder />}
            ></HBDialog>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

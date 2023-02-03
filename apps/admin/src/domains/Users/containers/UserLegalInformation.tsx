import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { GetPartyAccountQueryResult } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAutocompleteController, HBDialog, HBIcon } from '@hasty-bazar/core'
import { Grid, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { UserAccountProps } from '../UserDetailPage'
import userPageMessages from '../UserPage.messages'

export type SelectBoxOptionsType = {
  title: string
  value: string | number
}

type EditPermissionDialogType = {
  open: boolean
  field: string
}
type UserLegalInformationProps = {
  citiesItems: {
    title: string
    value: string | number
  }[]
  provincesItems: {
    title: string
    value: string | number
  }[]
  provinceId: string
  data: GetPartyAccountQueryResult
}

const UserLegalInformation = ({
  provincesItems,
  citiesItems,
  provinceId,
  data,
}: UserLegalInformationProps) => {
  const [legalNationalCodeLocked, setLegalNationalCodeLocked] = useState<boolean>(false)
  const [economicCodeLocked, setEconomicCodeLocked] = useState<boolean>(false)
  const [editPermissionDialogState, setEditPermissionDialogState] =
    useState<EditPermissionDialogType>({
      open: false,
      field: '',
    })

  const { formatMessage } = useIntl()

  const handleOpenPermissionDialog = (field: string) => {
    setEditPermissionDialogState({ open: true, field })
  }

  const handleClosePermissionDialog = () => {
    setEditPermissionDialogState({ open: false, field: '' })
  }

  const handleSetEditPermission = () => {
    if (editPermissionDialogState.field === 'economicCode') setEconomicCodeLocked(false)
    if (editPermissionDialogState.field === 'legalNationalCode') setLegalNationalCodeLocked(false)

    handleClosePermissionDialog()
  }

  useEffect(() => {
    if (data.economicCode) {
      setEconomicCodeLocked(true)
    }
  }, [data?.economicCode])

  useEffect(() => {
    if (data.legalNationalCode) {
      setLegalNationalCodeLocked(true)
    }
  }, [data?.legalNationalCode])

  return (
    <Grid container spacing={8}>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          required
          fullWidth
          name="companyName"
          size="small"
          label={formatMessage(userPageMessages.companyName)}
          formRules={{
            required: true,
            maxLength: 255,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          fullWidth
          type="number"
          name="economicCode"
          size="small"
          label={formatMessage(userPageMessages.economicCode)}
          formRules={{
            required: false,
          }}
          disabled={economicCodeLocked}
          InputProps={{
            endAdornment: economicCodeLocked && (
              <IconButton onClick={() => handleOpenPermissionDialog('economicCode')}>
                <HBIcon type="lock" />
              </IconButton>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          required
          fullWidth
          type="number"
          name="legalNationalCode"
          size="small"
          label={formatMessage(userPageMessages.legalNationalCode)}
          formRules={{
            required: true,
            maxLength: {
              value: 11,
              message: formatMessage(validationsMessages.maxValue, { maxValue: 11 }),
            },
            minLength: {
              value: 11,
              message: formatMessage(validationsMessages.minLengthValidation, { count: 11 }),
            },
          }}
          disabled={legalNationalCodeLocked}
          InputProps={{
            endAdornment: legalNationalCodeLocked && (
              <IconButton onClick={() => handleOpenPermissionDialog('legalNationalCode')}>
                <HBIcon type="lock" />
              </IconButton>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          required
          fullWidth
          type="number"
          name="registerationNo"
          size="small"
          label={formatMessage(userPageMessages.registerId)}
          formRules={{
            required: true,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          required
          fullWidth
          type="number"
          name="phoneNo"
          size="small"
          label={formatMessage(userPageMessages.phoneNo)}
          formRules={{
            required: true,
            maxLength: 20,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          fullWidth
          name="companyEmail"
          size="small"
          label={formatMessage(userPageMessages.email)}
          formRules={{
            required: false,
            maxLength: 100,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBAutocompleteController<UserAccountProps, SelectBoxOptionsType>
          label={formatMessage(userPageMessages.provinceName)}
          fieldName="companyProvinceId"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={provincesItems}
          formRules={{ required: true }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBAutocompleteController<UserAccountProps, SelectBoxOptionsType>
          label={formatMessage(userPageMessages.cityName)}
          fieldName="companyCityId"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={citiesItems}
          formRules={{ required: false }}
          autoCompleteProps={{
            disabled: !provinceId,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <HBTextFieldController
          fullWidth
          name="address"
          size="small"
          label={formatMessage(userPageMessages.address)}
          formRules={{
            required: false,
            maxLength: 1024,
          }}
        />
      </Grid>
      <HBDialog
        content={formatMessage(userPageMessages.permissionDialogContent)}
        title={formatMessage(userPageMessages.edit)}
        onAccept={handleSetEditPermission}
        onReject={handleClosePermissionDialog}
        open={editPermissionDialogState.open}
        onClose={handleClosePermissionDialog}
        acceptBtn={formatMessage(userPageMessages.accept)}
        rejectBtn={formatMessage(userPageMessages.reject)}
      />
    </Grid>
  )
}

export default UserLegalInformation

import { HBWorkflowInput } from '@hasty-bazar/admin-shared/containers'
import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  useGetAdminIdrPartiesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetNationalCodeState,
  useGetAdminIdrPartiesGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetNationalCodeStateList,
  usePostAdminIdrPartiesChangeStateMutation as useChangeNationalCodeState,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAutocompleteController, HBDialog, HBIcon } from '@hasty-bazar/core'
import { Grid, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { UserAccountProps } from '../UserDetailPage'
import userPageMessages from '../UserPage.messages'

type EditPermissionDialogType = {
  open: boolean
  field: string
}

const UserRealInformation = ({
  userId,
  onRefresh,
  account,
  genders,
  isAdmin,
}: {
  userId: string
  onRefresh: () => void
  account: any
  genders: GetBusinessTypeValuesByBusinessTypeQueryResult[] | null
  isAdmin?: boolean
}) => {
  const [phoneNumberLocked, setPhoneNumberLocked] = useState<boolean>(true)
  const [nationalCodeLocked, setNationalCodeLocked] = useState(false)
  const [editPermissionDialogState, setEditPermissionDialogState] =
    useState<EditPermissionDialogType>({
      open: false,
      field: '',
    })
  const [loadingNationalCode, setLoadingNationalCode] = useState(false)
  const { control } = useFormContext<UserAccountProps>()

  const { nationalCodeStateCode, mobileStateName, mobileStateCode } = useWatch({
    control,
  })

  useEffect(() => {
    if (nationalCodeStateCode === '1') {
      setNationalCodeLocked(true)
    }
  }, [nationalCodeStateCode])

  useEffect(() => {
    mobileStateCode === '2' ? setPhoneNumberLocked(true) : setPhoneNumberLocked(false)
  }, [mobileStateCode])

  const { formatMessage } = useIntl()

  const handleOpenPermissionDialog = (field: string) => {
    setEditPermissionDialogState({ open: true, field })
  }

  const handleClosePermissionDialog = () => {
    setEditPermissionDialogState({ open: false, field: '' })
  }

  const handleSetEditPermission = () => {
    if (editPermissionDialogState.field === 'phoneNumber') setPhoneNumberLocked(false)
    if (editPermissionDialogState.field === 'nationalCode') setNationalCodeLocked(false)

    handleClosePermissionDialog()
  }

  const getStatusCodeColor = () => {
    if (mobileStateCode === '1') return 'warning.main'
    else if (mobileStateCode === '2') return 'success.main'
  }

  return (
    <Grid container spacing={8}>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          required
          name="firstName"
          size="small"
          label={formatMessage(userPageMessages.firstName)}
          formRules={{
            maxLength: 255,
            required: {
              value: true,
              message: `${formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(userPageMessages.firstName),
              })}`,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          required
          name="lastName"
          size="small"
          label={formatMessage(userPageMessages.lastName)}
          formRules={{
            maxLength: 255,
            required: {
              value: true,
              message: `${formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(userPageMessages.lastName),
              })}`,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          name="nationalCode"
          maskOptions={{ mask: '0000000000', valueType: 'unmaskedValue' }}
          size="small"
          label={formatMessage(userPageMessages.nationalCode)}
          formRules={{
            maxLength: 10,
            required: { value: false, message: '' },
          }}
          disabled={nationalCodeLocked || loadingNationalCode}
          InputLabelProps={{
            required: false,
          }}
          InputProps={{
            endAdornment: nationalCodeLocked && (
              <IconButton onClick={() => handleOpenPermissionDialog('nationalCode')}>
                <HBIcon type="lock" />
              </IconButton>
            ),
          }}
        />

        {account?.nationalCode && (
          <HBWorkflowInput
            entityId={userId}
            factor="1"
            machineCode={StateMachineCode.NationalCode}
            onChangeState={onRefresh}
            stateCode={nationalCodeStateCode!}
            useChangeState={useChangeNationalCodeState}
            useGetState={useGetNationalCodeState}
            useGetStateList={useGetNationalCodeStateList}
            setLoading={setLoadingNationalCode}
          />
        )}
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBDatePickerController
          label={formatMessage(userPageMessages.birthDate)}
          name="birthDate"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBAutocompleteController
          label={formatMessage(userPageMessages.gender)}
          fieldName="gender"
          isOptionEqualToValue={(o, v) => o.value == v.value}
          getOptionLabel={(option) => `${option.title}`}
          options={genders?.map((gender) => ({ title: gender.title!, value: gender.id! })) || []}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <HBTextFieldController
          required
          name="mobile"
          size="small"
          label={formatMessage(userPageMessages.phoneNumber)}
          formRules={{
            maxLength: 20,
            pattern: {
              value: /^(\+98|0)?9\d{9}$/g,
              message: formatMessage(userPageMessages.formItemMobileNotSuccess),
            },
            required: {
              value: true,
              message: `${formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(userPageMessages.phoneNumber),
              })}`,
            },
          }}
          disabled={phoneNumberLocked}
          InputProps={{
            endAdornment: phoneNumberLocked && (
              <IconButton onClick={() => handleOpenPermissionDialog('phoneNumber')}>
                <HBIcon type="lock" />
              </IconButton>
            ),
          }}
        />
        <Typography
          variant="caption"
          sx={{ color: getStatusCodeColor(), display: 'flex', alignItems: 'center' }}
        >
          {mobileStateCode === '2' && <HBIcon type="check" />}
          {mobileStateCode === '1' && <HBIcon type="exclamation" />}
          {mobileStateName}
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <HBTextFieldController
          inputProps={{ dir: 'ltr' }}
          InputLabelProps={{ required: !!isAdmin }}
          name="email"
          label={formatMessage(userPageMessages.formItemEmail)}
          formRules={{
            maxLength: 255,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: formatMessage(userPageMessages.formItemEmailNotSuccess),
            },
            required: {
              value: !!isAdmin,
              message: formatMessage(userPageMessages.formItemEmailIsRequired),
            },
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

export default UserRealInformation

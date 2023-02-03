import { HBWorkflowInput } from '@hasty-bazar/admin-shared/containers'
import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { BusinessTypeEnum } from '@hasty-bazar/admin-shared/core/utils/contentTypes'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetPartyQueryResult,
  useGetAdminIdrPartiesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetNationalCodeState,
  useGetAdminIdrPartiesGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetNationalCodeStateList,
  usePostAdminIdrPartiesChangeStateMutation as useChangeNationalCodeState,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBButton, HBDialog, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { UserAddEditFormType } from '../UserAddEditPage'
import userPageMessages from '../UserPage.messages'
interface UserAddEditFormProps {
  isEdit?: boolean
  refreshData: () => void
  id: string
  usersData: GetPartyQueryResult | undefined
  isLoading?: boolean
}

const UserAddEditForm: FC<UserAddEditFormProps> = ({
  id: userId,
  refreshData,
  usersData,
  isLoading,
}) => {
  const router = useRouter()
  const { breakpoints } = useTheme()
  const [openDirtyModel, setOpenDirtyModel] = useState(false)
  const [phoneNumberLocked, setPhoneNumberLocked] = useState<boolean>(true)
  const [nationalCodeLocked, setNationalCodeLocked] = useState<boolean>(false)
  const [editPermissionDialogState, setEditPermissionDialogState] = useState({
    open: false,
    field: '',
  })

  const {
    formState: { isValid, isDirty },
    watch,
    control,
  } = useFormContext<UserAddEditFormType>()

  //@ts-ignore
  const { nationalCodeStateCode, passwordState, mobileStateName, mobileStateCode } = useWatch({
    control,
  })

  useEffect(() => {
    usersData?.mobile && usersData.mobileStateCode === '2'
      ? setPhoneNumberLocked(true)
      : setPhoneNumberLocked(false)
  }, [usersData])

  useEffect(() => {
    if (nationalCodeStateCode === '1') {
      setNationalCodeLocked(true)
    }
  }, [nationalCodeStateCode])

  const { formatMessage } = useIntl()

  const { data: { data: { items: genders = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnum.Gender,
    })

  const handleBackRoute = () => {
    if (!isDirty) router.push('/users')
    else setOpenDirtyModel(true)
  }

  const handleOpenPermissionDialog = (field: string) => {
    setEditPermissionDialogState({ open: true, field })
  }

  const handleClosePermissionDialog = () => {
    setEditPermissionDialogState({ open: false, field: '' })
  }

  const handleSetEditPermission = () => {
    if (editPermissionDialogState.field === 'phoneNumber') setPhoneNumberLocked(false)
    else if (editPermissionDialogState.field === 'nationalCode') setNationalCodeLocked(false)

    handleClosePermissionDialog()
  }

  const getStatusCodeColor = () => {
    if (mobileStateCode == '1') return 'warning.main'
    else if (mobileStateCode == '2') return 'success.main'
  }

  return (
    <>
      <Box>
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item>
            <Typography variant="h4" mb={4} color="text.primary">
              {formatMessage(userPageMessages.userEditPage)}
            </Typography>
          </Grid>
          <Grid item>
            <Stack
              spacing={{ xs: 4, sm: 0, md: 4 }}
              flexDirection={{ xs: 'column', sm: 'row', md: 'column' }}
              justifyContent="space-between"
              mt={{ xs: 6, sm: 0 }}
            >
              <Box display="flex" gap={6} justifyContent="flex-end">
                <Typography component="label" variant="body1" color="text.primary">
                  {formatMessage(userPageMessages.formItemIsActive)}
                </Typography>
                <HBSwitchController name="isActive" />
              </Box>
              {watch('id') && (
                <Box display="flex" alignItems="center" gap={4} justifyContent="flex-end">
                  <Typography component="label" variant="body1" color="text.primary">
                    {formatMessage(userPageMessages.statePassword)}
                  </Typography>
                  <Typography
                    component="label"
                    variant="caption"
                    sx={({ palette }) => ({
                      bgcolor:
                        passwordState === 2
                          ? palette.warning.light
                          : passwordState === 0
                          ? palette.error.light
                          : palette.success.light,
                      color:
                        passwordState === 2
                          ? palette.warning.main
                          : passwordState === 0
                          ? palette.error.main
                          : palette.success.main,
                      p: 4,
                      py: 0.5,
                      borderRadius: 8,
                    })}
                  >
                    {passwordState === 2
                      ? formatMessage(userPageMessages.stateExpired)
                      : passwordState === 0
                      ? formatMessage(userPageMessages.stateNotSet)
                      : formatMessage(userPageMessages.stateSet)}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={4}>
            <HBTextFieldController
              fullWidth
              name="firstName"
              label={formatMessage(userPageMessages.formItemName)}
              formRules={{
                maxLength: 255,
                pattern: {
                  value: /^[A-Za-z\u0600-\u06FF\s]{2,}$/i,
                  message: formatMessage(userPageMessages.formItemNameNotSuccess),
                },
                required: {
                  value: true,
                  message: `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(userPageMessages.formItemName),
                  })}`,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HBTextFieldController
              fullWidth
              name="lastName"
              label={formatMessage(userPageMessages.formItemLastName)}
              formRules={{
                maxLength: 255,
                pattern: {
                  value: /^[A-Za-z\u0600-\u06FF\s]{2,}$/i,
                  message: formatMessage(userPageMessages.formItemLastNameNotSuccess),
                },
                required: {
                  value: true,
                  message: `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(userPageMessages.formItemLastName),
                  })}`,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HBTextFieldController
              name="nationalCode"
              maskOptions={{ mask: '0000000000', valueType: 'unmaskedValue' }}
              size="small"
              label={formatMessage(userPageMessages.formItemNationalCode)}
              formRules={{
                required: false,
                maxLength: 10,
              }}
              disabled={nationalCodeLocked}
              InputProps={{
                endAdornment: nationalCodeLocked && (
                  <IconButton onClick={() => handleOpenPermissionDialog('nationalCode')}>
                    <HBIcon type="lock" />
                  </IconButton>
                ),
              }}
            />
            {usersData?.nationalCode && (
              <HBWorkflowInput
                entityId={userId}
                factor="1"
                machineCode={StateMachineCode.NationalCode}
                onChangeState={refreshData}
                stateCode={nationalCodeStateCode!}
                useChangeState={useChangeNationalCodeState}
                useGetState={useGetNationalCodeState}
                useGetStateList={useGetNationalCodeStateList}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <HBDatePickerController
              label={formatMessage(userPageMessages.birthDate)}
              name="birthDate"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {genders && (
              <HBSelectController
                fullWidth
                name="gender"
                label={formatMessage(userPageMessages.gender)}
                menuItem={
                  genders?.map((gender) => ({ title: gender.title!, value: gender.id! })) || []
                }
                formRules={{
                  required: false,
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <HBTextFieldController
              name="mobile"
              label={formatMessage(userPageMessages.formItemMobile)}
              formRules={{
                maxLength: 20,
                pattern: {
                  value: /^(\+98|0)?9\d{9}$/g,
                  message: formatMessage(userPageMessages.formItemMobileNotSuccess),
                },
                required: {
                  value: true,
                  message: formatMessage(userPageMessages.formItemMobile),
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
              name="email"
              label={formatMessage(userPageMessages.formItemEmail)}
              formRules={{
                maxLength: 255,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: formatMessage(userPageMessages.formItemEmailNotSuccess),
                },
                required: false,
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={8}>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'large'}
          variant="outlined"
          onClick={handleBackRoute}
        >
          {formatMessage(phrasesMessages.back)}
        </HBButton>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'large'}
          sx={{
            width: 152,
            mx: 1,
            '&.Mui-disabled': {
              bgcolor: 'primary.main',
              opacity: '0.3',
              color: 'background.paper',
            },
          }}
          type="submit"
          disabled={!isValid || !isDirty}
          color="primary"
          loading={isLoading}
        >
          {formatMessage(phrasesMessages.confirm)}
        </HBButton>
      </Box>
      <HBDialog
        title={formatMessage(userPageMessages.save)}
        content={formatMessage(userPageMessages.wouldYouLikeToSaveTheChanges)}
        onAccept={() => setOpenDirtyModel(false)}
        onReject={() => router.push('/users')}
        open={openDirtyModel}
        onClose={() => setOpenDirtyModel(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
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
    </>
  )
}

export default UserAddEditForm

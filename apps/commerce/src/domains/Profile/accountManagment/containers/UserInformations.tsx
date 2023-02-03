import AdapterDateFns from '@date-io/date-fns-jalali'
import { CommerceAccordion, HBCheckStatus } from '@hasty-bazar-commerce/components'
import { GenderSelect } from '@hasty-bazar-commerce/containers'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { FormPatternsEnums, NationalCodeStateEnum } from '@hasty-bazar-commerce/core/enums'
import {
  useLazyGetWebIdrCustomersByIdIndividualQuery,
  usePutWebIdrCustomersByIdIndividualMutation,
  usePutWebIdrPartiesByIdCheckNationalCodeMutation,
} from '@hasty-bazar-commerce/layout/ProfileLayout/profile.enhanced'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBIcon, HBTextField, HBToast } from '@hasty-bazar/core'
import {
  Box,
  formHelperTextClasses,
  Grid,
  InputAdornment,
  outlinedInputClasses,
  Stack,
  Typography,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { format } from 'date-fns-jalali'
import dayJs from 'dayjs'
import HBModalDatePicker from 'libs/core/src/components/HBModalDatePicker/HBModalDatePicker'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ShowTostType } from '../../addressManagment/AddressManagment'
import profileMessage from '../../profile.messages'
import { ChangePasswordDialog } from './changePassword'
import { ChangePhoneNumberDialog } from './changePhoneNumber'
export interface IInformation {
  firstName?: string
  lastName?: string
  nationalCode?: string
  birthDate?: string
  gender?: number | null
  mobile?: string
}

const dateFormat = 'YYYY-MM-DDTHH:mm:ss'
const jalaliDateFormat = 'yyyy-MM-dd'

const UserInformations = () => {
  const MAX_DATE = new Date(
    new Date().getFullYear() - 15,
    new Date().getMonth(),
    new Date().getDate(),
  )
  const { formatMessage } = useIntl()
  const { data } = useSession()
  const {
    setValue,
    watch,
    control,
    formState: { dirtyFields, isValid },
    reset,
  } = useFormContext<IInformation>()
  const formValues: IInformation = {
    birthDate: watch('birthDate'),
    firstName: watch('firstName'),
    gender: watch('gender'),
    lastName: watch('lastName'),
    nationalCode: watch('nationalCode'),
    mobile: watch('mobile'),
  }

  const [genders, setGenders] = useState<GetBusinessTypeValuesQueryResult[]>()
  const [openChangePasswordDialog, setChangePasswordDialog] = useState<boolean>(false)
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false)
  const [openChangeMobileNumberDialog, setOpenChangeMobileNumberDialog] = useState<boolean>(false)
  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })
  const lastNationalCode = useRef<string | undefined>('')

  const user = data?.user ?? null
  const [refetch, { data: individualData }] = useLazyGetWebIdrCustomersByIdIndividualQuery()
  const [updaterequest, { isLoading, isSuccess, isError }] =
    usePutWebIdrCustomersByIdIndividualMutation()
  const [
    checkNationalCodeValidation,
    { data: checkNationalCodeValidationData, isError: checkNationalValidationError },
  ] = usePutWebIdrPartiesByIdCheckNationalCodeMutation()

  const informations = individualData?.data || null

  useEffect(() => {
    if (user?.partyRoleId)
      refetch({
        ...ApiConstants,
        id: user?.partyRoleId!,
      })
  }, [user?.partyId])

  useEffect(() => {
    if (informations && user) {
      reset({
        birthDate: informations?.birthDate ?? undefined,
        firstName: informations?.firstName ?? undefined,
        lastName: informations?.lastName ?? undefined,
        gender: informations?.gender ? +informations?.gender : null,
        nationalCode: informations?.nationalCode ?? undefined,
        mobile: informations.mobileNo ?? undefined,
      })
    }
  }, [informations, user?.partyId])

  const updateInformations = () => {
    updaterequest({
      ...ApiConstants,
      id: user!.partyRoleId!,
      updateIndividualCustomerModel: {
        birthDate: formValues.birthDate,
        firstName: formValues.firstName,
        gender: formValues.gender,
        lastName: formValues.lastName,
        nationalCode: formValues.nationalCode,
      },
    })
      .unwrap()
      .then((res) => {
        if (res.success) {
          setShowToast({
            message: formatMessage(profileMessage.dataWasEditedSuccessfully),
            open: true,
            type: 'success',
          })
          refetch({
            ...ApiConstants,
            id: user?.partyRoleId!,
          })
          if (
            watch('nationalCode') &&
            !!individualData?.data?.nationalCodeStateCode &&
            individualData?.data?.nationalCodeStateCode !== NationalCodeStateEnum.Published &&
            !!user?.partyId &&
            watch('nationalCode') !== lastNationalCode.current
          ) {
            checkNationalCodeValidation({
              ...ApiConstants,
              checkNationalCodeCommand: { nationalCode: formValues.nationalCode },
              id: user?.partyId,
            })
            lastNationalCode.current = watch('nationalCode')
          }
        }
      })
      .catch((err) => {
        return
      })
  }

  const convertStringToDate = (date?: string) => {
    if (!date) return null
    return dayJs(dayJs(date).format(dateFormat), dateFormat).toDate()
  }

  const convertDateToJalali = () => {
    const date = convertStringToDate(watch('birthDate'))

    if (!date) {
      return ''
    }

    return format(dayJs(dayJs(date).format(dateFormat), dateFormat).toDate(), jalaliDateFormat)
  }

  const dirtyFieldsList = Object.entries(dirtyFields || []).reduce(
    (list: string[], [key, value]: [string, boolean]) => (value ? [...list, key] : list),
    [],
  )

  return (
    <>
      <Stack sx={{ width: '100%' }} spacing={8}>
        <CommerceAccordion
          open
          summaryButton={
            <HBButton
              disabled={
                (dirtyFieldsList.length === 0 &&
                  (watch('birthDate') === informations?.birthDate || !watch('birthDate'))) ||
                !watch('firstName') ||
                !watch('lastName') ||
                (!!watch('nationalCode') && watch('nationalCode')?.length !== 10) ||
                !isValid
              }
              type="submit"
              onClick={(e) => {
                e.stopPropagation()
                updateInformations()
              }}
              loading={isLoading}
            >
              {formatMessage(profileMessage.registerChanges)}
            </HBButton>
          }
          summaryTitle={formatMessage(profileMessage.userInformation)}
        >
          <Grid container rowSpacing={6} columnSpacing={4}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Stack spacing={2}>
                <HBTextFieldController
                  name="mobile"
                  label={formatMessage(profileMessage.mobileNumber)}
                  InputProps={{ readOnly: true }}
                  disabled
                  inputAlign="end"
                />

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <HBCheckStatus
                    status={
                      individualData?.data?.mobileNoStateCode === '2' ? 'accepted' : 'rejected'
                    }
                  />
                  <Box onClick={() => setOpenChangeMobileNumberDialog(true)}>
                    <Typography variant="caption" color="info.main" sx={{ cursor: 'pointer' }}>
                      {formatMessage(profileMessage.changeMobileNumberRequest)}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Stack spacing={2}>
                <HBTextFieldController
                  name="nationalCode"
                  label={formatMessage(profileMessage.nationalNumber)}
                  type="number"
                  mask="0000000000"
                  inputProps={{ maxLength: 10, minLength: 10 }}
                  formRules={{ required: false }}
                  sx={{
                    direction: 'rtl',
                    [`& .${formHelperTextClasses.root}`]: {
                      direction: 'ltr',
                    },
                  }}
                />
                {!!individualData?.data?.nationalCode &&
                  watch('nationalCode')?.toString().length === 10 &&
                  individualData?.data?.nationalCode === watch('nationalCode') && (
                    <HBCheckStatus
                      status={
                        individualData?.data?.nationalCodeStateCode ===
                        NationalCodeStateEnum.Published
                          ? 'accepted'
                          : checkNationalCodeValidationData?.data
                          ? 'accepted'
                          : checkNationalValidationError
                          ? 'rejected'
                          : 'pending'
                      }
                    />
                  )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <HBTextFieldController
                name="firstName"
                label={formatMessage(profileMessage.firstName)}
                formRules={{
                  pattern: {
                    value: new RegExp(FormPatternsEnums.PersianText),
                    message: formatMessage(profileMessage.enterWithPersianNumber, {
                      name: formatMessage(profileMessage.firstName),
                    }),
                  },
                  required: {
                    value: true,
                    message: formatMessage(profileMessage.isRequired, {
                      msg: formatMessage(profileMessage.firstName),
                    }),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <HBTextFieldController
                name="lastName"
                label={formatMessage(profileMessage.lastName)}
                formRules={{
                  pattern: {
                    value: new RegExp(FormPatternsEnums.PersianText),
                    message: formatMessage(profileMessage.enterWithPersianNumber, {
                      name: formatMessage(profileMessage.lastName),
                    }),
                  },
                  required: {
                    value: true,
                    message: formatMessage(profileMessage.isRequired, {
                      msg: formatMessage(profileMessage.lastName),
                    }),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <HBTextField
                label={formatMessage(profileMessage.birthDate)}
                InputProps={{ readOnly: true }}
                onClick={() => setOpenDatePicker(true)}
                value={convertDateToJalali()}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <GenderSelect
                returnedValues={(genders) => setGenders(genders)}
                type="controlled"
                controlledProps={{
                  fullWidth: true,
                  name: 'gender',
                  label: formatMessage(profileMessage.gender),
                  formRules: {},
                  menuItem: [],
                  sx: { width: '100%' },
                  customControl: control,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <HBTextField
                label={formatMessage(profileMessage.password)}
                value="********"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <HBButton
                        disabled={isLoading}
                        variant="text"
                        sx={{ minWidth: 20, px: 0 }}
                        onClick={() => setChangePasswordDialog(true)}
                      >
                        <HBIcon
                          type="edit"
                          size="small"
                          sx={{ color: 'grey.900', display: 'flex' }}
                        />
                      </HBButton>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                sx={{
                  [`& .${outlinedInputClasses.root}`]: {
                    pr: 1,
                  },
                }}
              />
            </Grid>
          </Grid>
        </CommerceAccordion>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <HBModalDatePicker
            open={openDatePicker}
            onChange={(date) => {
              setValue('birthDate', dayJs(date as Date).format(dateFormat))
            }}
            onClose={() => setOpenDatePicker(false)}
            value={convertStringToDate(watch('birthDate')) ?? MAX_DATE}
            maxDate={MAX_DATE}
          />
        </LocalizationProvider>
        <ChangePhoneNumberDialog
          mobileNumberChanged={(newMobileNumber) => {
            setOpenChangeMobileNumberDialog(false)
            setValue('mobile', `09${newMobileNumber}`)
          }}
          onClose={() => setOpenChangeMobileNumberDialog(false)}
          open={openChangeMobileNumberDialog}
        />
      </Stack>
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        vertical="top"
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />

      <ChangePasswordDialog
        open={openChangePasswordDialog}
        onClose={() => {
          setChangePasswordDialog(false)
        }}
        userName={informations?.mobileNo || ''}
      />
    </>
  )
}

export default UserInformations

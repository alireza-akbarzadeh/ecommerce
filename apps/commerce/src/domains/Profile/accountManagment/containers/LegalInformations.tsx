import { CommerceAccordion, HBCheckStatus } from '@hasty-bazar-commerce/components'
import { IranLocalitySelect } from '@hasty-bazar-commerce/containers'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  useGetWebIdrCustomersByIdLegalQuery,
  usePutWebIdrCustomersByIdLegalMutation,
} from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBToast } from '@hasty-bazar/core'
import { Grid, Stack } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ShowTostType } from '../../addressManagment/AddressManagment'
import profileMessage from '../../profile.messages'
import AccountMessages from '../account.messages'
export interface IForm {
  companyName: string
  economicCode: string
  nationalCode: string
  registerNo: string
  provinceId: string
  cityId: string
  email: string
  phoneNo: string
}

const LegalInformations = () => {
  const { formatMessage } = useIntl()
  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })

  const { data } = useSession()
  const user = data?.user ?? null
  const {
    watch,
    control,
    formState: { errors, dirtyFields },
    reset,
  } = useFormContext<IForm>()

  const {
    data: legalData,
    refetch,
    error: gettingLegalError,
  } = useGetWebIdrCustomersByIdLegalQuery(
    {
      ...ApiConstants,
      id: user?.partyRoleId!,
    },
    { skip: !user },
  )

  const [updateLegalRequest, { isLoading }] = usePutWebIdrCustomersByIdLegalMutation()

  useEffect(() => {
    if (user) {
      refetch()
    }
  }, [user])

  const legal = legalData?.data || null

  useEffect(() => {
    if (legal) {
      reset({
        cityId: legal?.cityId ?? '',
        companyName: legal?.companyName ?? '',
        economicCode: legal?.economicCode ?? '',
        email: legal?.email ?? '',
        nationalCode: legal?.nationalCode ?? '',
        phoneNo: legal?.phoneNo ?? '',
        provinceId: legal?.provinceId ?? '',
        registerNo: legal?.registerNo ?? '',
      })
    }
  }, [legal])

  const formValues: IForm = {
    companyName: watch('companyName'),
    economicCode: watch('economicCode'),
    nationalCode: watch('nationalCode'),
    registerNo: watch('registerNo'),
    provinceId: watch('provinceId'),
    cityId: watch('cityId'),
    email: watch('email'),
    phoneNo: watch('phoneNo'),
  }

  const isDisableSubmitButton = () => {
    if (
      !formValues.cityId ||
      !formValues.companyName ||
      !formValues.economicCode ||
      !formValues.email ||
      !formValues.nationalCode ||
      !formValues.phoneNo ||
      !formValues.provinceId ||
      !formValues.registerNo ||
      Object.keys(errors).length
    ) {
      return true
    }
  }

  const updateLegal = () => {
    updateLegalRequest({
      ...ApiConstants,
      id: user!.partyRoleId,
      updateProfileLegalModel: {
        cityId: formValues.cityId,
        companyName: formValues.companyName,
        economicCode: formValues.economicCode,
        email: formValues.email,
        nationalCode: formValues.nationalCode,
        phoneNo: formValues.phoneNo.replace(/-/g, ''),
        provinceId: formValues.provinceId,
        registerNo: formValues.registerNo,
      },
    })
      .unwrap()
      .then((res) => {
        if (!res.success) {
          setShowToast({ message: res?.messages?.[0].message || '', open: true, type: 'error' })
        } else {
          setShowToast({
            message: formatMessage(profileMessage.dataWasEditedSuccessfully),
            open: true,
            type: 'success',
          })
          refetch()
        }
      })
  }

  useEffect(() => {
    if (legalData?.success === false) {
      setShowToast({ message: legalData?.messages?.[0].message || '', open: true, type: 'error' })
    }
  }, [legalData])

  useEffect(() => {
    if (gettingLegalError) {
      setShowToast({
        message: formatMessage(profileMessage.thereIsAProblem),
        open: true,
        type: 'error',
      })
    }
  }, [gettingLegalError])

  const dirtyFieldsList = Object.entries(dirtyFields || [])
    .reduce(
      (list: string[], [key, value]: [string, boolean]) => (value ? [...list, key] : list),
      [],
    )
    .filter((i) => i !== 'phoneNo')

  return (
    <Stack sx={{ width: '100%' }} spacing={8}>
      <CommerceAccordion
        summaryButton={
          <HBButton
            disabled={
              !user?.partyRoleId ||
              (dirtyFieldsList.length === 0 &&
                (legal?.phoneNo ?? '') == (watch('phoneNo') || '').replace(/-/g, '')) ||
              !!Object.keys(errors).length
            }
            loading={isLoading}
            onClick={(e) => {
              e.stopPropagation()
              updateLegal()
            }}
            variant="contained"
          >
            {formatMessage(profileMessage.registerInformation)}
          </HBButton>
        }
        summaryTitle={formatMessage(profileMessage.legalInformation)}
      >
        <Grid container rowSpacing={6} columnSpacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <HBTextFieldController
              name="companyName"
              label={formatMessage(profileMessage.companyName)}
              formRules={{
                pattern: {
                  value: /^[\u0600-\u06FF\s]+$/,
                  message: formatMessage(profileMessage.textInputValidationText),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <HBTextFieldController
              name="economicCode"
              label={formatMessage(profileMessage.companyEconomicCode)}
              mask="000000000000"
              type="number"
              formRules={{
                minLength: {
                  value: 12,
                  message: formatMessage({ ...AccountMessages.phoneNumberError }),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack spacing={2}>
              <HBTextFieldController
                name="nationalCode"
                label={formatMessage(profileMessage.nationalCode)}
                mask="00000000000"
                type="number"
                formRules={{
                  minLength: {
                    value: 11,
                    message: formatMessage({ ...AccountMessages.nationalCodeError }),
                  },
                }}
              />
              {legal?.nationalCode && <HBCheckStatus status="rejected" />}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Stack spacing={2}>
              <HBTextFieldController
                name="registerNo"
                label={formatMessage(profileMessage.registerNo)}
                inputProps={{ maxLength: 6 }}
                formRules={{ required: false }}
              />
              {legal?.registerNo && <HBCheckStatus status="rejected" />}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <IranLocalitySelect
              type="controlled"
              controlledProps={{
                fullWidth: true,
                name: 'provinceId',
                label: formatMessage(profileMessage.companyProvince),
                customControl: control,
                menuItem: [],
              }}
              localityType="province"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <IranLocalitySelect
              type="controlled"
              controlledProps={{
                fullWidth: true,
                name: 'cityId',
                label: formatMessage(profileMessage.companyCity),
                customControl: control,
                menuItem: [],
              }}
              localityType="city"
              provinceId={watch('provinceId') as any}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <HBTextFieldController
              name="phoneNo"
              label={formatMessage(profileMessage.companyPhoneNo)}
              mask="000-00000000"
              type="number"
              formRules={{
                minLength: {
                  value: 11,
                  message: formatMessage({ ...AccountMessages.phoneNumberError }),
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <HBTextFieldController
              name="email"
              label={formatMessage(profileMessage.companyEmail)}
              formRules={{
                pattern: {
                  value: new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'g'),
                  message: formatMessage({ ...AccountMessages.legalEmailError }),
                },
              }}
            />
          </Grid>
        </Grid>
      </CommerceAccordion>
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        vertical="top"
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
    </Stack>
  )
}

export default LegalInformations

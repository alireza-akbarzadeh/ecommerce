import { CommerceAccordion } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  useGetWebIdrCustomersByIdContactsQuery,
  usePutWebIdrCustomersByIdContactsMutation,
} from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBForm, openToast } from '@hasty-bazar/core'
import { Grid, InputAdornment, inputAdornmentClasses, Stack } from '@mui/material'
import { FormPatternsEnums } from 'libs/core/src/enums'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import AccountMessages from '../account.messages'

export interface IContactInformationsForm {
  phoneNo: string
  email: string
}

const PHONE_NUMBER_PREFIX = '0'

const ContactInformations = () => {
  const { data } = useSession()
  const user = data?.user ?? null
  const { formatMessage } = useIntl()
  const formProviderProps = useFormContext<IContactInformationsForm>()
  const {
    control,
    formState: { errors, dirtyFields },
    reset,
  } = formProviderProps
  const {
    data: contactData,
    refetch,
    isFetching,
    error: contactDataError,
  } = useGetWebIdrCustomersByIdContactsQuery(
    {
      ...ApiConstants,
      id: user?.partyRoleId!,
    },
    { skip: !user?.partyId },
  )

  const [updateContactRequest, { isLoading }] = usePutWebIdrCustomersByIdContactsMutation()

  useEffect(() => {
    if (user?.partyId) {
      refetch()
    }
  }, [user?.partyId])

  const contact = contactData?.data || null

  useEffect(() => {
    if (contact) {
      reset({
        email: contact?.email ?? '',
        phoneNo: contact?.phone?.slice(1, contact?.phone.length) ?? '',
      })
    }
  }, [isFetching])

  const updateContact = async (formValues: IContactInformationsForm) => {
    updateContactRequest({
      ...ApiConstants,
      id: user!.partyRoleId,
      updateContactsModel: {
        email: formValues.email,
        phoneNo: formValues.phoneNo.replace(/-/g, ''),
      },
    })
      .unwrap()
      .then((res) => {
        if (!res.success) {
          openToast({ message: res?.messages?.[0].message || '', type: 'error' })
        } else {
          openToast({
            message: formatMessage(AccountMessages.contactInformationUpdated),
            type: 'success',
          })
          reset({
            email: formValues.email,
            phoneNo: formValues.phoneNo.replace(/-/g, ''),
          })
        }
      })
      .catch((err) => {
        openToast({
          message: err?.data?.messages?.[0].message || '',
          type: 'error',
        })
      })
  }

  const dirtyFieldsList = Object.entries(dirtyFields || []).reduce(
    (list: string[], [key, value]: [string, boolean]) => (value ? [...list, key] : list),
    [],
  )

  return (
    <HBForm<IContactInformationsForm>
      formProviderProps={formProviderProps}
      onSubmit={(value) => updateContact(value)}
      mode="all"
    >
      <Stack sx={{ width: '100%' }} spacing={8}>
        <CommerceAccordion
          summaryButton={
            <HBButton
              disabled={!!Object.keys(errors).length || dirtyFieldsList.length === 0}
              onClick={(e) => {
                e.stopPropagation()
                formProviderProps.handleSubmit(updateContact)()
              }}
              loading={isLoading}
            >
              {formatMessage(AccountMessages.submitData)}
            </HBButton>
          }
          summaryTitle={formatMessage(AccountMessages.contactInformation)}
        >
          <Grid container rowSpacing={6} columnSpacing={4}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <HBTextFieldController
                maskOptions={{
                  mask: '00-00000000',
                  valueType: 'unmaskedValue',
                }}
                sx={{
                  '& input': { direction: 'rtl' },
                  [`& .${inputAdornmentClasses.root}`]: {
                    marginLeft: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">{PHONE_NUMBER_PREFIX}</InputAdornment>
                  ),
                }}
                name="phoneNo"
                formRules={{
                  pattern: new RegExp(FormPatternsEnums.phoneNoWithPrefix),
                }}
                label={formatMessage(AccountMessages.phoneNo)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <HBTextFieldController
                name="email"
                label={formatMessage(AccountMessages.email)}
                formRules={{
                  pattern: new RegExp(FormPatternsEnums.email),
                }}
              />
            </Grid>
          </Grid>
        </CommerceAccordion>
      </Stack>
    </HBForm>
  )
}

export default ContactInformations

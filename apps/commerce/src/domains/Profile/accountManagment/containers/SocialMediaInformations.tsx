import { CommerceAccordion } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  useGetWebIdrCustomersByIdSocialMediaQuery,
  usePutWebIdrCustomersByIdSocialMediaMutation,
} from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBForm, HBIcon, openToast } from '@hasty-bazar/core'
import { Grid, Stack, styled } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import AccountMessages from '../account.messages'

interface IForm {
  instagram: string
  whatsApp: string
  linkedIn: string
}

const InputWrapper = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  width: '100%',
}))

const SocialMediaInformation = () => {
  const { formatMessage } = useIntl()
  const { data } = useSession()
  const user = data?.user ?? null
  const formProviderProps = useForm<IForm>({
    mode: 'all',
  })

  const {
    reset,
    formState: { dirtyFields, errors },
  } = formProviderProps

  const {
    data: socialData,
    refetch,
    isFetching,
  } = useGetWebIdrCustomersByIdSocialMediaQuery(
    {
      ...ApiConstants,
      id: user?.partyRoleId!,
    },
    { skip: !user?.partyId },
  )

  const [updateSocialRequest, { isLoading }] = usePutWebIdrCustomersByIdSocialMediaMutation()

  useEffect(() => {
    if (user?.partyId) {
      refetch()
    }
  }, [user?.partyId])

  const social = socialData?.data || null

  useEffect(() => {
    if (social) {
      reset({
        instagram: social?.instagram ?? '',
        whatsApp: social?.whatsApp ?? '',
        linkedIn: social?.linkedIn ?? '',
      })
    }
  }, [isFetching])

  const onSubmit = async (formValues: IForm) => {
    await updateSocialRequest({
      ...ApiConstants,
      id: user!.partyRoleId,
      updateSocialMediaModel: {
        instagram: formValues.instagram,
        linkedIn: formValues.linkedIn,
        whatsApp: formValues.whatsApp,
      },
    })
      .unwrap()
      .then((res) => {
        if (!res.success) {
          openToast({ message: res?.messages?.[0].message || '', type: 'error' })
        } else {
          openToast({
            message: formatMessage(AccountMessages.socialMediaUpdated),
            type: 'success',
          })
          reset({
            instagram: formValues.instagram,
            linkedIn: formValues.linkedIn,
            whatsApp: formValues.whatsApp,
          })
        }
      })
  }

  const dirtyFieldsList = Object.entries(dirtyFields || []).reduce(
    (list: string[], [key, value]: [string, boolean]) => (value ? [...list, key] : list),
    [],
  )

  return (
    <HBForm<IForm> formProviderProps={formProviderProps} onSubmit={(value) => {}} mode="all">
      <Stack sx={{ width: '100%' }} spacing={8}>
        <CommerceAccordion
          summaryButton={
            <HBButton
              type="submit"
              loading={isLoading}
              disabled={!!Object.keys(errors).length || dirtyFieldsList.length === 0}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                formProviderProps.handleSubmit(onSubmit)()
              }}
            >
              {formatMessage(AccountMessages.submitData)}
            </HBButton>
          }
          summaryTitle={formatMessage(AccountMessages.socialMediaInformation)}
        >
          <Grid container rowGap={6} columnSpacing={4}>
            <Grid item xs={12} md={6}>
              <InputWrapper spacing={2} direction="row">
                <HBIcon type="instagram" sx={{ color: 'grey.700' }} />
                <HBTextFieldController
                  sx={{ flex: 1 }}
                  formRules={{
                    required: false,
                  }}
                  name="instagram"
                  label={formatMessage(AccountMessages.instagram)}
                />
              </InputWrapper>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputWrapper spacing={2} direction="row">
                <HBIcon type="whatsappAlt" sx={{ color: 'grey.700' }} />
                <HBTextFieldController
                  sx={{ flex: 1 }}
                  formRules={{
                    required: false,
                  }}
                  name="whatsApp"
                  label={formatMessage(AccountMessages.whatsApp)}
                />
              </InputWrapper>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputWrapper spacing={2} direction="row">
                <HBIcon type="linkedin" sx={{ color: 'grey.700' }} />
                <HBTextFieldController
                  sx={{ flex: 1 }}
                  formRules={{
                    required: false,
                  }}
                  name="linkedIn"
                  label={formatMessage(AccountMessages.linkedIn)}
                />
              </InputWrapper>
            </Grid>
          </Grid>
        </CommerceAccordion>
      </Stack>
    </HBForm>
  )
}

export default SocialMediaInformation

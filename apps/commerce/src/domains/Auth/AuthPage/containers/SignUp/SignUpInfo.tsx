import { HBLink } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCatalogProductRulesGetallPublishedQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBCheckBoxController, HBFormHeader, HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBDialog, HBSubmitButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { AuthStateProps } from '../../AuthPage'
import AuthPageMessages from '../../AuthPage.messages'
import { SignUpSetPasswordActionStyle } from './SignUpOtp.styles'

const SignUpInfo: FC<AuthStateProps> = (props) => {
  const { formatMessage } = useIntl()
  const pattern = {
    value: /^\S[\u0600-\u06FF\s]+$/,
    message: formatMessage(AuthPageMessages.textInputValidationText),
  }
  const { onChangeState } = props
  const {
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useFormContext()
  const [loading, setLoading] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  const { data } = useGetWebCatalogProductRulesGetallPublishedQuery({
    ...ApiConstants,
    processEventName: 'IDS_UserSignUpRule_CompleteMandatoryCustomerInfo',
    filter: 'ProcessEventName_Equal_--ProcessEventName',
  })

  const closeTermsModal = () => {
    setShowTermsModal(false)
  }

  const checkTermsHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (getValues('terms')) return
    e.preventDefault()
    setShowTermsModal(true)
  }

  const acceptTermsModal = () => {
    setValue('terms', true, { shouldValidate: true })
    closeTermsModal()
  }

  const UnAcceptTermsModal = () => {
    setValue('terms', false, { shouldValidate: true })
    closeTermsModal()
  }

  function handleSaveInfo() {
    onChangeState('signUpSetPassword')
  }
  return (
    <Box>
      <HBFormHeader
        title={formatMessage(AuthPageMessages.signUpTitle)}
        subTitle={formatMessage(AuthPageMessages.signUpSubTitle)}
      />
      <HBTextFieldController
        name="firstName"
        label={formatMessage(AuthPageMessages.firstNameLabel)}
        formRules={{
          pattern,
          required: { value: true, message: '' },
          maxLength: { value: 64, message: formatMessage(AuthPageMessages.nameMaxLength) },
          minLength: { value: 2, message: formatMessage(AuthPageMessages.nameMinLength) },
        }}
      />
      <HBTextFieldController
        name="lastName"
        label={formatMessage(AuthPageMessages.lastNameLabel)}
        formRules={{
          pattern,
          required: { value: true, message: '' },
          minLength: { value: 2, message: formatMessage(AuthPageMessages.nameMinLength) },
          maxLength: { value: 64, message: formatMessage(AuthPageMessages.nameMaxLength) },
        }}
        sx={{ mt: 8 }}
      />
      <Box display="flex" alignItems="center" sx={{ bgcolor: 'grey.100', borderRadius: 2, mt: 8 }}>
        <HBCheckBoxController formName="terms" onClickOnCheckBox={checkTermsHandler}>
          <Typography variant="caption" color="text.primary">
            <Stack direction="row" columnGap={0.5} display="inline-flex">
              <FormattedMessage {...AuthPageMessages.hastiTermsTitleWith} />
              <HBLink underline="none" onClick={() => setShowTermsModal(true)}>
                <Typography variant="caption" color="info.main" sx={{ cursor: 'pointer' }}>
                  <FormattedMessage {...AuthPageMessages.hastiTermsTitle} />
                </Typography>
              </HBLink>
              <FormattedMessage {...AuthPageMessages.hastiTermsTitleEnd} />
            </Stack>
          </Typography>
        </HBCheckBoxController>
      </Box>

      <SignUpSetPasswordActionStyle>
        <HBSubmitButton
          buttonText={formatMessage(AuthPageMessages.nextStep)}
          backButtonText={formatMessage(AuthPageMessages.backStep)}
          backButtonOnclick={() => onChangeState('checkUserExistStep')}
          buttonOnClick={handleSaveInfo}
          buttonLoading={loading}
          buttonType={'submit'}
          sx={{ mt: 8 }}
          firstBtnDisable={!isValid}
          secondBtnDisable={loading}
        />
      </SignUpSetPasswordActionStyle>
      {showTermsModal && (
        <HBDialog
          sx={{ maxWidth: 750, margin: '0 auto' }}
          fullWidth
          title={formatMessage(AuthPageMessages.termsTitle)}
          open
          onClose={closeTermsModal}
          onReject={closeTermsModal}
        >
          <Stack spacing={6} py={4} px={2}>
            {data?.data?.items &&
              data.data.items.map((item) => {
                return (
                  <Stack spacing={4}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{
                        '& *': {
                          fontFamily: (theme) => `${theme.typography.fontFamily} !important`,
                          textAlign: 'justify !important',
                          lineHeight: `2.3 !important`,
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: item?.description || '',
                      }}
                    />
                  </Stack>
                )
              })}
            <Stack direction="row" sx={{ flex: 1, justifyContent: 'space-between' }}>
              <HBButton onClick={UnAcceptTermsModal} variant="outlined">
                <FormattedMessage {...AuthPageMessages.unAcceptTerms} />
              </HBButton>
              <HBButton onClick={acceptTermsModal}>
                <FormattedMessage {...AuthPageMessages.acceptTerms} />
              </HBButton>
            </Stack>
          </Stack>
        </HBDialog>
      )}
    </Box>
  )
}

export default SignUpInfo

import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { usePostIdsCreateOtpForRegisterMutation } from '@hasty-bazar-commerce/core/utils/IdsApi'
import { AuthCurrentState } from '@hasty-bazar-commerce/domains/Auth/AuthPage'
import { useGetWebIdrPartiesByMobileRolesQuery } from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBEmailPhoneNumberFormItem } from '@hasty-bazar/auth'
import { HBClassesType } from '@hasty-bazar/core'
import { Alert, outlinedInputClasses, Typography, useTheme } from '@mui/material'
import { FormPatternsEnums } from 'libs/core/src/enums'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import AuthPageMessages from '../AuthPage.messages'

type CheckUserExistStepProps = {
  onChangeState: (newState: AuthCurrentState) => void
}

const classes: HBClassesType<'common'> = {
  common: { mt: 8 },
}

const CheckUserExistStep: FC<CheckUserExistStepProps> = (props: CheckUserExistStepProps) => {
  const theme = useTheme()
  const { formatMessage } = useIntl()
  const { onChangeState } = props
  const { getValues, formState, trigger } = useFormContext()
  const { isValid } = formState
  const [isCallService, setIsCallService] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [createOtpMutate, { isLoading }] = usePostIdsCreateOtpForRegisterMutation()
  const { data, refetch, isFetching, error } = useGetWebIdrPartiesByMobileRolesQuery(
    {
      ...ApiConstants,
      mobile: getValues('username'),
    },
    { skip: !isCallService },
  )

  const authStep = () => {
    const user = getValues('username')
    createOtpMutate({
      user,
    })
      .unwrap()
      .then((res) => {
        if (res?.data?.otpToken) {
          sessionStorage.setItem('otpToken', res?.data?.otpToken)
          onChangeState('signUpOtp')
        } else {
          setErrorMessage(res?.data?.message)
        }
      })
      .catch((error) => {
        setErrorMessage(formatMessage(AuthPageMessages.faultMessage))
      })
  }
  const checkUserExist = () => {
    setErrorMessage(undefined)
    setIsCallService(true)
    refetch()
  }

  useEffect(() => {
    if (getValues('username')?.length) trigger('username')
  }, [])

  useEffect(() => {
    if (data) {
      if (data?.success) {
        if (data?.data?.isAdmin || data?.data?.isCustomer) onChangeState('signInPassword')
        else authStep()
      } else {
        setErrorMessage(
          data?.messages?.[0]?.message ?? formatMessage(AuthPageMessages.faultMessage),
        )
      }
    }
  }, [data])

  useEffect(() => {
    if (error)
      setErrorMessage(
        (error as any)?.data?.messages?.[0]?.message ||
          formatMessage(AuthPageMessages.faultMessage),
      )
  }, [error])

  return (
    <HBEmailPhoneNumberFormItem
      headerTitle={formatMessage(AuthPageMessages.checkUserExistTitle)}
      headerSubTitle={formatMessage(AuthPageMessages.checkUserExistSubTitle)}
      formName="username"
      firstBtnDisable={!isValid}
      firstBtnLoading={isLoading || isFetching}
      secondBtnText=""
      formLabel={formatMessage(AuthPageMessages.mobileNoLabel)}
      formRules={{
        pattern: {
          message: formatMessage(AuthPageMessages.mobileNoFaultMessage),
          value: new RegExp(FormPatternsEnums.mobile),
        },
        required: true,
      }}
      inputMask="00000000000"
      firstBtnOnclick={checkUserExist}
      textFieldProps={{
        sx: {
          textAlign: 'left',
          [`& .${outlinedInputClasses.root}, & .${outlinedInputClasses.root}:hover`]: {
            '& > fieldset': {
              borderColor: theme.palette.grey[300],
            },
          },
          input: {
            direction: 'rtl',
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 1000px white inset',
            },
          },
        },
      }}
    >
      {errorMessage && (
        <Alert sx={classes.common} severity="error" variant="filled">
          <Typography>{errorMessage}</Typography>
        </Alert>
      )}
    </HBEmailPhoneNumberFormItem>
  )
}

export default CheckUserExistStep

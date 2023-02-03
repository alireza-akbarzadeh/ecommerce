import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import { BusinessTypeEnum } from '@hasty-bazar/admin-shared/core/utils/contentTypes'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetPartyAccountQueryResult,
  useGetAdminIdrPartiesByPartyIdAccountQuery,
  usePostAdminIdrPartiesChangeStateMutation,
  usePutAdminIdrPartiesByIdAboutMeMutation,
  usePutAdminIdrPartiesByIdLegalMutation,
  usePutAdminIdrPartiesByIdMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import {
  useGetAdminLocalityIranByProvinceIdQuery,
  useGetAdminLocalityIranQuery,
} from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { convertDataToSelectItems } from '@hasty-bazar/admin-shared/utils'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { UserAboutusProps, UserAccountProps } from '../../UserDetailPage'
import userPageMessages from '../../UserPage.messages'
import UserAboutUs from '../UserAboutUs'
import UserLegalInformation from '../UserLegalInformation'
import UserRealInformation from '../UserRealInformation'

export type UserAccountType = {
  id?: string
  isAdmin?: boolean
}

export default function UserAccount({ id, isAdmin }: UserAccountType) {
  const [isFindNationalCode, setIsFindNationalCode] = useState(false)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const [editAccount] = usePutAdminIdrPartiesByIdMutation()
  const [editAboutMe] = usePutAdminIdrPartiesByIdAboutMeMutation()
  const [editLegal] = usePutAdminIdrPartiesByIdLegalMutation()

  const accountFormProviderProps = useForm<UserAccountProps>({ mode: 'all' })
  const aboutUsFormProviderProps = useForm<UserAboutusProps>({ mode: 'all' })
  const legalFormProviderProps = useForm<UserAccountProps>({ mode: 'all' })

  const { data: { data: { items: genders = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnum.Gender,
    })

  const provinces = useGetAdminLocalityIranQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
  })

  const cities = useGetAdminLocalityIranByProvinceIdQuery(
    {
      'client-name': 'get-cities-by-province-id',
      'client-version': '1.0.0',
      provinceId: legalFormProviderProps.getValues('companyProvinceId')?.value!,
    },
    {
      skip: !legalFormProviderProps.getValues('companyProvinceId'),
    },
  )

  const provincesItems = useMemo(
    () => convertDataToSelectItems(provinces.data?.data?.items || [], 'id', 'title'),
    [provinces],
  )

  const citiesItems = useMemo(
    () => convertDataToSelectItems(cities.data?.data?.items || [], 'id', 'title'),
    [cities],
  )

  const { data: { data: account = {} } = {}, refetch } = useGetAdminIdrPartiesByPartyIdAccountQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      partyId: id as string,
    },
    { skip: !id },
  )

  useEffect(() => {
    if (!account) {
      openToast({
        message: formatMessage(userPageMessages.userNotFound),
        type: 'error',
      })
      router.push('/users')
      return
    }
    accountFormProviderProps.reset({
      ...account,
      gender: account.gender ? genders?.find((item) => item.id === account.gender) : null,
    })

    aboutUsFormProviderProps.reset({
      aboutUs: account?.aboutMe!,
    })

    legalFormProviderProps.reset({
      address: account.address!,
      companyName: account.companyName!,
      economicCode: account.economicCode!,
      legalNationalCode: account.legalNationalCode!,
      phoneNo: account.phoneNo!,
      registerationNo: account.registerationNo!,
      companyCityId: citiesItems.find((item) => item.value == account.companyCityId)!,
      companyEmail: account.companyEmail!,
      companyProvinceId: provincesItems.find((item) => item.value == account.companyProvinceId)!,
    })
    setIsFindNationalCode(!!account.nationalCode)
  }, [account, genders, provincesItems])

  useEffect(() => {
    if (citiesItems.length) {
      legalFormProviderProps.setValue(
        'companyCityId',
        citiesItems.find((item) => item?.value == account?.companyCityId),
      )
    }
  }, [citiesItems])

  const submitLegal = (props: UserAccountProps) => {
    editLegal({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: id as string,
      updateLegalModel: {
        ...props,
        companyProvinceId: props?.companyProvinceId?.value ?? null,
        companyCityId: props?.companyCityId?.value ?? null,
      },
    })
      .unwrap()
      .then(() => {
        openToast({
          message: formatMessage(userPageMessages.userLegalUpdated),
          type: 'success',
        })
        refetch()
      })
      .catch((e) => {})
  }

  const [updateNationalWorkflow] = usePostAdminIdrPartiesChangeStateMutation()

  const submitAccount = (props: UserAccountProps) => {
    editAccount({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: id as string,
      updatePartyModel: {
        birthDate: props.birthDate,
        firstName: props.firstName,
        lastName: props.lastName,
        gender: props?.gender ? +props?.gender?.value || +props?.gender?.id : undefined,
        nationalCode: props.nationalCode || null,
        email: props?.email || null,
        mobile: props.mobile,
      },
    })
      .unwrap()
      .then(() => {
        openToast({
          message: formatMessage(userPageMessages.userAccountUpdated),
          type: 'success',
        })
        if (!isFindNationalCode) {
          updateNationalWorkflow({
            'client-name': 'HIT',
            'client-version': '1.0.1',
            stateMachineModel: {
              entityId: id as string,
              factor: '1',
              nextStateId: '2',
            },
          }).then((res: any) => {
            if (res?.data?.success) {
              if (!res?.data?.data?.match) {
                openToast({
                  message: formatMessage(userPageMessages.workflowNotMatch),
                  type: 'error',
                })
              } else {
                openToast({
                  message: formatMessage(userPageMessages.workflowMatch),
                  type: 'error',
                })
                refetch()
              }
            }
          })
        }
        refetch()
      })
      .catch((e) => {})
  }

  const submitAboutUs = ({ aboutUs }: UserAboutusProps) => {
    editAboutMe({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: id as string,
      updatePartyAboutMeModel: {
        aboutMe: aboutUs,
      },
    })
      .unwrap()
      .then(() => {
        openToast({
          message: formatMessage(userPageMessages.userAboutUpdated),
          type: 'success',
        })
        refetch()
      })
      .catch((e) => {})
  }

  return (
    <Stack spacing={2}>
      <HBExplanation
        defaultExpanded
        summary={
          <HBExplanationSummary
            title={formatMessage(userPageMessages.realInformation)}
            icon="documentInfo"
            submitButton={true}
            submitButtonProps={{
              onClick: accountFormProviderProps?.handleSubmit(submitAccount),
              disabled: !accountFormProviderProps.formState.isDirty,
            }}
          />
        }
        detail={
          <HBForm<UserAccountProps>
            onSubmit={submitAccount}
            formProviderProps={accountFormProviderProps}
          >
            <UserRealInformation
              userId={id!}
              onRefresh={refetch}
              account={account}
              genders={genders}
              isAdmin={isAdmin}
            />
          </HBForm>
        }
      />
      <HBExplanation
        summary={
          <HBExplanationSummary
            title={formatMessage(userPageMessages.aboutUs)}
            icon="documentInfo"
            submitButton={true}
            submitButtonProps={{
              onClick: aboutUsFormProviderProps?.handleSubmit(submitAboutUs),
            }}
          />
        }
        detail={
          <HBForm<UserAboutusProps>
            onSubmit={submitAboutUs}
            formProviderProps={aboutUsFormProviderProps}
          >
            <UserAboutUs />
          </HBForm>
        }
      />
      <HBExplanation
        summary={
          <HBExplanationSummary
            title={formatMessage(userPageMessages.legalInformation)}
            icon="documentInfo"
            submitButton={true}
            submitButtonProps={{
              onClick: legalFormProviderProps?.handleSubmit(submitLegal),
              disabled: !legalFormProviderProps.formState.isDirty,
            }}
          />
        }
        detail={
          <HBForm<UserAccountProps>
            onSubmit={submitLegal}
            formProviderProps={legalFormProviderProps}
          >
            <UserLegalInformation
              provincesItems={provincesItems}
              citiesItems={citiesItems}
              provinceId={legalFormProviderProps.watch('companyProvinceId')!}
              data={account as GetPartyAccountQueryResult}
            />
          </HBForm>
        }
      />

      <HBRecordHistory data={account} isBorder isShowAccordion disabled={!id} />
    </Stack>
  )
}

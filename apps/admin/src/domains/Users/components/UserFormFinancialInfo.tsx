import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import useUserFinancialFormController from '@hasty-bazar-admin/domains/Users/containers/hooks/useUserFinancialFormController'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { useGetAdminGeneralDataBankQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { AddPartyRoleAddBankAccountsModel } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBButton, HBCheckBox, HBForm, HBIcon, HBRadioButton, openToast } from '@hasty-bazar/core'
import {
  Avatar,
  Box,
  FormControlLabel,
  Grid,
  InputAdornment,
  inputBaseClasses,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import React, { Dispatch, ReactNode, RefObject, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'

export interface UserFinancialInformationFormType extends AddPartyRoleAddBankAccountsModel {
  role: string
}

type UserFormFinancialInfo = {
  setStepDialog: Dispatch<SetStateAction<'one' | 'tow' | 'three' | null>>
  contentTypeModal: 'copy' | 'create' | 'edit' | 'delete' | null
  partyId: string
  createRoles: { title: ReactNode; value: string | number; iconPath?: string | undefined }[]
  gridRef: RefObject<HBDataGridClientRef>
}

const UserFormFinancialInfo = ({
  setStepDialog,
  contentTypeModal,
  createRoles,
  gridRef,
}: UserFormFinancialInfo) => {
  const [checked, setChecked] = React.useState(false)
  const [cardPrefix, setCardPrefix] = React.useState('')
  const [ibanPrefix, setIbanPrefix] = React.useState('')

  const formProvider = useForm<UserFinancialInformationFormType>({ mode: 'all' })
  const {
    setValue,
    watch,
    formState: { isValid, isDirty },
  } = formProvider

  const handleDefaultCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const {
    data: { data: bankData } = {},
    isFetching,
    refetch,
  } = useGetAdminGeneralDataBankQuery(
    {
      'client-name': 'generalData',
      'client-version': '0',
      filter: ibanPrefix ? 'Iban==@Iban' : cardPrefix ? 'CardPrefix==@CardPrefix' : undefined,
      cardPrefix: cardPrefix ?? undefined,
      iban: ibanPrefix ?? undefined,
    },
    {
      skip: !cardPrefix && !ibanPrefix,
    },
  )

  const {
    spacing,
    formatMessage,
    copyFinancialInfo,
    editFinancialInfo,
    createFinancialInfo,
    setTypeCart,
    typeCart,
    updateLoading,
    createLoading,
    copyLoading,
  } = useUserFinancialFormController({
    setStepDialog,
    gridRef,
    refetch,
  })
  const gridRowsData = gridRef?.current?.api?.getSelectedRows()

  function handleSubmit(values: UserFinancialInformationFormType) {
    if (bankData?.items?.[0]?.latinSummaryName) {
      let postData = {
        cardNo: typeCart === 'cardNo' ? values.cardNo : null,
        iban: typeCart === 'iban' ? 'IR' + values.iban : null,
        latinSummaryName: bankData?.items?.[0]?.latinSummaryName!,
      } as UserFinancialInformationFormType

      let editAddress = {
        ...postData,
        isDefault: checked,
        isActive: postData.isActive === null ? false : true,
      } as UserFinancialInformationFormType

      return contentTypeModal === 'create'
        ? createFinancialInfo(postData, values.role)
        : contentTypeModal === 'edit'
        ? editFinancialInfo(editAddress, values.role)
        : copyFinancialInfo(values.role)
    } else {
      openToast({
        message: formatMessage(userPageMessages.unValidIbanOrCardNumber),
        type: 'error',
      })
    }
  }

  useEffect(() => {
    if (contentTypeModal === 'edit' || contentTypeModal === 'copy') {
      setValue('cardNo', gridRowsData ? gridRowsData[0]?.cardNumber : '')
      setValue('iban', gridRowsData ? gridRowsData[0]?.iban?.slice(2) : '')
      setValue('role', gridRowsData ? gridRowsData[0]?.partyRoleId : '')
      if (gridRowsData) {
        setChecked(gridRowsData[0]?.isDefault)
        setTypeCart(gridRowsData[0]?.cardNumber ? 'cardNo' : 'iban')
      }

      setCardPrefix(gridRowsData ? gridRowsData[0]?.cardNumber?.slice(0, 6) : '' || '')
      setIbanPrefix(gridRowsData ? gridRowsData[0]?.iban?.slice(2, 7) : '' || '')
    }
  }, [])

  useEffect(() => {
    if (watch('cardNo')) {
      if (watch('cardNo')?.length === 6) {
        setCardPrefix(watch('cardNo') || '')
      } else if (watch('cardNo')?.length! < 6) {
        setCardPrefix('')
      } else if (
        gridRowsData?.[0]?.cardNumber &&
        watch('cardNo')?.slice(0, 6) !== gridRowsData?.[0]?.cardNumber.slice(0, 6)
      ) {
        refetch()
        setCardPrefix(watch('cardNo')?.slice(0, 6) || '')
      }
    } else {
      setCardPrefix('')
    }
  }, [watch('cardNo')])

  useEffect(() => {
    if (watch('iban')) {
      if (watch('iban')?.length === 5) {
        setIbanPrefix(watch('iban') || '')
      } else if (watch('iban')?.length! < 5) {
        setIbanPrefix('')
      } else if (
        gridRowsData?.[0]?.iban &&
        watch('iban')?.slice(0, 5) !== gridRowsData?.[0]?.iban.slice(2, 7)
      ) {
        refetch()
        setIbanPrefix(watch('iban')?.slice(0, 5) || '')
      }
    } else {
      setIbanPrefix('')
    }
  }, [watch('iban')])

  return (
    <HBForm<UserFinancialInformationFormType>
      formProviderProps={formProvider}
      onSubmit={handleSubmit}
    >
      <Stack spacing={7}>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <HBSelectController
              name={'role' as keyof UserFinancialInformationFormType}
              required={contentTypeModal === 'create'}
              formRules={{
                required: contentTypeModal === 'create',
              }}
              sx={{
                height: 41,
              }}
              fullWidth
              label={formatMessage(phrasesMessages.role)}
              menuItem={createRoles}
              disabled={contentTypeModal === 'edit'}
            />
          </Grid>
          {contentTypeModal !== 'create' && (
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                label={formatMessage(userPageMessages.defaultAccount)}
                control={
                  <HBCheckBox
                    checked={checked}
                    disabled={contentTypeModal === 'copy'}
                    onChange={handleDefaultCheckBox}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
              />
            </Grid>
          )}
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={4}>
            <HBRadioButton
              value={typeCart}
              name={typeCart}
              onChange={() => {
                setValue('iban', '')
                setIbanPrefix('')
                setTypeCart('cardNo')
              }}
              checked={typeCart === 'cardNo'}
              disabled={contentTypeModal === 'copy'}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <HBTextFieldController
              label={formatMessage(userPageMessages.cardNumber)}
              name={'cardNo' as keyof UserFinancialInformationFormType}
              disabled={contentTypeModal === 'copy' || typeCart === 'iban'}
              inputProps={{ maxLength: 16 }}
              fullWidth
              formRules={{
                required: {
                  value: contentTypeModal === 'copy' ? false : typeCart === 'cardNo',
                  message: formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(userPageMessages.cardNumber),
                  }),
                },
                validate: () =>
                  !(cardPrefix && bankData?.items?.length === 0) ||
                  formatMessage(userPageMessages.unValidCardNo),
              }}
              InputProps={{
                startAdornment:
                  cardPrefix && bankData?.items?.length ? (
                    <InputAdornment position="start">
                      {isFetching ? (
                        <Skeleton variant="rectangular" width={22} height={22} />
                      ) : (
                        <Avatar
                          sizes="small"
                          src={`${process.env.NEXT_PUBLIC_CDN}/${bankData?.items[0].path}`}
                          alt={bankData?.items[0]?.name || ''}
                          variant="square"
                          sx={{
                            width: 22,
                            height: 22,
                          }}
                        />
                      )}
                    </InputAdornment>
                  ) : (
                    <></>
                  ),
              }}
              sx={{
                [`& .${inputBaseClasses.input}`]: { textAlign: 'right', direction: 'rtl' },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: 4 }}>
            <HBRadioButton
              checked={typeCart === 'iban'}
              value={typeCart}
              disabled={contentTypeModal === 'copy'}
              name={typeCart}
              onChange={() => {
                setValue('cardNo', '')
                setCardPrefix('')
                setTypeCart('iban')
              }}
            />
          </Grid>
          <Grid item xs={12} sm={8} sx={{ mt: 4 }}>
            <HBTextFieldController
              label={formatMessage(userPageMessages.cardShaba)}
              name={'iban' as keyof UserFinancialInformationFormType}
              disabled={contentTypeModal === 'copy' || typeCart === 'cardNo'}
              fullWidth
              inputProps={{ maxLength: 27 }}
              formRules={{
                required: {
                  value: contentTypeModal === 'copy' ? false : typeCart === 'iban',
                  message: formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(userPageMessages.cardShaba),
                  }),
                },
                validate: () =>
                  !(ibanPrefix && bankData?.items?.length === 0) ||
                  formatMessage(userPageMessages.unValidIban),
              }}
              InputProps={{
                endAdornment: (
                  <Typography variant="subtitle2" mt={1}>
                    IR
                  </Typography>
                ),
                startAdornment:
                  ibanPrefix && bankData?.items?.length ? (
                    <InputAdornment position="start">
                      {isFetching ? (
                        <Skeleton variant="rectangular" width={22} height={22} />
                      ) : (
                        <Avatar
                          sizes="small"
                          src={`${process.env.NEXT_PUBLIC_CDN}/${bankData?.items[0].path}`}
                          alt={bankData?.items[0]?.name || ''}
                          variant="square"
                          sx={{
                            width: 22,
                            height: 22,
                          }}
                        />
                      )}
                    </InputAdornment>
                  ) : (
                    <></>
                  ),
              }}
              sx={{
                [`& .${inputBaseClasses.input}`]: { textAlign: 'right', direction: 'rtl' },
              }}
            />
          </Grid>
        </Grid>
        <Stack
          justifyContent={contentTypeModal === 'copy' ? 'space-between' : 'center'}
          alignItems={'center'}
          direction={'row'}
        >
          {contentTypeModal === 'copy' && (
            <HBButton
              onClick={() => setStepDialog('one')}
              size={'small'}
              startIcon={<HBIcon type="angleRight" sx={{ fontSize: spacing(2) }} />}
              variant={'outlined'}
            >
              {formatMessage(phrasesMessages.back)}
            </HBButton>
          )}
          <HBButton
            type={'submit'}
            color={'primary'}
            loading={updateLoading || createLoading || copyLoading}
            variant={'contained'}
            sx={{ fontWeight: 400 }}
            disabled={!isValid || !isDirty}
          >
            {formatMessage(
              contentTypeModal === 'copy'
                ? userPageMessages.confirmationInquiry
                : contentTypeModal === 'edit'
                ? userPageMessages.editAccount
                : userPageMessages.createAccount,
            )}
          </HBButton>
        </Stack>
      </Stack>
      <Box mt={4}>
        {contentTypeModal === 'edit' && <HBRecordHistory data={gridRowsData?.[0]} isBorder />}
      </Box>
    </HBForm>
  )
}

export default UserFormFinancialInfo

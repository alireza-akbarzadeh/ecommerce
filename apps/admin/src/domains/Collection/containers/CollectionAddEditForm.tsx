import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { CollectionTypeEnum } from '@hasty-bazar/admin-shared/core/enums/CollectionType'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  CollectionType,
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
  useGetAdminGeneralDataCollectionGetStateInfoByStateCodeAndStateMachineCodeFactorQuery,
  useGetAdminGeneralDataCollectionGetTransitionByEntityIdAndStateMachineCodeFactorQuery,
  useGetAdminGeneralDataCollectionSortOptionsQuery,
  usePostAdminGeneralDataCollectionChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { checkPositiveIntgerNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import {
  HBButton,
  HBClassesType,
  HBDialog,
  HBIcon,
  HBIconButton,
  HBSelectProps,
} from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { CollectionAddEditFormType } from '../CollectionAddEditPage'
import collectionPageMessages from '../CollectionPage.messages'
import { useGetAdminGeneralDataCollectionByIdQuery } from '../generalDataApi.enhanced'

type HBPageClassNames = 'selectComponentWidth' | 'gridSection'

const classes: HBClassesType<HBPageClassNames> = {
  selectComponentWidth: { width: '100%' },
  gridSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 },
}

export type SelectBoxOptionsType = HBSelectProps['menuItem']
const CollectionAddEditForm: FC = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { spacing } = useTheme()
  const id = router.query.id?.[0]
  const {
    formState: { isValid, isDirty },
    reset,
    watch,
    setValue,
    getValues,
  } = useFormContext<CollectionAddEditFormType>()
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(false)

  const { breakpoints } = useTheme()
  const ref = useRef<HTMLButtonElement>(null)
  const { data: { data: { items: businessTypeData = [] } = {} } = {}, isLoading } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': 'generalData',
      'client-version': '0',
      pageSize: 1000,
    })

  const {
    data: collectionData,
    refetch: collectionDataRefetch,
    isLoading: collectionDataIsLoading,
  } = useGetAdminGeneralDataCollectionByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: id!,
    },
    {
      skip: !id,
    },
  )

  const {
    data: collectionSortOptionsData,
    refetch: sortOptionsRefetch,
    isLoading: collectionSortOptionsDataIsLoading,
  } = useGetAdminGeneralDataCollectionSortOptionsQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      collectionType: watch('collectionType'),
      pageSize: 1000,
    },
    {
      skip: !watch('collectionType'),
    },
  )

  useEffect(() => {
    if (
      id &&
      collectionData?.data &&
      !collectionSortOptionsDataIsLoading &&
      !collectionDataIsLoading
    ) {
      const { isActive, ..._data } = collectionData?.data
      reset({
        ...(_data as CollectionAddEditFormType),
        cacheTimeToLive: !collectionData?.data.hasCache
          ? undefined
          : collectionData?.data.cacheTimeToLive,
      })
    }

    if (!id && !isFirstLoad) {
      reset({})
      setIsFirstLoad(true)
    }
  }, [collectionDataIsLoading, collectionSortOptionsDataIsLoading])

  const getBusinessTypes = (
    businessTypes: GetBusinessTypeValuesQueryResult[],
    type: BusinessTypeEnums,
  ): SelectBoxOptionsType => {
    return businessTypes
      .filter((item) => item.businessTypeId === type + '')
      .map((item) => ({
        title: String(item.title),
        value: item.id || 0,
      }))
  }

  const handleGoBack = () => {
    if (!isDirty) {
      router.replace('/collection')
    } else setOpenConfirmModal(true)
  }

  const handleSave = () => {
    if (isValid) {
      ref.current?.click()
    }
    setOpenConfirmModal(false)
  }

  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.back()
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Grid container spacing={spacing(6)}>
          <Grid container item xs={12} sm={12} sx={classes.gridSection}>
            <Typography variant="h4" mb={8} color="text.primary">
              {formatMessage(collectionPageMessages.dynamicQuery)}
            </Typography>
            {id && (
              <HBWorkflow
                factor="1"
                entityId={id!}
                machineCode={StateMachineCode.Collection}
                useGetStateList={
                  useGetAdminGeneralDataCollectionGetTransitionByEntityIdAndStateMachineCodeFactorQuery
                }
                useGetState={
                  useGetAdminGeneralDataCollectionGetStateInfoByStateCodeAndStateMachineCodeFactorQuery
                }
                useChangeState={usePostAdminGeneralDataCollectionChangeStateMutation}
                stateCode={collectionData?.data?.stateCode}
                onChangeState={collectionDataRefetch}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                validate: (value) =>
                  !!value.trim() ||
                  `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(collectionPageMessages.code),
                  })}`,
              }}
              label={formatMessage(collectionPageMessages.code)}
              name={'code' as keyof CollectionAddEditFormType}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                maxLength: 150,
                validate: (value) =>
                  !!value.trim() ||
                  `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(collectionPageMessages.collectionName),
                  })}`,
              }}
              name={'name' as keyof CollectionAddEditFormType}
              label={formatMessage(collectionPageMessages.collectionName)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HBSelectController
              sx={{
                width: {
                  md: '100%',
                  xs: '100%',
                },
                minWidth: 100,
              }}
              required
              formRules={{
                required: true,
              }}
              inputLabelProps={{ required: true }}
              label={formatMessage(collectionPageMessages.collectionType)}
              name={'collectionType' as keyof CollectionAddEditFormType}
              menuItem={getBusinessTypes(businessTypeData || [], BusinessTypeEnums.CollectionType)}
              onChange={(event) => {
                if (event?.target?.value == CollectionTypeEnum.User) {
                  setValue('hasCache', false)
                  setValue('cacheTimeToLive', undefined)
                }
                setValue('collectionType', event?.target?.value as CollectionType, {
                  shouldValidate: true,
                })
                setValue('collectionSortOptionId', null)
                sortOptionsRefetch()
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HBTextFieldController
              label={formatMessage(collectionPageMessages.maxDisplayResult)}
              name={'maxDisplayResult' as keyof CollectionAddEditFormType}
              formRules={{
                required: false,
              }}
              type="number"
              onInput={checkPositiveIntgerNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <HBSelectController
              sx={{
                width: {
                  md: '100%',
                  xs: '100%',
                },
                minWidth: 100,
              }}
              formRules={{
                required: false,
              }}
              label={formatMessage(collectionPageMessages.sortPriority)}
              name={'collectionSortOptionId' as keyof CollectionAddEditFormType}
              menuItem={
                collectionSortOptionsData?.data?.items
                  ?.filter((item) => item.collectionType == watch('collectionType'))
                  .map((item) => ({
                    title: String(item.name),
                    value: item.id || 0,
                  })) || []
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HBIconButton
              icon="setting"
              sx={{ marginTop: 1 }}
              tooltip={formatMessage(collectionPageMessages.addSortOption)}
              onClick={() => {
                getValues('collectionSortOptionId')
                  ? router.replace(
                      `/sort-option/edit?sortOptionId=${getValues(
                        'collectionSortOptionId',
                      )}&collectionType=${getValues('collectionType')}`,
                    )
                  : router.replace('/sort-option/add')
              }}
            ></HBIconButton>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <HBTextFieldController
              label={formatMessage(collectionPageMessages.originName)}
              name={'originName' as keyof CollectionAddEditFormType}
              formRules={{
                required: false,
              }}
              inputProps={{ style: { textAlign: 'left' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box display={'flex'} gap={3} alignItems={'center'} height={'100%'}>
              <Typography variant={'body1'}>
                {formatMessage(collectionPageMessages.cacheTime)}
              </Typography>
              <HBSwitchController
                disabled={watch('collectionType') == CollectionTypeEnum.User}
                formRules={{
                  required: false,
                }}
                name={'hasCache' as keyof CollectionAddEditFormType}
                onChange={(_, value) => {
                  if (!value) {
                    setValue('cacheTimeToLive', undefined)
                  }
                }}
              />
            </Box>
          </Grid>

          {getValues('hasCache') && (
            <Grid item xs={12} sm={6} md={3}>
              <HBTextFieldController
                formRules={{
                  required: true,
                }}
                required={true}
                type="number"
                name={'cacheTimeToLive' as keyof CollectionAddEditFormType}
                label={formatMessage(collectionPageMessages.durationTime)}
                disabled={!getValues('hasCache')}
                maskOptions={{ mask: Number, min: 1 }}
                value={getValues('cacheTimeToLive')}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={8}>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'small'}
          variant="outlined"
          onClick={handleGoBack}
          startIcon={<HBIcon type="angleRight" />}
        >
          {formatMessage(phrasesMessages.back)}
        </HBButton>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'small'}
          sx={() => ({
            width: 152,
            mx: 1,
            [`&.${buttonClasses.disabled}`]: {
              bgcolor: 'primary.main',
              opacity: '0.3',
              color: 'background.paper',
            },
          })}
          ref={ref}
          type="submit"
          disabled={!isValid || !isDirty}
          color="primary"
        >
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Box>
      <HBDialog
        title={formatMessage(collectionPageMessages.save)}
        content={formatMessage(collectionPageMessages.wouldYouLikeToSaveTheChanges)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}

export default CollectionAddEditForm

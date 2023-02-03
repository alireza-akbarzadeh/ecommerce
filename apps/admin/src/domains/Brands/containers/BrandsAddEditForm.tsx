import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { HBUploadButton } from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers'
import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import instance from '@hasty-bazar/admin-shared/core/handler'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  GetBrandsQueryResultApiResult,
  useGetAdminCatalogBrandsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminCatalogBrandsGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminCatalogBrandsChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminCmsPagesQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  GetGeoQueryResult,
  useGetAdminLocalityGeosQuery,
} from '@hasty-bazar/admin-shared/services/localityApi.generated'
import {
  HBAutocompleteController,
  HBButton,
  HBClassesType,
  HBDialog,
  HBIcon,
  HBSelectProps,
} from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { FC, useEffect, useRef, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { PlaceOfManufactured } from '@hasty-bazar/admin-shared/core/enums/PlaceOfManufactured'
import { BrandAddEditFormType } from '../BrandsAddEditPage'
import brandsPageMessages from '../BrandsPage.messages'
import { stateType } from './BrandsWorkflowState'

type HBPageClassNames = 'selectComponentWidth' | 'gridSection' | 'mainGrid'

export type BrandAddEditFormProps = {
  brandData?: GetBrandsQueryResultApiResult
  getCatalogBrands?: () => void
}

const classes: HBClassesType<HBPageClassNames> = {
  selectComponentWidth: { width: '100%' },
  gridSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 },
  mainGrid: {
    mb: 10,
  },
}

export type SelectBoxOptionsType = HBSelectProps['menuItem']

const BrandsAddEditForm: FC<BrandAddEditFormProps> = ({ brandData, getCatalogBrands }) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { spacing, palette } = useTheme()
  const id = router.query.id?.[0]
  const {
    formState: { isValid, touchedFields },
    reset,
    control,
    getValues,
    setValue,
  } = useFormContext<BrandAddEditFormType>()

  const { icon, pageDisplayType } = useWatch({
    control,
  })

  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const { breakpoints } = useTheme()
  const ref = useRef<HTMLButtonElement>(null)
  const [geoFilterData, setGeoFilterData] = useState<GetGeoQueryResult[]>([])

  const { data: { data: { items: businessTypeData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': 'generalData',
      'client-version': '0',
      pageSize: 1000,
    })

  const { data: { data: { items: geoData = [] } = {} } = {} } = useGetAdminLocalityGeosQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Locality.Endpoints.WebApi',
      'client-version': '1.0.1.101',
      pageSize: 1000,
      geoTypeTypeCode: '1000005',
      geoTypeValueCode: '1',
    },
    { refetchOnFocus: true },
  )

  const { data: { data: { items: screenTypeData = [] } = {} } = {} } = useGetAdminCmsPagesQuery({
    'client-name': 'cms',
    'client-version': '0',
    pageSize: 1000,
  })

  useEffect(() => {
    if (
      typeof getValues('madeType') === 'object' &&
      getValues('madeType') !== null &&
      String(getValues('madeType')?.value !== String(PlaceOfManufactured.InSide))
    ) {
      setValue('countryOfOriginId', '')
    }
  }, [getValues('madeType')])

  useEffect(() => {
    if (
      typeof getValues('madeType') === 'object' && getValues('madeType') !== null
        ? String(getValues('madeType')?.value) === String(PlaceOfManufactured.InSide)
        : String(getValues('madeType')) === String(PlaceOfManufactured.InSide)
    ) {
      const tempGeoData =
        geoData?.filter(
          (geoDataItem: GetGeoQueryResult) => String(geoDataItem.id) === '994519304110080000',
        ) || []
      setGeoFilterData([...tempGeoData])
      setValue('countryOfOriginId', '994519304110080000')
    } else {
      const tempGeoData =
        geoData?.filter(
          (geoDataItem: GetGeoQueryResult) => String(geoDataItem.id) !== '994519304110080000',
        ) || []
      setGeoFilterData([...tempGeoData])
    }
  }, [getValues('madeType'), geoData?.length])

  useEffect(() => {
    if (id && brandData?.data) {
      const { isActive, isLuxBrand, ..._data } = brandData.data
      reset({
        ...(_data as BrandAddEditFormType),
        //@ts-ignore//
        isLuxBrand: isLuxBrand === false ? '0' : '1',
      })
    }
    if (!id) {
      reset({
        //@ts-ignore//
        isLuxBrand: '0',
        stateCode: stateType.draft,
        stateName: formatMessage(brandsPageMessages.draft),
      })
    }
  }, [brandData])

  useEffect(() => {
    if (!id) {
      const data = getBusinessTypes(
        businessTypeData || [],
        BusinessTypeEnums.SelectionLimitationType,
      )
      if (data.length > 0 && !getValues('restrictionsOnUse')) {
        setValue('restrictionsOnUse', '1014001')
      }
    }
  }, [id, businessTypeData])

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
    if (isEmpty(touchedFields)) {
      router.replace('/brands')
    } else {
      setOpenConfirmModal(true)
    }
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
        <Grid container sx={classes.mainGrid} spacing={spacing(6)}>
          <Grid container item xs={12} sm={12} sx={classes.gridSection}>
            <Typography variant="h4" mb={8} color="text.primary">
              {formatMessage(brandsPageMessages.brand)}
            </Typography>
            <HBWorkflow
              entityId={id!}
              machineCode={StateMachineCode.Brand}
              useGetStateList={useGetStateList}
              useGetState={useGetStateInfo}
              useChangeState={useChangeState}
              stateCode={getValues('stateCode')}
              onChangeState={getCatalogBrands}
              factor={'1'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                maxLength: 100,
              }}
              name={'name' as keyof BrandAddEditFormType}
              label={formatMessage(brandsPageMessages.brandName)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              formRules={{
                validate: (value) => {
                  return (
                    /^[A-Za-z0-9 ]+$/gi.test(value) ||
                    !value ||
                    formatMessage(brandsPageMessages.usedInvalidCharacter)
                  )
                },
                maxLength: 100,
              }}
              label={formatMessage(brandsPageMessages.brandLatinName)}
              name={'latinName' as keyof BrandAddEditFormType}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              formRules={{
                maxLength: 10,
              }}
              label={formatMessage(brandsPageMessages.code)}
              name={'code' as keyof BrandAddEditFormType}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController<BrandAddEditFormType, any>
              label={formatMessage(brandsPageMessages.isLuxBrand)}
              fieldName="isLuxBrand"
              isOptionEqualToValue={(o, v) => o.value == v}
              getOptionLabel={(option) => `${option.title}`}
              options={[
                { title: formatMessage(brandsPageMessages.no), value: '0' },
                { title: formatMessage(brandsPageMessages.yes), value: '1' },
              ]}
              required
              formRules={{
                required: {
                  value: true,
                  message: `${formatMessage(validationsMessages.isRequired, {
                    msg: '',
                  })}`,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController
              label={formatMessage(brandsPageMessages.madeType)}
              fieldName="madeType"
              isOptionEqualToValue={(o, v) => o.value == v}
              getOptionLabel={(option) => `${option.title}`}
              options={getBusinessTypes(businessTypeData || [], BusinessTypeEnums.MadeType) || []}
              required
              formRules={{
                required: {
                  value: true,
                  message: `${formatMessage(validationsMessages.isRequired, {
                    msg: '',
                  })}`,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController<BrandAddEditFormType, any>
              label={formatMessage(brandsPageMessages.countryOfOrigin)}
              fieldName="countryOfOriginId"
              isOptionEqualToValue={(o, v) => o.value == v}
              getOptionLabel={(option) => `${option.title}`}
              options={
                (geoFilterData?.map(({ title, id }) => ({
                  title: title ?? '',
                  value: id ?? '',
                })) as { title: string; value: string | number }[]) || []
              }
              required
              formRules={{
                required: {
                  value: true,
                  message: `${formatMessage(validationsMessages.isRequired, {
                    msg: '',
                  })}`,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBTextFieldController
              type="number"
              formRules={{
                validate: (value) => {
                  return value >= 1300 || !value || formatMessage(brandsPageMessages.yearIsNotValid)
                },
                maxLength: 4,
                minLength: 4,
              }}
              label={formatMessage(brandsPageMessages.foundedYear)}
              name={'foundedYear' as keyof BrandAddEditFormType}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController
              label={formatMessage(brandsPageMessages.restrictionsOnUse)}
              fieldName="restrictionsOnUse"
              isOptionEqualToValue={(o, v) => o.value == v}
              getOptionLabel={(option) => `${option.title}`}
              options={
                getBusinessTypes(
                  businessTypeData || [],
                  BusinessTypeEnums.SelectionLimitationType,
                ) || []
              }
              required
              formRules={{
                required: {
                  value: true,
                  message: `${formatMessage(validationsMessages.isRequired, {
                    msg: '',
                  })}`,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <HBTextFieldController
              formRules={{
                validate: (value) => {
                  return (
                    /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi.test(
                      value,
                    ) || !value
                  )
                },
                maxLength: 255,
              }}
              label={formatMessage(brandsPageMessages.site)}
              name={'site' as keyof BrandAddEditFormType}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <HBTextFieldController
              formRules={{
                maxLength: 300,
              }}
              label={formatMessage(brandsPageMessages.slogon)}
              name={'slogon' as keyof BrandAddEditFormType}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <HBAutocompleteController
              label={formatMessage(brandsPageMessages.displayShowType)}
              fieldName="pageDisplayType"
              isOptionEqualToValue={(o, v) => o.value == v}
              getOptionLabel={(option) => `${option.title}`}
              options={
                getBusinessTypes(businessTypeData || [], BusinessTypeEnums.BrandDisplayType) || []
              }
              autoCompleteProps={{
                onChange: (e, value) => {
                  if (value?.value == '1105002') {
                    setValue('screenDisplayId', null)
                  }
                  setValue('pageDisplayType', value)
                },
              }}
              required
              formRules={{
                required: {
                  value: true,
                  message: `${formatMessage(validationsMessages.isRequired, {
                    msg: '',
                  })}`,
                },
              }}
            />
          </Grid>
          {(pageDisplayType == '1105002' || pageDisplayType?.value == '1105002') && (
            <Grid item xs={12} sm={6} md={2}>
              <HBAutocompleteController
                label={formatMessage(brandsPageMessages.displayType)}
                fieldName="screenDisplayId"
                isOptionEqualToValue={(o, v) => o.id == v}
                getOptionLabel={(option) => `${option.name}`}
                options={screenTypeData || []}
                required={pageDisplayType?.value == '1105002'}
                formRules={{
                  required: pageDisplayType?.value == '1105002',
                }}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      <Box>
        <Typography variant="subtitle2" mb={8} color="text.secondary">
          {formatMessage(brandsPageMessages.uploadLogoIcon)}
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 120 }}>
        <Controller
          name={'icon'}
          control={control}
          render={({ field }) => (
            <>
              {!icon && (
                <HBUploadButton
                  uploadButtonIcon="cameraPlus"
                  uploadButtonAcceptType="image/*"
                  uploadButtonTitle={formatMessage(brandsPageMessages.uploadFile)}
                  uploadButtonOnUpload={async (media, file) => {
                    const formData = new FormData()
                    formData.append('File', file)
                    instance
                      .post(`${process.env.NEXT_PUBLIC_GATEWAY}/Admin/CMS/Files`, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                          'client-name': 'Swagger on HIT.Hastim.FileServer.Endpoints.WebApi',
                          'client-version': '1.0.1.100',
                          Accept: '*/*',
                        },
                      })
                      .then((res: any) => {
                        const {
                          data: {
                            data: { path: path },
                          },
                        } = res
                        setValue('icon', path)
                      })
                      .catch((err) => {})
                  }}
                />
              )}
              {!!icon && (
                <Box sx={{ position: 'relative' }}>
                  <HBImg
                    src={process.env.NEXT_PUBLIC_CDN + String(getValues('icon'))}
                    sx={{ maxWidth: 120 }}
                  />
                  <HBButton
                    variant="text"
                    sx={{
                      position: 'absolute',
                      bottom: 35,
                      right: 25,
                      minWidth: 20,
                      backgroundColor: palette.common.white,
                      height: 25,
                      padding: 0,
                    }}
                    onClick={() => {
                      setValue('icon', '')
                    }}
                  >
                    <HBIcon type="trash" sx={{ fontSize: spacing(4) }} />
                  </HBButton>
                </Box>
              )}
            </>
          )}
        />
      </Box>
      <Box display="flex" justifyContent="space-between" mt={8}>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'small'}
          variant="outlined"
          onClick={handleGoBack}
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
          disabled={!isValid}
          color="primary"
        >
          {formatMessage(phrasesMessages.confirm)}
        </HBButton>
      </Box>
      <HBDialog
        title={formatMessage(brandsPageMessages.save)}
        content={formatMessage(brandsPageMessages.wouldYouLikeToSaveTheChanges)}
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

export default BrandsAddEditForm

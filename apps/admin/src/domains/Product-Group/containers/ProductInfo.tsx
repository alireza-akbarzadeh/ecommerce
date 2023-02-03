import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import { HBUploadImageController } from '@hasty-bazar/admin-shared/containers/HBUploadImageController'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { FormPatternsEnums } from '@hasty-bazar/admin-shared/core/enums/FormPatterns'
import {
  GetCategoryQueryResult,
  useGetAdminCatalogCategoriesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery,
  useGetAdminCatalogCategoriesGetTransitionByEntityIdAndStateMachineCodeFactorQuery,
  useLazyGetAdminCatalogCategoriesByIdCreateExcelTemplateQuery,
  usePostAdminCatalogCategoriesChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { checkPositiveNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBClassesType, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, inputAdornmentClasses, inputBaseClasses, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupMessages from '../ProductGroup.messages'
import { useGetAdminCatalogCategoriesQuery } from '../productGroupApi.enhanced'
import ProductGroupPageMessages from '../ProductGroupPage.messages'

type HBPageClassNames =
  | 'mainOptions'
  | 'mainOptionsTitleBar'
  | 'mainOptionsTitleBarSections'
  | 'labelChip'
  | 'statusChip1'
  | 'statusChip2'
  | 'changeStatusButton'
  | 'gridSection'
  | 'spinButton'

const classes: HBClassesType<HBPageClassNames> = {
  mainOptions: { p: 6, borderRadius: 1, mb: 2 },
  mainOptionsTitleBar: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 6,
  },
  mainOptionsTitleBarSections: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    mb: 2,
  },
  labelChip: ({ palette }) => ({
    backgroundColor: palette.info.light,
    color: palette.info.dark,
  }),
  statusChip1: ({ palette }) => ({
    backgroundColor: palette.warning.light,
    color: palette.warning.dark,
  }),
  statusChip2: ({ palette }) => ({
    backgroundColor: palette.success.light,
    color: palette.success.dark,
  }),
  gridSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 },
  spinButton: {
    [`& .${inputBaseClasses.input}`]: {
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        display: 'none',
      },
      '&[type=number]': {
        MozAppearance: 'textfield',
      },
    },
  },
}

type ProductInfoProps = {
  data?: GetCategoryQueryResult
  refreshData?: () => void
  action?: string
}

const ProductInfo: FC<ProductInfoProps> = (props: ProductInfoProps) => {
  const { getValues, watch, setValue, control } = useFormContext()
  const { query: { slug: [action, id] = [] } = {} } = useRouter()
  const isDisabled = !action ? true : false
  const { formatMessage } = useIntl()

  const { data: { data: { items = [] } = {} } = {} } = useGetAdminCatalogCategoriesQuery(
    {
      'client-name': 'admin',
      'client-version': '1.0.0',
      parentId: props.data?.id,
      filter: 'ParentId_Equal_--ParentId',
    },
    { skip: !props.data?.id },
  )
  const [getExcelTemplate, { isLoading }] =
    useLazyGetAdminCatalogCategoriesByIdCreateExcelTemplateQuery()

  const HandleDownloadExcelTemp = () => {
    getExcelTemplate({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id,
    }).then((res) => {
      if (res?.data?.success && res?.data?.data?.excelFile)
        window.open(process.env.NEXT_PUBLIC_CDN + '/' + res.data.data.excelFile, '_blank')
    })
  }

  useEffect(() => {
    if (action === 'add') {
      setValue('latinName', watch('code'))
    }
  }, [watch('code')])

  const { isAllocatableToProduct } = useWatch({
    control,
  })

  return (
    <Box sx={classes.mainOptions} bgcolor="common.white">
      <Box sx={classes.mainOptionsTitleBar}>
        <Box sx={classes.mainOptionsTitleBarSections}>
          <HBIcon type="documentInfo" />
          <Typography variant="h5">
            {formatMessage(productGroupMessages.productGroupTitle)}
          </Typography>
        </Box>
        {watch('stateCode') && id && (
          <HBWorkflow
            entityId={props?.data?.id!}
            onChangeState={props?.refreshData}
            stateCode={watch('stateCode')!}
            machineCode={StateMachineCode.Category}
            factor={'1'}
            useChangeState={usePostAdminCatalogCategoriesChangeStateMutation}
            useGetState={
              useGetAdminCatalogCategoriesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery
            }
            useGetStateList={
              useGetAdminCatalogCategoriesGetTransitionByEntityIdAndStateMachineCodeFactorQuery
            }
          />
        )}
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            name={'productNatureTypeCode'}
            label={formatMessage(productGroupMessages.quiddityLabel)}
            value={formatMessage(productGroupMessages.productLabel)}
            defaultValue={formatMessage(productGroupMessages.productLabel)}
            disabled
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            required
            label={formatMessage(productGroupMessages.groupCodeLabel)}
            formRules={{
              required: {
                value: true,
                message: formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(productGroupMessages.groupCodeLabel),
                }),
              },
              minLength: {
                value: 4,
                message: formatMessage(validationsMessages.minLengthValidation, {
                  count: 4,
                }),
              },
              pattern: new RegExp(FormPatternsEnums.Integer),
              maxLength: 64,
            }}
            name={'code'}
            autoComplete="off"
            disabled={isDisabled}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            sx={{ display: 'none' }}
            fullWidth
            label={formatMessage(productGroupMessages.parentGroupLabel)}
            name={'parentName'}
            disabled
            value={getValues('parentName') === 'null' ? '' : getValues('parentName')}
            formRules={{ required: false }}
          />
          <HBTextFieldController
            fullWidth
            label={formatMessage(productGroupMessages.parentGroupLabel)}
            name={'parentName'}
            disabled
            formRules={{ required: false }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <HBTextFieldController
            fullWidth
            label={formatMessage(productGroupMessages.titleGroupLabel)}
            name={'name'}
            disabled={isDisabled}
            formRules={{ required: false, maxLength: 64 }}
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            fullWidth
            required
            formRules={{
              required: {
                value: true,
                message: formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(productGroupMessages.latinTitleGroupLabel),
                }),
              },
              maxLength: 150,
              pattern: new RegExp(FormPatternsEnums.EnText),
            }}
            name={'latinName'}
            label={formatMessage(productGroupMessages.latinTitleGroupLabel)}
            disabled={isDisabled}
            InputProps={{
              endAdornment: (
                <Typography
                  variant="subtitle2"
                  mt={1}
                  color={getValues('latinName') ? 'grey.600' : 'grey.300'}
                  sx={{ direction: 'rtl' }}
                >
                  Cat-
                </Typography>
              ),
            }}
            sx={{
              [`& .${inputBaseClasses.input}`]: {
                textAlign: 'right',
                direction: 'rtl',
              },
              [`& .${inputAdornmentClasses.root}`]: {
                margin: 0,
              },
            }}
          />
        </Grid>
        <Grid item container xs={12} spacing={6}>
          <Grid item container xs={12} md={8} spacing={6}>
            <Grid item xs={12}>
              <HBTextFieldController
                label={formatMessage(productGroupMessages.furtherDetailsLabel)}
                fullWidth
                name="description"
                autoComplete={'off'}
                multiline
                rows={4}
                maxRows={4}
                formRules={{ required: false, maxLength: 64 }}
                maskOptions={undefined}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={classes.gridSection}>
              <Typography>
                {formatMessage(ProductGroupPageMessages.allocatableToProduct)}
              </Typography>
              <HBSwitchController
                name={'isAllocatableToProduct'}
                disabled={isDisabled || !!(items && items?.length > 0)}
                onChange={(e, checked) => {
                  setValue('hasPriceFilter', false)
                  setValue('displayJustStandard', false)
                  setValue('isApprovedRequired', false)
                  setValue('sellerLimitationTypeCode', null)
                  setValue('isAddable', false)
                  setValue('displayOrderTypeCode', null)
                  setValue('commisionLawId', null)
                  setValue('returnLawId', null)
                  setValue('createProductStartSubject', null)
                  setValue('displayExtractTypeCode', null)
                  setValue('screenDisplayId', null)
                  setValue('hasExpirationDate', false)
                  setValue('hasProductionSerialNumber', false)

                  if (checked) {
                    setValue('createProductStartSubject', getValues('name'))
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <HBTextFieldController
                fullWidth
                required
                label={formatMessage(productGroupMessages.displayOrder)}
                name={'displaySortTypeCode'}
                type="number"
                disabled={isDisabled}
                formRules={{
                  required: {
                    value: true,
                    message: formatMessage(validationsMessages.isRequired, {
                      msg: formatMessage(productGroupMessages.displayOrder),
                    }),
                  },
                  min: 1,
                }}
                onInput={checkPositiveNumber}
                sx={classes.spinButton}
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <Typography sx={{ color: 'grey.500' }}>
              {formatMessage(productGroupMessages.uploadImage)}
            </Typography>
            <HBUploadImageController name={'iconPath'} disabled={isDisabled} />
          </Grid>

          {isAllocatableToProduct && (
            <Grid item xs={12} container alignItems="center" gap={2}>
              <Typography variant="subtitle1">
                {formatMessage(productGroupMessages.addingProductInGroup)}
              </Typography>
              <HBButton
                variant="outlined"
                onClick={HandleDownloadExcelTemp}
                endIcon={<HBIcon type={'downloadAlt'} />}
                loading={isLoading}
              >
                {formatMessage(productGroupMessages.downloadExcelTemplate)}
              </HBButton>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProductInfo

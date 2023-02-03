import HBSelectController from '@hasty-bazar/admin-shared/containers/HBSelectController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums, RecallType } from '@hasty-bazar/admin-shared/core/enums'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { useGetAdminCatalogCategoriesQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminCmsPagesQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetBusinessTypeValuesByBusinessTypeQueryResult,
  useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery,
  useGetAdminGeneralDataCollectionQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBSelectProps } from '@hasty-bazar/core'
import { Grid, Typography } from '@mui/material'
import { ChangeEvent, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import MegaMenuPageMessages from '../../MegaMenu.messages'
import OptionalDropDown from './optionalDropDown'

export type SelectBoxOptionsType = HBSelectProps['menuItem']

type TreeStructureFormItemsProps = {
  action: string
}
const TreeStructureFormItems = ({ action }: TreeStructureFormItemsProps) => {
  const { formatMessage } = useIntl()
  const { setValue, watch } = useFormContext()

  const { data: RecallTypeData } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessType: BusinessTypeEnums.RecallTypeCode,
    })

  const { data: { data: collectionQueryData } = {} } = useGetAdminGeneralDataCollectionQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      pageNumber: 1,
      pageSize: 1000,
      stateCode: '2',
      collectionType: 1035006,
      filter: 'StateCode==@StateCode &&  CollectionType!=@CollectionType',
    },
    {
      skip: !(watch('recallType') === RecallType.Collection),
    },
  )

  const { data: { data: pagesData } = {} } = useGetAdminCmsPagesQuery(
    {
      'client-name': 'page-query',
      'client-version': '1.0.0',
      pageNumber: 1,
      pageSize: 1000,
      stateCode: '2',
      filter: 'StateCode_Equal_--StateCode',
    },
    {
      skip: !(watch('recallType') === RecallType.Page),
    },
  )

  const { data: { data: categoriesData = {} } = {} } = useGetAdminCatalogCategoriesQuery(
    {
      'client-name': 'catalog-category-query',
      'client-version': '0',
      pageNumber: 1,
      pageSize: 10000,
    },
    {
      skip: !(watch('recallType') === RecallType.ProductCatalog),
    },
  )

  const RecallTypeDataItems = useMemo(
    () =>
      (RecallTypeData?.data?.items?.map((item: GetBusinessTypeValuesByBusinessTypeQueryResult) => ({
        title: item.title,
        value: item.fullCode,
      })) || []) as SelectBoxOptionsType,
    [RecallTypeData],
  )

  const handleChangeRecall = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('pageId', null)
    setValue('productCategories', null)
    setValue('queryId', null)
    setValue('recallType', event.target.value)
  }

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          id="input-menu-code"
          label={`${formatMessage(MegaMenuPageMessages.code)}`}
          fullWidth
          name="code"
          autoComplete={'off'}
          type={'number'}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.code),
              }),
            },
            validate: (value) =>
              !!value.trim() ||
              `${formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.code),
              })}`,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          id="input-menu-title"
          label={`${formatMessage(MegaMenuPageMessages.titleMenu)}`}
          fullWidth
          name="title"
          autoComplete={'off'}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.titleMenu),
              }),
            },
            validate: (value) =>
              !!value.trim() ||
              `${formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.code),
              })}`,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBSelectController
          onChange={handleChangeRecall}
          fullWidth
          label={formatMessage(MegaMenuPageMessages.recallType)}
          menuItem={RecallTypeDataItems}
          name={'recallType'}
          inputLabelProps={{ required: true }}
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.recallType),
              }),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={({ spacing }) => ({ mx: spacing(0.5) })}>
          {formatMessage(MegaMenuPageMessages.isLeaf)}
        </Typography>
        <HBSwitchController name={'isLeaf'} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <HBTextFieldController
          id="input-menu-displaySortOrder"
          label={`${formatMessage(MegaMenuPageMessages.displaySortOrder)}`}
          fullWidth
          name="displaySortOrder"
          autoComplete={'off'}
          type="number"
          formRules={{
            required: {
              value: true,
              message: formatMessage(validationsMessages.isRequired, {
                msg: formatMessage(MegaMenuPageMessages.displaySortOrder),
              }),
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <OptionalDropDown
          categoriesData={categoriesData}
          collectionQueryData={collectionQueryData?.items}
          pagesData={pagesData}
        />
      </Grid>
    </>
  )
}
export default TreeStructureFormItems

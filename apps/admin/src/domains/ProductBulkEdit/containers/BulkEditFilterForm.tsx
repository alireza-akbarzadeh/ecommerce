import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBNumericFormatController from '@hasty-bazar/admin-shared/containers/HBNumericFormatController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import SellerDataGrid from '@hasty-bazar-admin/domains/Products/containers/productForm/addProduct/sellerDataGrid'
import { RelationCategoryRenderController } from '@hasty-bazar-admin/domains/Products/containers/relationCategoryRender'
import {
  GetAdminCatalogProductsBulkUpdateListApiArg,
  useGetAdminCatalogProductsBulkUpdateCategoryByVendorQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'

import {
  GetStatesQueryResult,
  useGetWorkflowStateMachineByStateMachineIdStateQuery,
} from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBAutocompleteController, HBButton, HBForm } from '@hasty-bazar/core'
import { Grid, Stack } from '@mui/material'
import { useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ProductBulkEditMessages from '../ProductBulkEdit.messages'

export type BulkEditFormType = Omit<
  GetAdminCatalogProductsBulkUpdateListApiArg,
  'client-name' | 'client-version'
>
export const BULK_FORM_ID = 'bulkEditForm'
interface BulkEditFilterFormProps {
  onFilter: (value: BulkEditFormType) => void
  onResetFilter: () => void
}

const PAGE_SIZE = 100000
const BulkEditFilterForm = ({ onFilter, onResetFilter }: BulkEditFilterFormProps) => {
  const { formatMessage } = useIntl()

  const formProviderProps = useForm<BulkEditFormType>({
    mode: 'onChange',
  })
  const { control, setValue, formState } = formProviderProps

  const { vendorId = '', categoryId } = useWatch({
    control,
  })
  const { data: categoriesData } = useGetAdminCatalogProductsBulkUpdateCategoryByVendorQuery({
    'client-name': 'admin',
    'client-version': '1.0.0',
    vendorId: vendorId ?? null,
    pageSize: PAGE_SIZE,
  })

  const { data: { data: { items: workflowItems = [] } = {} } = {} } =
    useGetWorkflowStateMachineByStateMachineIdStateQuery({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      stateMachineId: '2',
    })
  const categories =
    categoriesData?.data?.items?.map((item) => {
      if (item.parentId === null) {
        return item
      }

      if (categoriesData.data?.items?.find((item2) => item2.id === item.parentId)) {
        return item
      }
      return {
        ...item,
        parentId: null,
      }
    }) || []
  return (
    <HBForm<BulkEditFormType>
      id={BULK_FORM_ID}
      formProviderProps={formProviderProps}
      onSubmit={onFilter}
    >
      <Stack gap={6}>
        <Grid container xs={12} spacing={4} alignItems={'flex-start'}>
          <Grid item xs={12} sm={4}>
            <SellerDataGrid
              onSelectSeller={(value) => {
                setValue('vendorId', value?.id as unknown as string)
              }}
              vendorId={vendorId}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <RelationCategoryRenderController
              label={formatMessage(ProductBulkEditMessages.category)}
              categoriesData={categories}
              setValue={(value) => {
                setValue('categoryId', String(value))
              }}
              required={false}
              categoryId={categoryId}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <HBAutocompleteController<BulkEditFormType, GetStatesQueryResult>
              formRules={{ required: true }}
              label={formatMessage(ProductBulkEditMessages.state)}
              fieldName="stateCode"
              valueExtractor={(option) => option?.code}
              isOptionEqualToValue={(option, value) => option.code === value}
              getOptionLabel={(option) => option.title ?? ''}
              options={workflowItems || []}
            />
          </Grid>
        </Grid>
        <Grid container xs={12} spacing={4}>
          <Grid item xs={12} sm={3}>
            <HBDatePickerController
              name="fromPublicationDate"
              label={formatMessage(ProductBulkEditMessages.fromPublishDate)}
              formRules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <HBDatePickerController
              name="untilPublicationDate"
              label={formatMessage(ProductBulkEditMessages.toPublishDate)}
              formRules={{ required: false }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <HBNumericFormatController<BulkEditFormType>
              formRules={{ required: false }}
              fullWidth
              thousandSeparator=","
              name="fromOriginalPrice"
              label={formatMessage(ProductBulkEditMessages.fromCost)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <HBNumericFormatController<BulkEditFormType>
              formRules={{ required: false }}
              fullWidth
              thousandSeparator=","
              name="untilOriginalPrice"
              label={formatMessage(ProductBulkEditMessages.toCost)}
            />
          </Grid>
        </Grid>
        <Stack my={4} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
          <HBButton
            onClick={() => {
              formProviderProps.reset()
              onResetFilter()
            }}
            variant="outlined"
          >
            {formatMessage(ProductBulkEditMessages.removeFilters)}
          </HBButton>
          <HBButton type="submit" sx={{ mr: 4 }}>
            {formatMessage(ProductBulkEditMessages.addFilter)}
          </HBButton>
        </Stack>
      </Stack>
    </HBForm>
  )
}

export default BulkEditFilterForm

import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { RecallType } from '@hasty-bazar/admin-shared/core/enums'
import { GetCategoriesQueryResultPagedCollectionQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetPagesQueryResultPagedCollectionQueryResult,
  TitleRecord,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBSelectTree } from '@hasty-bazar/core'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import MegaMenuPageMessages from '../../MegaMenu.messages'

type OptionalDropDownProps = {
  categoriesData: GetCategoriesQueryResultPagedCollectionQueryResult | undefined
  collectionQueryData: TitleRecord[] | null | undefined
  pagesData: GetPagesQueryResultPagedCollectionQueryResult | undefined
}
const OptionalDropDown = ({
  categoriesData,
  collectionQueryData,
  pagesData,
}: OptionalDropDownProps) => {
  const { formatMessage } = useIntl()
  const { setValue, watch } = useFormContext()

  const getQuerySelectedValue = () => {
    const queryId = watch('queryId')
    return typeof queryId === 'string'
      ? collectionQueryData?.find((value) => value?.id == queryId)
      : queryId
  }

  const getPageSelectedValue = () => {
    const pageId = watch('pageId')
    return typeof pageId === 'string'
      ? pagesData?.items?.find((value) => value?.id == pageId)
      : pageId
  }

  return (
    <>
      {watch('recallType') === RecallType.ProductCatalog && (
        <HBSelectTree
          size="medium"
          sx={{ width: '100%', height: 40, '& > label': { lineHeight: 1 } }}
          renderValueEmptyLabel={formatMessage(MegaMenuPageMessages.categoriesPlaceholder)}
          rootParentValue={null}
          data={
            categoriesData?.items?.map((item: any) => {
              return {
                id: item.id!,
                label: item.name!,
                parentId: item.parentId!,
                value: item.id!,
                isAllocatableToProduct: item.isAllocatableToProduct!,
              }
            }) || []
          }
          multiple
          value={watch('productCategories')?.split(',')}
          onChange={(value: string[]) => {
            setValue('productCategories', value.join())
          }}
        />
      )}
      {watch('recallType') === RecallType.Collection && collectionQueryData?.length && (
        <HBSelectMultiColumnController
          name="queryId"
          label={formatMessage(MegaMenuPageMessages.businessQuery)}
          items={collectionQueryData}
          columnDefs={[
            {
              field: 'name',
              width: 500,
              headerName: formatMessage(MegaMenuPageMessages.businessQueryTitle),
              showInChip: true,
            },
            { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
          ]}
          pageSize={40}
          totalItems={collectionQueryData?.length}
          formRules={{ required: true }}
          value={getQuerySelectedValue()}
        />
      )}
      {watch('recallType') === RecallType.Page && pagesData?.items?.length && (
        <HBSelectMultiColumnController
          name="pageId"
          label={formatMessage(MegaMenuPageMessages.pageQuery)}
          items={pagesData.items}
          columnDefs={[
            {
              field: 'name',
              width: 500,
              headerName: formatMessage(MegaMenuPageMessages.pageQueryTitle),
              showInChip: true,
            },
            { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
          ]}
          pageSize={40}
          totalItems={pagesData?.items?.length}
          formRules={{ required: true }}
          value={getPageSelectedValue()}
        />
      )}

      {watch('recallType') === RecallType.DirectLink && (
        <HBTextFieldController
          id="input-menu-url"
          label={`${formatMessage(MegaMenuPageMessages.url)}`}
          fullWidth
          name="url"
          autoComplete={'off'}
          formRules={{
            required: true,
          }}
          inputProps={{ style: { textAlign: 'left' } }}
        />
      )}
    </>
  )
}

export default OptionalDropDown

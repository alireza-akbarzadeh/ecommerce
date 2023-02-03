import { useGetAdminCatalogProductsByIdOtherRelatedCategoryGroupsQuery } from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductContext } from '@hasty-bazar-admin/domains/Products/containers/contexts/productContext'
import { RelationCategoryRender } from '@hasty-bazar-admin/domains/Products/containers/relationCategoryRender'
import { ICellRendererParams } from 'ag-grid-community'
import { forwardRef, useContext, useImperativeHandle, useState } from 'react'
import { useIntl } from 'react-intl'
import otherRelatedProductGroupsMessages from '../otherRelatedProductGroups.messages'
const PAGE_SIZE = 10000
export const HBRelatedProductGroupEditor = forwardRef((props: ICellRendererParams, ref) => {
  const { formatMessage } = useIntl()
  const { productDetails } = useContext(ProductContext)

  const catagoriesData = useGetAdminCatalogProductsByIdOtherRelatedCategoryGroupsQuery({
    'client-name': '1',
    'client-version': '1',
    pageSize: PAGE_SIZE,
    id: productDetails?.id!,
    currentCategoryId: productDetails?.categoryId || undefined,
  })

  const [selectedValue, setSelectedValue] = useState(props.value)
  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return selectedValue
      },
    }
  })

  const onChangeHandler = (value: string) => {
    setSelectedValue(value)
  }
  const categories =
    catagoriesData.data?.data?.items?.map((item) => {
      if (item.parentId === null) {
        return item
      }

      if (catagoriesData.data?.data?.items?.find((item2) => item2.id === item.parentId)) {
        return item
      }
      return {
        ...item,
        parentId: null,
      }
    }) || []

  return (
    <RelationCategoryRender
      defaultValue={selectedValue}
      renderValueEmptyLabel={formatMessage(otherRelatedProductGroupsMessages.choseProductGroup)}
      label=""
      categoriesData={categories}
      setValue={(value) => {
        onChangeHandler(String(value))
      }}
    />
  )
})

import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBSelectTree } from '@hasty-bazar/core'
import { Box, styled } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import useDataItemsQuery from '../../hooks/useDataItemsQuery'
import ShippingProviderMessages from '../../shippingProvider.message'

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))

const useExceptionCategoryGroup = (
  gridRef: RefObject<HBDataGridClientRef>,
  CategoryGroupId: string,
  id: string,
) => {
  const { formatMessage } = useIntl()
  const { categories } = useDataItemsQuery()
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const createPathBreadcrumb = (paths: []) => {
    return paths?.map((path) => ({
      url: '#',
      title: path,
    }))
  }

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/sale/api/ShippingProviders/${id}/CategoryExceptions`

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 110,
        minWidth: 110,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        checkboxSelection,
        headerCheckboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: () => {},
        },
      },
      {
        field: 'id',
        headerName: formatMessage(phrasesMessages.id),
        hide: true,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'productCategoryTitle',
        headerName: formatMessage(ShippingProviderMessages.categoryTitle),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd || CategoryGroupId === data.id ? (
            <CellBoxStyle>
              <HBSelectTree
                required={false}
                size="medium"
                sx={{ width: '100%', height: 40, '& > label': { lineHeight: 1 } }}
                renderValueEmptyLabel={formatMessage(ShippingProviderMessages.categoryTitle)}
                rootParentValue={null}
                onChange={(value) => setValue!(value)}
                data={
                  categories?.map((item: any) => {
                    return {
                      id: item.id!,
                      label: item.name!,
                      parentId: item.parentId!,
                      value: item.id!,
                      isAllocatableToProduct: item.isAllocatableToProduct!,
                    }
                  }) || []
                }
              />
            </CellBoxStyle>
          ) : (
            data.productCategoryTitle
          ),
      },
      {
        field: 'paths',
        headerName: formatMessage(ShippingProviderMessages.categoryAddress),
        filter: 'agTextColumnFilter',
        maxWidth: 700,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <CellBoxStyle>
            <Box pt={2}>
              <BreadCrumbSection breadItems={createPathBreadcrumb(data?.paths) || []} />
            </Box>
          </CellBoxStyle>
        ),
      },
    ],
    [gridRef?.current?.api?.getSelectedRows()],
  )

  return { columnDefs, actionUrl }
}

export default useExceptionCategoryGroup

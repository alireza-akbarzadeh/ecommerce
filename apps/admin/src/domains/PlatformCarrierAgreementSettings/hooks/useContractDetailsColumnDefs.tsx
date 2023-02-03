import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBSelect, HBSelectTree } from '@hasty-bazar/core'
import { Box, styled } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import useDataItemsQuery from '../hooks/useDataItemsQuery'
import PlatformCarrierAgrrementsMessages from '../PlatformCarrierAgreementSettings.message'

interface useContractDetailsColumnDefsProps {
  gridRef: RefObject<HBDataGridClientRef>
  exceptionId: string | undefined
}

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

const useContractDetailsColumnDefs = ({
  gridRef,
  exceptionId,
}: useContractDetailsColumnDefsProps) => {
  const { formatMessage } = useIntl()
  const { categories, vendors } = useDataItemsQuery()

  const checkboxSelection = function (
    params: CheckboxSelectionCallbackParams | HeaderCheckboxSelectionCallbackParams,
  ) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const GridActions = (props: ICellRendererParams) => {
    return <GridActionColumn {...props} menuItems={[]} />
  }

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
        headerCheckboxSelection: checkboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      {
        field: 'id',
        headerName: formatMessage(phrasesMessages.id),
        hide: true,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'vendorName',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorTitle),
        filter: 'agTextColumnFilter',
        maxWidth: 270,
        cellRenderer: ({ setValue, data }: ICellRendererParams) => {
          return data?.isAdd || exceptionId === data.id ? (
            <CellBoxStyle>
              <HBSelect
                sx={{ width: 180, height: 30, '& > label': { lineHeight: 1 } }}
                size="small"
                menuItem={
                  vendors?.map((vendor) => ({ value: vendor.id!, title: vendor.fullName })) || []
                }
                label={formatMessage(PlatformCarrierAgrrementsMessages.choose)}
                onChange={(e) => setValue!(e.target.value)}
              />
            </CellBoxStyle>
          ) : (
            data.vendorName
          )
        },
      },
      {
        field: 'productCategoryTitle',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.categoryTitle),
        filter: 'agTextColumnFilter',
        maxWidth: 250,
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd || exceptionId === data.id ? (
            <CellBoxStyle>
              <HBSelectTree
                required={false}
                size="medium"
                sx={{ width: '100%', height: 40, '& > label': { lineHeight: 1 } }}
                renderValueEmptyLabel={formatMessage(
                  PlatformCarrierAgrrementsMessages.categoryTitle,
                )}
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
        field: 'vendorNationalCode',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorNationalCode),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
      },
      {
        field: 'vendorMobileNo',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorMobileNo),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
      },
      {
        field: 'vendorAddress',
        headerName: formatMessage(PlatformCarrierAgrrementsMessages.vendorAddress),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    columnDefs,
  }
}

export default useContractDetailsColumnDefs

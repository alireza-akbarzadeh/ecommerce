import HBDataGridActionHeader from '@hasty-bazar/admin-shared/components/HBDataGridActionHeader'
import { categoryAddress } from '@hasty-bazar-admin/domains/voucherManagement/components'
import VoucherGridActionColumn from '@hasty-bazar-admin/domains/voucherManagement/components/VoucherGridActionColumn'
import { IUseDiscountCodeGridData } from '@hasty-bazar-admin/domains/voucherManagement/types/IUseDiscountCodeGridData'
import voucherManagementPageMessages from '@hasty-bazar-admin/domains/voucherManagement/VoucherManagementPage.messages'
import { useGetAdminCatalogProductsGetPublishedProductsByVendorByVendorIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBSelectMultiColumn } from '@hasty-bazar/core'
import { Box, Stack, styled, SxProps, Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import ProductStatus from '../../components/productStatus'
import { useVoucherContext, VoucherContextType } from '../../context'
const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

const sx: SxProps = { width: 300, height: 30, '& > label': { lineHeight: 1 } }

const useProductCodeGridColumnData = ({
  setDeleteDialogState,
  selectedRows,
  checkboxSelection,
  headerCheckboxSelection,
  gridRef,
}: IUseDiscountCodeGridData) => {
  const { formatMessage } = useIntl()

  const { selected } = useVoucherContext() as VoucherContextType

  const { data: productApi, refetch } =
    useGetAdminCatalogProductsGetPublishedProductsByVendorByVendorIdQuery({
      'client-name': '',
      'client-version': '',
      vendorId: selected,
    })

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <VoucherGridActionColumn setDeleteDialogState={setDeleteDialogState} {...props} />
    },
    [selectedRows],
  )
  useEffect(() => {
    if (selected) {
      refetch()
    }
  }, [selected])

  const vendorColumn = [
    {
      field: 'name',
      width: 260,
      headerName: formatMessage(voucherManagementPageMessages.productDsc),
      showInChip: true,
    },
    { field: 'id', width: 5, headerName: 'id', hidden: true, isIdField: true },
  ]
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
          innerRenderer: GridActions,
        },
        headerComponent: HBDataGridActionHeader,
      },
      {
        field: 'code',
        maxWidth: 200,
        headerName: formatMessage(voucherManagementPageMessages.sellerCode),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value : '-'),
      },
      {
        field: 'productName',
        maxWidth: 340,
        headerName: formatMessage(voucherManagementPageMessages.productDsc),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd ? (
            <CellBoxStyle>
              <HBSelectMultiColumn
                label={formatMessage(voucherManagementPageMessages.productDsc)}
                items={
                  productApi?.data?.products?.map((item) => ({
                    id: item.id!,
                    name: item.name!,
                  })) || []
                }
                onChange={(_, newValue) => {
                  if (setValue) {
                    setValue(newValue)
                  }
                }}
                sx={sx}
                columnDefs={vendorColumn}
                pageSize={15}
                totalItems={productApi?.data?.products?.length as number}
              />
            </CellBoxStyle>
          ) : data?.productName ? (
            data.productName
          ) : (
            '-'
          ),
      },
      {
        maxWidth: 200,
        field: 'fullName',
        headerName: formatMessage(voucherManagementPageMessages.seller),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: ICellRendererParams) => (value ? value : '-'),
      },
      {
        field: 'categoryAddress',
        headerName: formatMessage(voucherManagementPageMessages.productGroup),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => (
          <Stack flexDirection={'row'} flexWrap={'wrap'} gap={0.6} alignItems={'center'} mt={2.4}>
            {data?.categoryAddress?.map((txt: string[], i: number) => (
              <Typography key={i} component={'span'}>
                {`${txt}${categoryAddress?.length === i + 1 ? '-' : ''}`}
              </Typography>
            ))}
          </Stack>
        ),
      },

      {
        maxWidth: 180,
        field: 'stateName',
        headerName: formatMessage(voucherManagementPageMessages.statusPublish),
        filter: 'agTextColumnFilter',
        cellRenderer: ProductStatus,
        cellRendererParams: {
          childStatus: false,
        },
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return { columnDefs, GridActions }
}

export default useProductCodeGridColumnData

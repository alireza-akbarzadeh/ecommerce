import HBDataGridActionHeader from '@hasty-bazar/admin-shared/components/HBDataGridActionHeader'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { default as voucherManagementPageMessages } from '@hasty-bazar-admin/domains/voucherManagement/VoucherManagementPage.messages'
import { Status } from '@hasty-bazar-admin/domains/voucherManagement/components'
import VoucherGridActionColumn from '@hasty-bazar-admin/domains/voucherManagement/components/VoucherGridActionColumn'
import { IUseDiscountCodeGridData } from '@hasty-bazar-admin/domains/voucherManagement/types/IUseDiscountCodeGridData'
import { useGetAdminIdrVendorsQuery } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBSelectMultiColumn } from '@hasty-bazar/core'
import { Box, SxProps, styled } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

const sx: SxProps = { width: 200, height: 40, '& > label': { lineHeight: 0.8 } }
const useSellerCodeGridColumnData = ({
  setDeleteDialogState,
  selectedRows,
  checkboxSelection,
  headerCheckboxSelection,
  gridRef,
  id,
}: IUseDiscountCodeGridData) => {
  const { formatMessage } = useIntl()

  const { data: vendorApi } = useGetAdminIdrVendorsQuery({
    'client-name': '',
    'client-version': '',
    id,
  })

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <VoucherGridActionColumn setDeleteDialogState={setDeleteDialogState} {...props} />
    },
    [selectedRows],
  )

  const vendorColumn = [
    {
      field: 'fullName',
      width: 140,
      headerName: formatMessage(voucherManagementPageMessages.seller),
      showInChip: true,
    },
    {
      field: 'mobile',
      width: 140,
      headerName: formatMessage(phrasesMessages.phoneNumber),
      showInChip: false,
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
        cellRenderer: ({ data }: ICellRendererParams) => (data && data.code ? data.code : '-'),
      },
      {
        field: 'fullName',
        maxWidth: 275,
        headerName: formatMessage(voucherManagementPageMessages.sellerName),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd ? (
            <CellBoxStyle>
              <HBSelectMultiColumn
                label={formatMessage(voucherManagementPageMessages.seller)}
                items={
                  vendorApi?.data?.items?.map((itm) => ({
                    id: itm.id!,
                    fullName: itm.fullName!,
                    mobile: itm.mobile!,
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
                totalItems={vendorApi?.data?.items?.length!}
              />
            </CellBoxStyle>
          ) : data?.fullName ? (
            data.fullName
          ) : (
            '-'
          ),
      },
      {
        maxWidth: 200,
        field: 'phoneNumber',
        headerName: formatMessage(voucherManagementPageMessages.phoneNumber),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) =>
          data && data.phoneNumber ? data.phoneNumber : '-',
      },
      {
        field: 'addresss',
        headerName: formatMessage(voucherManagementPageMessages.sellerAddress),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) =>
          data && data.addresss ? data.addresss : '-',
      },
      {
        maxWidth: 200,
        field: 'stateName',
        headerName: formatMessage(voucherManagementPageMessages.statusPublish),
        filter: 'agTextColumnFilter',
        filterParams: {
          readOnly: true,
        },
        cellRenderer: Status,
        cellRendererParams: {
          childStatus: true,
        },
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return { columnDefs, GridActions }
}

export default useSellerCodeGridColumnData

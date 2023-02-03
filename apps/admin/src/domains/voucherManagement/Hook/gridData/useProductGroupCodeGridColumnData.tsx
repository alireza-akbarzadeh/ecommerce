import HBDataGridActionHeader from '@hasty-bazar/admin-shared/components/HBDataGridActionHeader'
import VoucherGridActionColumn from '@hasty-bazar-admin/domains/voucherManagement/components/VoucherGridActionColumn'
import { IUseDiscountCodeGridData } from '@hasty-bazar-admin/domains/voucherManagement/types/IUseDiscountCodeGridData'
import voucherManagementPageMessages from '@hasty-bazar-admin/domains/voucherManagement/VoucherManagementPage.messages'
import { useGetAdminCatalogCategoriesQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Box, Stack, styled, Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { categoryAddress, Status } from '../../components'
import { RelationCategoryRender } from '../../components/RelationCategoryRender'
import { filterCategory } from '../../enum/filterCategory'

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

const useProductGroupCodeGridColumnData = ({
  setDeleteDialogState,
  selectedRows,
  checkboxSelection,
  headerCheckboxSelection,
  gridRef,
}: IUseDiscountCodeGridData) => {
  const { formatMessage } = useIntl()

  const { data: categoriesData } = useGetAdminCatalogCategoriesQuery({
    'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    filter: 'StateCode==@StateCode',
    pageSize: Number(filterCategory.pageSize),
    stateCode: String(filterCategory.stateCode),
  })

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <VoucherGridActionColumn setDeleteDialogState={setDeleteDialogState} {...props} />
    },
    [selectedRows],
  )

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
        field: 'categoryName',
        maxWidth: 200,
        headerName: formatMessage(voucherManagementPageMessages.productGroup),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd ? (
            <CellBoxStyle>
              <RelationCategoryRender
                setValue={setValue!}
                categoriesData={categoriesData?.data?.items}
              />
            </CellBoxStyle>
          ) : data?.categoryName ? (
            data.categoryName
          ) : (
            '-'
          ),
      },
      {
        field: 'categoryAddress',
        headerName: formatMessage(voucherManagementPageMessages.productGroupAddress),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => (
          <Stack mt={2} flexDirection={'row'} flexWrap={'wrap'} gap={0.6} alignItems={'center'}>
            {data?.categoryAddress?.map((txt: string[], i: number) => (
              <Typography key={i} component={'span'}>
                {`${txt}${categoryAddress?.length === i + 1 ? '-' : ''}`}
              </Typography>
            ))}
          </Stack>
        ),
      },
      {
        field: 'stateName',
        maxWidth: 180,
        headerName: formatMessage(voucherManagementPageMessages.statusPublish),
        filter: 'agTextColumnFilter',
        cellRenderer: Status,
        cellRendererParams: {
          childStatus: false,
        },
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return { columnDefs, GridActions }
}

export default useProductGroupCodeGridColumnData

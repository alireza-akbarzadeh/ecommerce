import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBAutoComplete, HBDataGrigToolbar, HBTextField } from '@hasty-bazar/core'
import { CollectProduct } from './components'
import { useVendorFinancialReportColumnDefs, useVendorFinancialReportController } from './hooks'
import VendorFinancialReportMessages from './vendorFinancialReport.messages'
export default function VendorFinancialReport() {
  const {
    actionUrl,
    classes,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    gridRef,
    breadcrumbs,
    refreshGridData,
    selectedRows,
    formatMessage,
    product,
    selectedValue,
    onFilterChange,
  } = useVendorFinancialReportController()

  const { columnDefs, toolbarMoreItems } = useVendorFinancialReportColumnDefs({
    gridRef,
    selectedRows,
  })

  return (
    <HBDataGridClient
      actionUrl={actionUrl}
      columnDefs={columnDefs}
      rowSelection="multiple"
      rightHeader={
        <BreadCrumbSection
          title={formatMessage(VendorFinancialReportMessages.VendorFinancialReport)}
          breadItems={breadcrumbs}
        />
      }
      pagination
      paginationPageSize={25}
      enableRtl
      sideBar
      classes={classes}
      autoGroupColumnDef={autoGroupColumnDef}
      onSelectedChanged={handleChangedSelectedRows}
      masterDetail
      detailRowAutoHeight
      detailCellRenderer={CollectProduct}
      ref={gridRef}
      detailCellRendererParams={{
        title: formatMessage(VendorFinancialReportMessages.collectProductInHistory),
      }}
      GridToolbar={(props) => (
        <HBDataGrigToolbar
          addProps={{ show: false }}
          editProps={{ show: false }}
          deleteProps={{
            show: false,
          }}
          searchProps={{ show: false }}
          statusProps={{ show: false }}
          refreshProps={{ onClick: () => refreshGridData(true) }}
          items={toolbarMoreItems}
          {...props}
        >
          <HBAutoComplete
            value={selectedValue}
            onChange={(_: unknown, params: { label: string; value: string }[]) =>
              onFilterChange(params)
            }
            options={
              product?.map((item: any) => {
                return {
                  label: item.productName,
                  value: item.productId,
                }
              }) || []
            }
            getOptionLabel={(option: unknown) => (option as { label: string }).label || ''}
            multiple
            renderInput={(params) => (
              <HBTextField
                {...params}
                label={formatMessage(VendorFinancialReportMessages.product)}
                sx={{ verticalAlign: 'unset' }}
              />
            )}
            size="small"
            sx={{ maxWidth: 250, minWidth: 250 }}
          />
        </HBDataGrigToolbar>
      )}
    />
  )
}

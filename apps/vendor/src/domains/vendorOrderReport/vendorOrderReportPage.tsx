import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBAutoComplete, HBDataGrigToolbar, HBTextField } from '@hasty-bazar/core'
import { ProductItems } from './components'
import { useVendorOrderDetailsColumnDefs, useVendorOrderDetailsController } from './hooks'
import vendorOrderReportMessages from './vendorOrderReportMessages'
export default function VendorOrderReportPages() {
  const {
    actionUrl,
    classes,
    handleChangedSelectedRows,
    gridRef,
    breadcrumbs,
    refreshGridData,
    selectedRows,
    formatMessage,
    product,
    selectedValue,
    onFilterChange,
  } = useVendorOrderDetailsController()

  const { columnDefs, toolbarMoreItems } = useVendorOrderDetailsColumnDefs({
    gridRef,
    selectedRows,
  })

  return (
    <HBDataGridClient
      actionUrl={actionUrl}
      columnDefs={columnDefs}
      rightHeader={
        <BreadCrumbSection
          title={formatMessage(vendorOrderReportMessages.vendorOrderReport)}
          breadItems={breadcrumbs}
        />
      }
      pagination
      paginationPageSize={25}
      rowSelection="multiple"
      enableRtl
      sideBar
      classes={classes}
      onSelectedChanged={handleChangedSelectedRows}
      detailRowAutoHeight
      masterDetail
      detailCellRenderer={ProductItems}
      detailCellRendererParams={{ title: formatMessage(vendorOrderReportMessages.pickUpItems) }}
      ref={gridRef}
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
            onChange={(_, params: { label: string; value: string }) => onFilterChange(params)}
            options={
              product?.map((item) => {
                return {
                  label: item.productName,
                  value: item.productId,
                }
              }) || []
            }
            getOptionLabel={(option: unknown) => (option as { label: string }).label || ''}
            renderInput={(params) => (
              <HBTextField
                {...params}
                label={formatMessage(vendorOrderReportMessages.product)}
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

import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetOrdersHeaderQueryFilter } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBDataGrigToolbar, HBForm } from '@hasty-bazar/core'
import { Box, Grid } from '@mui/material'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { OrderDetailsGrid } from '../../components'
import { OrderGridController, useFilterController } from '../../hooks'
import {
  default as OrderDetailsMessages,
  default as OrdersManagementMessage,
} from '../../ordersManagement.message'
import FormFields from './FormFields'
export type FilterProps = {
  userId?: string
}

function Filters({ userId }: FilterProps) {
  const {
    handleOnGrigReady,
    expandedItem,
    setExpandItems,
    formatMessage,
    handleSubmit,
    rowData,
    formRef,
    modelData,
    getIds,
  } = useFilterController({ userId })

  const {
    columnDefs,
    autoGroupColumnDef,
    handleChangedSelectedRows,
    gridRef,
    toolbarMoreItems,
    gridClasses,
    openInNewTab,
  } = OrderGridController({ modelData, getIds, userId })

  const formProvider = useForm<GetOrdersHeaderQueryFilter>({ mode: 'all' })
  const { reset } = formProvider

  const removeFilters = () => {
    reset({
      dateFilterTypeCode: null,
      fromDate: null,
      toDate: null,
      bundleId: '',
      shippingStatusType: [],
      agentId: [],
      customerId: [],
      vendorId: [],
      providerCode: [],
      productId: [],
      orderNumber: '',
    })
    formRef?.current?.click()
  }

  return (
    <>
      <HBExplanation
        expanded={expandedItem}
        onChange={(_, expandedItem) => {
          setExpandItems(expandedItem)
        }}
        summary={
          <HBExplanationSummary
            title={formatMessage(OrdersManagementMessage.filter)}
            icon={'history'}
          />
        }
        sx={{ mb: 4 }}
        elevation={0}
        detail={
          <HBForm<GetOrdersHeaderQueryFilter>
            formProviderProps={formProvider}
            onSubmit={handleSubmit}
            mode="all"
          >
            <Box>
              <Grid container spacing={6} mt={4}>
                <FormFields {...{ userId, handleSubmit, formRef, removeFilters }} />
              </Grid>
            </Box>
          </HBForm>
        }
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <Box height={760}>
          <HBDataGridClient
            classes={gridClasses}
            columnDefs={columnDefs}
            pagination
            paginationPageSize={25}
            enableRtl
            sideBar
            rowData={rowData?.items}
            totalRows={rowData?.totalItems}
            autoGroupColumnDef={autoGroupColumnDef}
            onSelectedChanged={handleChangedSelectedRows}
            masterDetail
            rowGroupPanelShow="always"
            rowSelection="multiple"
            onDoubleClick={openInNewTab}
            actionUrl=""
            detailCellRenderer={OrderDetailsGrid}
            detailCellRendererParams={{ title: formatMessage(phrasesMessages.showMore) }}
            detailRowAutoHeight
            ref={gridRef}
            onGridReady={handleOnGrigReady}
            GridToolbar={(props) => (
              <HBDataGrigToolbar
                addProps={{ show: false }}
                deleteProps={{ show: false }}
                editProps={{ show: false }}
                refreshProps={{ onClick: () => removeFilters() }}
                statusProps={{ show: false }}
                searchProps={{ show: false }}
                items={toolbarMoreItems}
                {...props}
              />
            )}
            pinnedBottomRowData={useMemo(
              () => [
                {
                  orderTypesName: formatMessage(OrderDetailsMessages.totalOnThePage),
                  commissionPrice: rowData?.pagedTotalCommissionPrice ?? 0,
                  refundPrice: rowData?.pagedTotalRefundPrice ?? 0,
                  finalPrice: rowData?.pagedTotalFinalPrice,
                  shipmentFee: rowData?.pagedTotalShippingPrice,
                  discountPrice: rowData?.pagedTotalDiscountPrice,
                  sumOriginalPrice: rowData?.pagedTotalOriginalPrice,
                },
                {
                  orderTypesName: formatMessage(OrderDetailsMessages.total),
                  commissionPrice: rowData?.totalCommissionPrice ?? 0,
                  refundPrice: rowData?.totalRefundPrice ?? 0,
                  finalPrice: rowData?.totalFinalPrice,
                  shipmentFee: rowData?.totalShippingPrice,
                  discountPrice: rowData?.totalDiscountPrice,
                  sumOriginalPrice: rowData?.totalOriginalPrice,
                },
              ],
              [rowData],
            )}
          />
        </Box>
      </Box>
    </>
  )
}

export default Filters

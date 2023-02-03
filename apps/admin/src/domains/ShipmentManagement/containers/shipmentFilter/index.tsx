import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBDataGridClient } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBForm, HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useState } from 'react'
import { ShipmentFilterFiled } from '../../components'
import { useShipmentFilter, useShipmentGridController, useShipmentToolbar } from '../../hooks'
import ShipmentManagementMessage from '../../messages'
import { IShipmentData, IShipmentModelForm } from '../../types'
const ShipmentFilter = () => {
  const [shippingData, setShippingData] = useState<IShipmentData>()

  const {
    handleChangedSelectedRows,
    classes,
    gridRef,
    selectedRows,
    withProduct,
    columnsWithProduct,
    autoGroupColumnDef,
    withOutProduct,
    columnsWithOutProduct,
  } = useShipmentGridController(shippingData)

  const {
    breadcrumbs,
    expandable,
    setExpandable,
    formatMessage,
    handleSubmit,
    formProvider,
    isProduct,
    isValid,
    handleOnGridReady,
    formRef,
    handleRemoveFilter,
  } = useShipmentFilter({ setShippingData })

  const { toolBar } = useShipmentToolbar({
    selectedRows,
    gridRef,
    isProduct,
    handleRemoveFilter,
  })

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(ShipmentManagementMessage.shipmentManagement)}
        breadItems={breadcrumbs}
      />
      <HBExplanation
        elevation={0}
        expanded={expandable}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
        }}
        onChange={() => setExpandable(!expandable)}
        summary={
          <Box display={'flex'} alignItems="center" gap={1}>
            <HBIcon type="box" />
            <Typography variant="h6">
              {formatMessage(ShipmentManagementMessage.shipmentManagement)}
            </Typography>
          </Box>
        }
        detail={
          <HBForm<IShipmentModelForm>
            formProviderProps={formProvider}
            onSubmit={handleSubmit}
            mode="all"
          >
            <ShipmentFilterFiled {...{ formRef, handleRemoveFilter, isValid }} />
          </HBForm>
        }
      />
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        mt={2}
        sx={{
          borderRadius: (theme) => theme.spacing(4),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Box height={720}>
          <HBDataGridClient
            pagination
            sideBar
            enableRtl
            actionUrl=""
            rowSelection="multiple"
            editUrl={'/shipmentManagement/details/'}
            rowGroupPanelShow="always"
            paginationPageSize={25}
            ref={gridRef}
            columnDefs={isProduct ? columnsWithProduct : columnsWithOutProduct}
            totalRows={shippingData?.totalItems}
            rowData={shippingData?.items}
            onGridReady={handleOnGridReady}
            classes={classes}
            autoGroupColumnDef={autoGroupColumnDef}
            onSelectedChanged={handleChangedSelectedRows}
            detailCellRendererParams={{ title: formatMessage(phrasesMessages.details) }}
            detailRowAutoHeight
            GridToolbar={toolBar}
            pinnedBottomRowData={isProduct ? withProduct : withOutProduct}
          />
        </Box>
      </Box>
    </>
  )
}
export default ShipmentFilter

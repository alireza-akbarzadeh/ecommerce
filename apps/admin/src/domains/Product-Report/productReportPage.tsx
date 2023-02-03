import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import sideBarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import instance from '@hasty-bazar/admin-shared/core/handler'
import {
  GetCategoriesForReportQueryResult,
  CategoriesReportDto,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBAgGrid, HBAgGridClasses, HBDataGrigToolbar, HBIcon } from '@hasty-bazar/core'
import { Box, Typography, useTheme } from '@mui/material'
import {
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  RowClassParams,
} from 'ag-grid-community'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useProductReportGrid from './hooks/useProductReportGrid'
import ProductReportMessage from './productReport.messages'

type TotalSums = Omit<CategoriesReportDto, 'queryResults'>

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 350px)`,
    display: 'inline-block',
  },
}

const ProductReportPage = () => {
  const { formatMessage } = useIntl()
  const { typography, palette } = useTheme()
  const breadcrumbs = [
    { url: '/', title: formatMessage(sideBarMessages.dashboard) },
    { url: '#', title: formatMessage(sideBarMessages.productReport) },
  ]
  const gridRef = useRef<HBDataGridClientRef>(null)

  const { productReportGridColumns, refreshGridData } = useProductReportGrid(gridRef)

  const [totalRows, setTotalRows] = useState<number>()
  const [totalSums, setTotalSums] = useState<TotalSums>()

  const getServerSideDatasource: (server: GridReadyEvent) => IServerSideDatasource = (
    server: GridReadyEvent,
  ) => {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        const actionUrl = params.parentNode?.data
          ? `${
              process.env.NEXT_PUBLIC_GATEWAY
            }/Admin/Catalog/categories/getAllCategoriesForReport?ParentId=${
              params.parentNode?.data.id
            }&Depth=${
              params.parentNode?.data.depth + 1
            }&PageNumber=1&PageSize=100000&Filter=Depth==@Depth%26ParentId==@ParentId`
          : `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/categories/getAllCategoriesForReport?Depth=1&PageNumber=1&PageSize=100000&Filter=Depth==@Depth`
        instance
          .get(`${actionUrl}`)
          .then((res) => {
            const data = res.data?.data
            setTotalRows(data.queryResults.totalItems)
            !params.parentNode?.data && setTotalSums(data)
            params.success({
              rowData: data.queryResults.items.map((item: GetCategoriesForReportQueryResult) => {
                return {
                  ...item,
                  group: Number(item?.subCategoriesCount) !== 0,
                }
              }),
              rowCount: data.queryResults.totalItems,
            })
          })
          .catch((err) => {
            params.fail()
          })
      },
    }
  }

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const dataSource = getServerSideDatasource(params)
    params.api!.setServerSideDatasource(dataSource)
  }, [])

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      let filterFirstComponent = gridRef.current!.api.getFilterInstance('name')
      filterFirstComponent &&
        filterFirstComponent.setModel({
          type: 'contains',
          filter: value ?? null,
        })
      gridRef.current!.api.onFilterChanged()
    }
  }

  const getRowStyle = useCallback((params: RowClassParams) => {
    if (params.node.rowPinned) {
      return { fontWeight: 'bold', background: palette.grey[100] }
    }
  }, [])

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(sideBarMessages.productReport)}
        breadItems={breadcrumbs}
      />
      <Box
        bgcolor="common.white"
        p={4}
        sx={(theme) => ({
          borderRadius: theme.spacing(1),
          border: `1px solid ${theme.palette.grey[200]}`,
          minHeight: 'calc(100vh - 185px)',
        })}
      >
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HBIcon type="chartBar" size="small" />
          {formatMessage(ProductReportMessage.productReport)}
        </Typography>
        <HBAgGrid
          columnDefs={[...productReportGridColumns()]}
          pagination={false}
          paginationPageSize={100000}
          cacheBlockSize={100000}
          rowModelType={'serverSide'}
          serverSideStoreType={'partial'}
          enableRtl
          sideBar
          classes={classes}
          getRowStyle={getRowStyle}
          autoGroupColumnDef={{
            field: 'name',
            minWidth: 280,
            // TODO: we need it to show icon
            // cellRenderer: (params: ICellRendererParams) => (
            //   <>
            //     <HBImg
            //       src={process.env.NEXT_PUBLIC_CDN + ''}
            //       sx={{ width: 20, height: 20, objectFit: 'fill' }}
            //     />
            //     {params.data.name}
            //   </>
            // ),
            cellStyle: (params) => ({
              fontWeight: params.node.rowPinned
                ? 'bold'
                : params?.data?.subCategoriesCount !== 0 && params?.data?.depth === 1
                ? 700
                : params?.data?.subCategoriesCount !== 0 && params?.data?.depth === 2
                ? 500
                : 200,
              fontSize:
                (params?.data?.depth === 1
                  ? typography.body2.fontSize
                  : params?.data?.depth === 2
                  ? typography.body2.fontSize
                  : typography.caption.fontSize) || 'unset',
            }),
          }}
          detailRowAutoHeight
          ref={gridRef}
          treeData={true}
          isServerSideGroup={function (dataItem) {
            return dataItem.group
          }}
          getServerSideGroupKey={function (dataItem) {
            return dataItem.name
          }}
          totalRows={totalRows}
          onGridReady={onGridReady}
          sx={{
            '& .ag-cell-wrapper': {
              flexDirection: 'row !important',
              gap: 0,
            },
          }}
          defaultColDef={{
            width: 300,
            resizable: true,
            flex: 1,
          }}
          pinnedBottomRowData={useMemo(
            () => [
              {
                name: formatMessage(ProductReportMessage.totalSum),
                categoriesInProductsCount: totalSums?.sumCategoriesInProductsCount ?? '-',
                publishedCount: totalSums?.sumPublishedCount ?? '-',
                draftsCount: totalSums?.sumDraftsCount ?? '-',
                disabledCount: totalSums?.sumDisabledCount ?? '-',
                vendorsCount: totalSums?.sumVendorsCount ?? '-',
                allSubCategoriesCount: totalSums?.sumSubCategoriesCount ?? '-',
                data: null,
              },
            ],
            [totalSums],
          )}
          GridToolbar={(props) => (
            <HBDataGrigToolbar
              onChange={handleChangedGridActions}
              statusProps={{ show: false }}
              addProps={{ show: false }}
              deleteProps={{ show: false }}
              editProps={{ show: false }}
              refreshProps={{ onClick: () => refreshGridData() }}
              searchProps={{ openPosition: 'right', show: false }}
              moreProps={{ show: false }}
              {...props}
            />
          )}
        />
      </Box>
    </>
  )
}

export default ProductReportPage

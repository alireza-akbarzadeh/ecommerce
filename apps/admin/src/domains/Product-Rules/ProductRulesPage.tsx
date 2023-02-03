import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import HBGrid, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  useDeleteAdminCatalogProductRulesByIdMutation,
  useGetAdminCatalogProductRulesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useLazyGetAdminCatalogProductRulesGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminCatalogProductRulesChangeStateMutation,
  usePostAdminCatalogProductRulesDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  HBAgGridClasses,
  HBDataGrigToolbar,
  HBDialog,
  HBSelectProps,
  openToast,
} from '@hasty-bazar/core'
import { Box } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Description from './components/description'
import productRulesMessages from './ProductRules.messages'

export type SelectBoxOptionsType = HBSelectProps['menuItem']

const breadcrumbs = [
  { url: '/', title: <FormattedMessage id={sidebarMessages.dashboard.defaultMessage} /> },
  { url: '#', title: <FormattedMessage id={sidebarMessages.productRules.defaultMessage} /> },
]
interface ProductRulesPageProps {
  showBreadcrumbs?: boolean
  productRulesUrl?: string
  processEventName?: string
}

const ProductRulesPage: FC<ProductRulesPageProps> = ({ showBreadcrumbs, processEventName }) => {
  const { formatMessage } = useIntl()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const router = useRouter()
  const actionUrl = !processEventName
    ? `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/ProductRules`
    : `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/ProductRules/getall-published/?ProcessEventName=${processEventName}`
  const gridRef = useRef<HBDataGridClientRef>(null)

  const [deleteProductRules] = useDeleteAdminCatalogProductRulesByIdMutation()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const classes: HBAgGridClasses = {
    wrapper: {
      height: showBreadcrumbs ? `calc(100vh - 240px)` : 570,
    },
  }

  useEffect(() => {
    if (processEventName) {
      refreshGridData(true)
    }
  }, [processEventName])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor="1"
          stateMachineCode={StateMachineCode.ProductRules.toString()}
          useChangeState={usePostAdminCatalogProductRulesChangeStateMutation}
          useLazyGetStateList={useGetStateList}
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(productRulesMessages.menuItemEdit),
                  onClick: () => {
                    handleEditRule(props.data?.id)
                  },
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(productRulesMessages.menuItemDelete),
                  onClick: () => {
                    handleDeleteRules(props.data?.id)
                  },
                },
              ],
            },
          ]}
          onChangesState={refreshGridData}
        />
      )
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
      },
      {
        field: 'id',
        headerName: formatMessage(productRulesMessages.idField),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        hide: true,
      },
      {
        field: 'processTitle',
        headerName: formatMessage(productRulesMessages.process),
        filter: 'agTextColumnFilter',
        minWidth: 300,
        maxWidth: 400,
        hide: false,
      },
      {
        field: 'name',
        headerName: formatMessage(productRulesMessages.nameField),
        filter: 'agTextColumnFilter',
        minWidth: 300,
        maxWidth: 400,
        hide: false,
        cellRenderer: Description,
      },
      {
        field: 'stateCode',
        headerName: formatMessage(productRulesMessages.statusIdField),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        maxWidth: 200,
        hide: false,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            factor="1"
            machineCode={StateMachineCode.ProductRules}
            stateCode={data?.stateCode}
            useGetStateInfo={useGetStateInfo}
          />
        ),
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const handleChangedSelectedRows = (chosenRows: any[]): void => {
    setSelectedRows(chosenRows)
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      const searchFields: GridFilterFieldType[] = [
        { field: 'StateCode', operator: 'equal', value: value !== -1 ? value : null },
      ]
      gridRef.current!.addFilter({
        id: 'filterProductRules',
        fields: searchFields,
        type: 'filter',
        addToFilter: true,
      })
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchProductRules',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchProductRules')
      }
    }
  }

  const handleAddRules = (): void => {
    if (processEventName) {
      router.push(`/product-rules/add?processEventName=${processEventName}`)
    } else {
      router.push('/product-rules/add')
    }
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDeleteRules = async (id?: string) => {
    const ids = id && typeof id === 'string' ? [id] : selectedRows.map((row) => row.id)
    gridLoading(true)
    const requests = ids.map((id) =>
      deleteProductRules({
        'client-name': 'delete-product-rules',
        'client-version': '1.0.0',
        id,
      }),
    )
    const responses = await Promise.all(requests)
    // @ts-ignore
    const errors = responses.filter((res) => res?.error?.data?.success === false)
    refreshGridData()
    gridLoading(false)
    setDeleteDialogState({ show: false, id: undefined })
    if (errors.length) {
      openToast({
        message: formatMessage(validationsMessages.errorMessageDeleting, {
          msg: errors.length,
        }),
        type: 'error',
      })
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const handleEditRule = (id?: string) => {
    router.push(`/product-rules/edit/${id && typeof id === 'string' ? id : selectedRows[0].id}`)
  }

  const [downloadFile] = usePostAdminCatalogProductRulesDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getProductRuleExcelQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  return (
    <Box sx={{ height: 700 }}>
      <HBGrid
        editUrl="/product-rules/edit/"
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        rightHeader={
          showBreadcrumbs ? (
            <BreadCrumbSection
              title={formatMessage(productRulesMessages.breadcrumbTitle)}
              breadItems={breadcrumbs}
            />
          ) : (
            <></>
          )
        }
        classes={classes}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ onClick: handleAddRules, id: 'commissionRuleAddBtn' }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            statusProps={{
              label: formatMessage(productRulesMessages.statusIdField),
              show: true,
              menuItem: [
                { title: formatMessage(productRulesMessages.statusAll), value: -1 },
                { title: formatMessage(productRulesMessages.statusDraft), value: 1 },
                { title: formatMessage(productRulesMessages.statusRelease), value: 2 },
              ],
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            searchProps={{ show: true }}
            editProps={{ disabled: selectedRows.length !== 1, onClick: handleEditRule }}
            items={[
              {
                label: formatMessage(phrasesMessages.download),
                icon: 'fileDownload',
                onClick: handleDownloadPage,
              },
              {
                label: formatMessage(phrasesMessages.downloadAll),
                icon: 'fileDownloadAlt',
                onClick: () => handleDownloadPage(true),
              },
            ]}
            {...props}
            key={processEventName}
          />
        )}
      />
      <HBDialog
        content={formatMessage(productRulesMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(productRulesMessages.confirmationTitleDeleting)}
        onAccept={handleDeleteRules}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}
ProductRulesPage.defaultProps = {
  showBreadcrumbs: true,
}
export default ProductRulesPage

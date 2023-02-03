import { GridWorkflowActionColumn } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
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
  useDeleteAdminCmsMenugroupsByIdMutation,
  useLazyGetAdminCmsMenugroupsGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminCmsMenugroupsChangeStateMutation,
  usePostAdminCmsMenugroupsDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import { CheckboxSelectionCallbackParams, ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import MegaMenuPageMessages from './MegaMenu.messages'
import { generateDataGrid } from './utils/generate-data-grid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}
const breadcrumbs = [
  { url: '/', title: <FormattedMessage id={sidebarMessages.dashboard.defaultMessage} /> },
  { url: '#', title: <FormattedMessage id={sidebarMessages.megaMenu.defaultMessage} /> },
]
const MegaMenuPage = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/CMS/menugroups`
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })
  const [deleteMegaMenu] = useDeleteAdminCmsMenugroupsByIdMutation()

  const checkboxSelection = (params: CheckboxSelectionCallbackParams) => {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor="1"
          stateMachineCode={StateMachineCode.MegaMenu.toString()}
          useChangeState={usePostAdminCmsMenugroupsChangeStateMutation}
          useLazyGetStateList={useGetStateList}
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => {
                    handleEditMegaMenu(props.data?.id)
                  },
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => {
                    handleDeleteMenuGroup(props.data?.id)
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
        headerCheckboxSelection: checkboxSelection,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      ...generateDataGrid(formatMessage),
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('status')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? value : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Code', operator: 'contains', value: String(value) },
          { field: 'Title', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchMenuGroup',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchMenuGroup')
      }
    }
  }

  const handleEditMegaMenu = (id?: string): void => {
    router.push(`mega-menu/edit/${id && typeof id === 'string' ? id : selectedRows[0].id}`)
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api?.deselectAll()
  }, [])

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDeleteMenuGroup = async (id?: string) => {
    const ids = id && typeof id === 'string' ? [id] : selectedRows.map((row) => row.id)
    gridLoading(true)
    const requests = ids.map((id) =>
      deleteMegaMenu({
        'client-name': 'delete-mega-menu-group',
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

  const [downloadFile] = usePostAdminCmsMenugroupsDownloadExcelFileMutation()
  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getMenuGroupsExcelQueryFilter: {
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
    <>
      <HBGrid
        editUrl="mega-menu/edit/"
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        ref={gridRef}
        pagination
        paginationPageSize={25}
        rowSelection={'multiple'}
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(MegaMenuPageMessages.megaMenu)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ onClick: () => router.push('mega-menu/add') }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            statusProps={{
              label: formatMessage(MegaMenuPageMessages.step),
              show: true,
              menuItem: [
                { title: formatMessage(phrasesMessages.all), value: -1 },
                { title: formatMessage(phrasesMessages.draft), value: 1 },
                { title: formatMessage(phrasesMessages.release), value: 2 },
              ],
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            searchProps={{ show: true, openPosition: 'right' }}
            editProps={{ disabled: selectedRows.length !== 1, onClick: handleEditMegaMenu }}
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
          />
        )}
      />
      <HBDialog
        content={formatMessage(MegaMenuPageMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(MegaMenuPageMessages.confirmationTitleDeleting)}
        onAccept={handleDeleteMenuGroup}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
export default MegaMenuPage

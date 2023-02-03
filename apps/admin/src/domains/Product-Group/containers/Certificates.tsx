import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminCatalogCategoriesByIdCertificatesAndCertificateIdMutation,
  useGetAdminCatalogCertificatesQuery,
  usePostAdminCatalogCategoriesByIdCertificatesMutation,
  usePutAdminCatalogCategoriesByIdCertificatesAndCertificateIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  HBAgGridClasses,
  HBDataGrigToolbar,
  HBDialog,
  HBSelect,
  HBSwitch,
  MenuItemProps,
  openToast,
} from '@hasty-bazar/core'
import { Box, styled } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import HBGrigToolbarItem from 'libs/core/src/components/HBGrigToolbar/components/HBGrigToolbarItem'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import productGroupMessages from '../ProductGroup.messages'
import ProductGroupPageMessages from '../ProductGroupPage.messages'
import CertificateGridActionColumn from './CertificateGridActionColumn'

const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const classes: HBAgGridClasses = {
  wrapper: {
    height: 600,
  },
}

export type CertificatesDataGridProps = {
  categoryName: string
  certificateId: string
  certificateName: string
  id: string
  isActive: boolean
  isRequird: boolean
}

const CellBoxStyle = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100%',
}))

const Certificates = () => {
  const { formatMessage } = useIntl()

  const { query: { slug = [] } = {} } = useRouter()
  const [, id] = slug
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const [openActive, setOpenActive] = useState(false)
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [status, setStatus] = useState<0 | 1>()
  const [selectedRows, setSelectedRows] = useState<CertificatesDataGridProps[]>([])
  const [editingCertificateId, setEditingCertificateId] = useState<string>('')
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/categories/${id}/certificates`

  const { data: { data: { items: allPermissions = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'admin',
      'client-version': '1.0.0',
      businessType: BusinessTypeEnums.PermissionIsRequired,
    })

  const [createCertificate] = usePostAdminCatalogCategoriesByIdCertificatesMutation()
  const [editCertificate] = usePutAdminCatalogCategoriesByIdCertificatesAndCertificateIdMutation()
  const [deleteCertificate] =
    useDeleteAdminCatalogCategoriesByIdCertificatesAndCertificateIdMutation()

  const { data: { data: { items: certificates = [] } = {} } = {} } =
    useGetAdminCatalogCertificatesQuery({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      isActive: true,
      filter: 'IsActive_Equal_--IsActive',
    })

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const gridRef = useRef<HBDataGridClientRef>(null)

  const getAllRows = () => {
    let certificateData: CertificatesDataGridProps[] = []
    gridRef.current!.api.forEachNode((node) => certificateData.push(node.data))
    return certificateData
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const cancelEditCertificateSubmission = () => {
    setIsAddOrEdit(false)
    setEditingCertificateId('')
  }

  const editCertificateSubmission = () => {
    const selectedNode = gridRef.current?.api.getSelectedNodes()[0].data

    gridLoading(true)
    editCertificate({
      id,
      certificateId: selectedNode.certificateId,
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      updateAssignedCategoryCertificateModel: {
        isRequird: selectedNode.isRequird,
        isActive: selectedNode.isActive,
      },
    })
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          openToast({
            message: formatMessage(productGroupMessages.certificateUpdatedSuccessfully),
            type: 'success',
          })
          refreshGridData()
          setIsAddOrEdit(false)
          setEditingCertificateId('')
        }
      })
      .finally(() => {
        gridLoading(false)
      })
  }

  const cancelAddCertificateSubmission = () => {
    let certificateData = gridRef.current!.api.getModel().getRow(0)
    gridRef.current!.api.applyTransaction({
      remove: [certificateData?.data],
    })!
    setIsAddOrEdit(false)
  }

  const addCertificateSubmission = async () => {
    const newRow = gridRef.current!.api.getModel().getRow(0)
    let certificateData = getAllRows()

    if (!newRow?.data.certificateName || !newRow?.data.isRequird) {
      openToast({
        message: formatMessage(ProductGroupPageMessages.certificateRequiredFields),
        type: 'error',
      })
      return
    }

    if (
      certificateData.filter(
        (certificate) =>
          certificate?.certificateId === newRow?.data.certificateName && certificate?.id,
      ).length > 0
    ) {
      openToast({
        message: formatMessage(ProductGroupPageMessages.certificateDuplicateLicense),
        type: 'error',
      })
      return
    }

    gridLoading(true)
    createCertificate({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id,
      assignCategoryCertificateModel: {
        certificateId: newRow?.data.certificateName,
        isActive: newRow?.data.isActive,
        isRequird: newRow?.data.isRequird,
      },
    })
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          openToast({
            message: formatMessage(productGroupMessages.certificateAddedSuccessfully),
            type: 'success',
          })
          refreshGridData()
          setIsAddOrEdit(false)
        }
      })
      .finally(() => {
        gridLoading(false)
      })
  }

  const handleEditCertificate = (certificateId: string) => {
    setIsAddOrEdit(true)
    setEditingCertificateId(certificateId)
  }

  const handleDeleteCertificate = useCallback(async () => {
    try {
      const certificateIds = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.certificateId)

      const requests = certificateIds.map((certificateId) => {
        return deleteCertificate({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          certificateId,
          id,
        })
      })

      gridLoading(true)
      await Promise.all(requests)
      setDeleteDialogState({ show: false, id: undefined })
      refreshGridData()
      gridLoading(false)
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <CertificateGridActionColumn
          handleEditCertificate={handleEditCertificate}
          setDeleteDialogState={setDeleteDialogState}
          {...props}
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
        field: 'certificateName',
        headerName: formatMessage(ProductGroupPageMessages.certificateTypeColumn),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
        cellRenderer: ({ setValue, data }: ICellRendererParams) =>
          data?.isAdd ? (
            <CellBoxStyle>
              <HBSelect
                sx={{ width: 180, height: 30, '& > label': { lineHeight: 1 } }}
                size="small"
                menuItem={
                  certificates
                    ? certificates?.map((certificate) => ({
                        title: certificate.title || '',
                        value: certificate.id || '',
                      }))
                    : []
                }
                label={''}
                onChange={(e) => setValue!(e.target.value)}
              />
            </CellBoxStyle>
          ) : (
            data.certificateName
          ),
      },
      {
        field: 'categoryName',
        headerName: formatMessage(ProductGroupPageMessages.certificateCategoryNameColumn),
        filter: 'agTextColumnFilter',
        hide: true,
      },
      {
        field: 'isRequird',
        maxWidth: 200,
        headerName: formatMessage(ProductGroupPageMessages.certificateRequiredColumn),
        filter: 'agTextColumnFilter',
        cellRenderer: ({ setValue, data, value }: ICellRendererParams) =>
          data.isAdd || editingCertificateId === data.certificateId ? (
            <CellBoxStyle>
              <HBSelect
                sx={{ width: 180, height: 30, '& > label': { lineHeight: 1 } }}
                size="small"
                menuItem={
                  allPermissions
                    ? allPermissions?.map((permission) => ({
                        title: permission.title || '',
                        value: permission.id || '',
                      }))
                    : []
                }
                label={''}
                onChange={(e) => setValue!(e.target.value)}
                value={value}
              />
            </CellBoxStyle>
          ) : (
            allPermissions?.find((permission) => permission.id == value)?.title
          ),
      },
      {
        field: 'isActive',
        headerName: formatMessage(ProductGroupPageMessages.certificateStatusColumn),
        filter: 'agTextColumnFilter',
        filterParams: {
          readOnly: true,
        },
        maxWidth: 120,
        cellRenderer: ({ value, data, setValue }: ICellRendererParams) =>
          data?.isAdd ? (
            <HBSwitch defaultChecked value={value} onChange={(e, checked) => setValue!(checked)} />
          ) : (
            <HBSwitch
              disabled={editingCertificateId !== data.certificateId}
              checked={value}
              onChange={(e, checked) => {
                setValue!(checked)
              }}
            />
          ),
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api.deselectAll()
  }, [])

  const handleChangeStatus = (status: 0 | 1) => {
    setStatus(status)
    setOpenActive(true)
  }

  const handleChangeActive = useCallback(async () => {
    try {
      const selectedRows = gridRef.current!.api.getSelectedRows()
      const requests = selectedRows.map(({ certificateId }) => {
        return editCertificate({
          id,
          certificateId,
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          updateAssignedCategoryCertificateModel: {
            isActive: !!status,
          },
        })
      })

      gridLoading(true)
      await Promise.all(requests)
      refreshGridData()
      setStatus(undefined)
      setOpenActive(false)
      gridLoading(false)
    } catch (e) {}
  }, [status])

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    const activeCount = selectedRows.filter((row) => row.isActive).length
    const unActiveCount = selectedRows.filter((row) => !row.isActive).length
    const disabledActive = unActiveCount === 0
    const disabledUnActive = activeCount === 0
    const disabledOnNoSelected = selectedRows.length === 0

    return [
      {
        label: formatMessage(phrasesMessages.active),
        icon: 'toggleOn',
        disabled: disabledOnNoSelected || disabledActive,
        onClick: () => handleChangeStatus(1),
        show: !disabledActive,
      },
      {
        label: formatMessage(phrasesMessages.deActive),
        icon: 'toggleOff',
        disabled: disabledOnNoSelected || disabledUnActive,
        onClick: () => handleChangeStatus(0),
        show: !disabledUnActive,
      },
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'arrowDown',
        disabled: disabledOnNoSelected,
      },
    ]
  }, [selectedRows])

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: CertificatesDataGridProps[]) => {
    setSelectedRows(selectedRows)
  }

  const handleAddCertificate = () => {
    try {
      const row = {
        isRequird: false,
        isActive: true,
        isAdd: true,
        certificateId: 0,
      }
      gridRef.current!.api?.applyTransaction({
        add: [row],
        addIndex: 0,
      })
      setIsAddOrEdit(true)
    } catch (e) {}
  }

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? (value == 1 ? 'true' : 'false') : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'CertificateName', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchCertificate',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchCertificate')
      }
    }
  }
  return (
    <Box sx={{ height: 730 }}>
      <HBDataGridClient
        serverSideFilteringAlwaysResets
        serverSideSortingAlwaysResets
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        cacheBlockSize={25}
        rowModelType={'serverSide'}
        serverSideStoreType={'full'}
        rowSelection="multiple"
        enableRtl
        sideBar
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        detailRowAutoHeight
        ref={gridRef}
        onDoubleClick={(props) => handleEditCertificate(props?.data?.certificateId)}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{
              disabled: toolbarStatus.disabledOnSelected || isAddOrEdit,
              onClick: handleAddCertificate,
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected || isAddOrEdit,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            editProps={{
              disabled: selectedRows.length !== 1 || isAddOrEdit,
              onClick: () => handleEditCertificate(selectedRows[0].certificateId),
            }}
            moreProps={{ disabled: isAddOrEdit }}
            refreshProps={{ onClick: () => refreshGridData(true), disabled: isAddOrEdit }}
            items={toolbarMoreItems}
            {...props}
            statusProps={{ show: true, disabled: isAddOrEdit }}
          >
            <HBGrigToolbarItem
              icon="times"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={
                editingCertificateId
                  ? cancelEditCertificateSubmission
                  : cancelAddCertificateSubmission
              }
            />
            <HBGrigToolbarItem
              icon="check"
              tooltip={formatMessage(phrasesMessages.confirm)}
              disabled={!isAddOrEdit}
              show={isAddOrEdit}
              onClick={editingCertificateId ? editCertificateSubmission : addCertificateSubmission}
            />
          </HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={formatMessage(ProductGroupPageMessages.certificatesDeleteDialogContent, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(ProductGroupPageMessages.certificatesDeleteDialogTitle)}
        onAccept={handleDeleteCertificate}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
      <HBDialog
        content={formatMessage(ProductGroupPageMessages.certificatesChangeStatusDialogContent, {
          msg: selectedRows.length,
        })}
        title={formatMessage(ProductGroupPageMessages.certificatesChangeStatusDialogTitle)}
        onAccept={handleChangeActive}
        onReject={() => setOpenActive(false)}
        open={openActive}
        onClose={() => setOpenActive(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default Certificates

import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import {
  catalogApi,
  useGetAdminCatalogApiUnitOfMeasurementGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminCatalogApiUnitOfMeasurementChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useMeasurementUnitGrid from './hooks/useMeasurementUnitGrid'
import measurementUnitMessages from './measurement-unitMessages.messages'

export type MeasurementUnitPageType = {
  id?: string | null
  measuringUnitType?: any
  measuringUnitTypeTitle?: string | null
  name?: string | null
  latinName?: string | null
  code?: string | null
  isBaseUnit?: boolean
  conversionFactor?: number
  displaySort?: number | null
  stateTitle?: string | null
  stateCode?: string | null
  stateName?: string | null
  createdOn?: string | null
}

const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

const MeasurementUnitPage = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '/#', title: formatMessage(sidebarMessages.measurementUnit) },
  ]

  const gridRef = useRef<HBDataGridClientRef>(null)

  const {
    checkboxSelection,
    headerCheckboxSelection,
    gridColumns,
    handleChangedGridActions,
    refreshGridData,
    gridLoading,
    handleRemoveMeasurement,
  } = useMeasurementUnitGrid(gridRef)

  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })

  const actionUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/api/UnitOfMeasurement/GetAll`,
    [],
  )

  const handleDeleteMeasurement = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)
      handleRemoveMeasurement(ids, gridLoading, () => {
        setDeleteDialogState({ show: false, id: undefined })
        refreshGridData()
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor="1"
          stateMachineCode={StateMachineCode.MeasuringUnit.toString()}
          useChangeState={usePostAdminCatalogApiUnitOfMeasurementChangeStateMutation}
          useLazyGetStateList={
            catalogApi.useLazyGetAdminCatalogApiUnitOfMeasurementGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          {...props}
          menuItems={[
            {
              label: formatMessage(measurementUnitMessages.general),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => handleEdit(props.data.id),
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => {
                    setDeleteDialogState({ show: true })
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
      ...gridColumns(),
      {
        field: 'stateCode',
        headerName: formatMessage(measurementUnitMessages.state),
        filter: 'agTextColumnFilter',
        minWidth: 130,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            machineCode={StateMachineCode.MeasuringUnit}
            useGetStateInfo={useGetStateInfo}
            stateCode={data?.stateCode}
            factor={'1'}
          />
        ),
      },
    ],
    [],
  )

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedSelectedRows = (selectedRows: any[]) => {
    setSelectedRows(selectedRows)
  }

  const handleEdit = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/measurement-unit/edit/${id}`)
  }

  return (
    <Box>
      <HBDataGridClient
        actionUrl={actionUrl}
        editUrl={'/measurement-unit/edit/'}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        cacheBlockSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(measurementUnitMessages.breadcrumbTitle)}
            breadItems={breadcrumbs}
          />
        }
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ onClick: () => router.push('/measurement-unit/add') }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => setDeleteDialogState({ show: true }),
            }}
            statusProps={{
              label: formatMessage(measurementUnitMessages.state),
              show: true,
              menuItem: [
                { title: formatMessage(phrasesMessages.all), value: -1 },
                { title: formatMessage(phrasesMessages.draft), value: 1 },
                { title: formatMessage(phrasesMessages.release), value: 2 },
                { title: formatMessage(phrasesMessages.rejected), value: 3 },
              ],
            }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: handleEdit,
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            moreProps={{ show: false }}
            {...props}
          ></HBDataGrigToolbar>
        )}
      />
      <HBDialog
        content={formatMessage(measurementUnitMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(measurementUnitMessages.confirmationTitleDeleting)}
        onAccept={handleDeleteMeasurement}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}
export default MeasurementUnitPage

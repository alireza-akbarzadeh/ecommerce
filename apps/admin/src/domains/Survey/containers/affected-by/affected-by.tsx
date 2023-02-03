import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetAllInfluensesQueryResult,
  useDeleteAdminGeneralDataInfluensByIdAndInfluensIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import useAffectedByGrid from '../../hooks/useAffectedByGrid'
import surveyMessages from '../../survey.messages'
import { SelectBoxOptionsType } from '../../surveyAddEdit'
import AddEditForm from './add-edit-form'

export const classes: HBAgGridClasses = {
  wrapper: {
    height: 300,
  },
}
type AffectedByProps = {
  effectivedInCodes: SelectBoxOptionsType
}

const AffectedBy = (props: AffectedByProps) => {
  const { effectivedInCodes } = props
  const router = useRouter()
  const { formatMessage } = useIntl()
  const surveyId = router.query.id?.[0] || ''
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/Influens/${surveyId}/GetAll`
  const gridRef = useRef<HBDataGridClientRef>(null)

  const [deleteInfluens] = useDeleteAdminGeneralDataInfluensByIdAndInfluensIdMutation()

  const [selectedRows, setSelectedRows] = useState<GetAllInfluensesQueryResult[]>([])
  const [isOpenAddEditDialog, setIsOpenAddEditDialog] = useState<{
    show: boolean
    data?: GetAllInfluensesQueryResult
  }>({
    show: false,
  })
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const {
    gridLoading,
    checkboxSelection,
    headerCheckboxSelection,
    affectedByGridColumns,
    handleChangedGridActions,
    refreshGridData,
  } = useAffectedByGrid(gridRef)

  const handleAdd = () => {
    setIsOpenAddEditDialog({ show: true })
  }
  const handleEdit = (props: GetAllInfluensesQueryResult) => {
    setIsOpenAddEditDialog({ show: true, data: props })
  }

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridActionColumn
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => handleEdit(props.data),
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
      ...affectedByGridColumns(),
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const handleDelete = useCallback(async () => {
    const ids = selectedRows.map((item) => item.id)
    for (const [index, id] of ids.entries()) {
      gridLoading(true)
      await deleteInfluens({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: surveyId,
        influensId: String(id),
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(surveyMessages.successfullyDeleted),
              type: 'success',
            })
          }
        })
        .finally(() => {
          setDeleteDialogState({ show: false })
          if (index === ids.length - 1) {
            gridLoading(false)
            refreshGridData(true)
          }
        })
    }
  }, [selectedRows, deleteDialogState])

  return (
    <Box sx={{ minHeight: 420 }}>
      <HBDataGridClient
        id="affectedBy-grid"
        actionUrl={actionUrl}
        onDoubleClick={(props) => handleEdit(props?.data)}
        columnDefs={columnDefs}
        classes={classes}
        pagination
        paginationPageSize={25}
        rowSelection={'multiple'}
        enableRtl
        sideBar
        detailRowAutoHeight
        ref={gridRef}
        onSelectedChanged={(chosenRows) => setSelectedRows(chosenRows)}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ onClick: handleAdd }}
            statusProps={{ show: false }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => handleEdit(selectedRows[0]),
            }}
            deleteProps={{
              disabled: selectedRows.length === 0,
              onClick: () => {
                setDeleteDialogState({ show: true })
              },
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            {...props}
          />
        )}
      />
      <HBDialog
        content={
          <AddEditForm
            influensData={isOpenAddEditDialog?.data}
            effectivedInCodes={effectivedInCodes}
            setIsOpenAddEditDialog={setIsOpenAddEditDialog}
            refreshGridData={refreshGridData}
          />
        }
        maxWidth={'sm'}
        fullWidth
        open={isOpenAddEditDialog.show}
        onClose={() => setIsOpenAddEditDialog({ show: false })}
        title={formatMessage(surveyMessages.affectedBy)}
      />
      <HBDialog
        content={formatMessage(surveyMessages.confirmationMessageDeletingAffectedBy, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(surveyMessages.confirmationTitleDeletingAffectedBy)}
        onAccept={handleDelete}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}
export default AffectedBy

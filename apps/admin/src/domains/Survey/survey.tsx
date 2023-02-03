import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import sideBarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetSurveyQueryResultApiResult,
  GetSurveysQueryResult,
  useDeleteAdminGeneralDataSurveyByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, openToast } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import useSurveyGrid from './hooks/useSurveyGrid'
import surveyMessages from './survey.messages'

export const classes: HBAgGridClasses = {
  wrapper: {
    height: `calc(100vh - 240px)`,
  },
}

const Survey = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const breadcrumbs = [
    { url: '/', title: formatMessage(sideBarMessages.dashboard) },
    { url: '#', title: formatMessage(sideBarMessages.survey) },
  ]

  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/Survey/GetAll`
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [deleteSurvey] = useDeleteAdminGeneralDataSurveyByIdMutation()

  const [selectedRows, setSelectedRows] = useState<GetSurveysQueryResult[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const {
    gridLoading,
    checkboxSelection,
    headerCheckboxSelection,
    surveyGridColumns,
    handleChangedGridActions,
    refreshGridData,
  } = useSurveyGrid(gridRef)

  const handleDeleteSurveys = useCallback(async () => {
    const ids = selectedRows.map((item) => item.id)
    for (const [index, id] of ids.entries()) {
      gridLoading(true)
      await deleteSurvey({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: String(id),
      })
        .unwrap()
        .then((res: GetSurveyQueryResultApiResult) => {
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
                  onClick: () => handleEditSurvey(props.data?.id),
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
      ...surveyGridColumns(),
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )

  const handleEditSurvey = (id: string) => {
    router.push(`/survey/edit/${id}`)
  }

  const handleAddSurvey = () => {
    router.push('/survey/add')
  }

  return (
    <>
      <HBDataGridClient
        id="survey-grid"
        actionUrl={actionUrl}
        onDoubleClick={(props) => handleEditSurvey(props?.data?.id)}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(sideBarMessages.survey)}
            breadItems={breadcrumbs}
          />
        }
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
            addProps={{ onClick: handleAddSurvey }}
            statusProps={{ show: false }}
            editProps={{
              disabled: selectedRows.length !== 1,
              onClick: () => handleEditSurvey(selectedRows[0]?.id || ''),
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
        content={formatMessage(surveyMessages.confirmationMessageDeleting, {
          msg: deleteDialogState?.id ? 1 : selectedRows.length,
        })}
        title={formatMessage(surveyMessages.confirmationTitleDeleting)}
        onAccept={handleDeleteSurveys}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
export default Survey

import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useDeleteAdminIdrOrganizationByIdMutation } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBAgGridClasses, HBDialog, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import companiesMessage from '../../companies.message'
import CreateGridToolbar from '../../components/CreateGridToolbar'
import { UsersSelectRowModel } from '../../types'
import useStatusOne from './useCompaniesGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 380,
  },
}

export type CompaniesGridProps = {
  onChangeCompanySelected?: (id?: string) => void
}

const CompaniesGrid: FC<CompaniesGridProps> = ({ onChangeCompanySelected }) => {
  const { formatMessage } = useIntl()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(companiesMessage.companiesTitle),
    },
  ]

  const router = useRouter()
  const id = router.query.id?.[0]

  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<UsersSelectRowModel[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })

  const [isEditOrAdd, setIsEditOrAdd] = useState(false)
  const [editId, setEditId] = useState<string>()

  const [deleteCompanyItem] = useDeleteAdminIdrOrganizationByIdMutation()

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
          { field: 'Title', operator: 'contains', value: String(value) },
          { field: 'OrganizationTypeTitle', operator: 'contains', value: String(value) },
          { field: 'NationalCode', operator: 'contains', value: String(value) },
          { field: 'PhoneNo', operator: 'contains', value: String(value) },
          { field: 'Email', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchCompany',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchCompany')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: UsersSelectRowModel[]) => {
    if (selectedRows.length === 1) {
      onChangeCompanySelected?.(selectedRows[0]?.id)
    } else {
      onChangeCompanySelected?.()
    }
    setSelectedRows(selectedRows)
  }

  const handleDelete = useCallback(async () => {
    const ids = selectedRows.map((item) => item.id)
    for (const id of ids) {
      await deleteCompanyItem({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: String(id),
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(companiesMessage.successfullyDeleted),
            type: 'success',
          })
        }
      })
    }
    refreshGridData()
    setDeleteDialogState({ show: false })
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: string) => {
    setDeleteDialogState({ show, id })
  }

  const handleEditItem = (id: string) => {
    router.push(`/companies/edit/${id}`)
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = useStatusOne({
    gridRef,
    selectedRows,
    onDelete,
    editId,
    attributeId: id!,
    onEditClick: handleEditItem,
  })

  const handleAddItem = () => {
    router.push(`/companies/add`)
  }

  const handleCancelClick = () => {
    setIsEditOrAdd(false)
    setEditId(undefined)
  }

  const handleSave = () => {
    refreshGridData(!editId)
    handleCancelClick()
  }

  return (
    <Box>
      <HBDataGridClient
        id="companies-page-grid"
        editUrl="/companies/edit/"
        classes={classes}
        actionUrl={actionUrl}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(companiesMessage.companiesTitle)}
            breadItems={breadcrumbs}
          />
        }
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        serverSideSortingAlwaysResets
        serverSideFilteringAlwaysResets
        ref={gridRef}
        onDoubleClick={(props) => handleEditItem(props?.data?.id)}
        GridToolbar={(props) => (
          <CreateGridToolbar<UsersSelectRowModel>
            selectedRows={selectedRows}
            handleSetDeleteDialogState={onDelete}
            onGridActionsChange={handleChangedGridActions}
            onRefreshClick={() => refreshGridData(true)}
            gridRef={gridRef}
            onCancelClick={handleCancelClick}
            onEditClick={handleEditItem}
            onAddClick={handleAddItem}
            isEditOrAdd={isEditOrAdd}
            {...props}
            toolbarOptions={{
              statusProps: { show: false },
            }}
          />
        )}
        {...{ columnDefs }}
        suppressRowClickSelection={isEditOrAdd}
      />
      <HBDialog
        content={formatMessage(companiesMessage.areYouSureAboutTheDelete, {
          count: String(deleteDialogState?.id ? 1 : selectedRows.length),
        })}
        title={formatMessage(companiesMessage.deleteCompany)}
        onAccept={handleDelete}
        onReject={() => setDeleteDialogState({ show: false })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false })}
        acceptBtn={formatMessage(phrasesMessages.delete)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </Box>
  )
}

export default CompaniesGrid

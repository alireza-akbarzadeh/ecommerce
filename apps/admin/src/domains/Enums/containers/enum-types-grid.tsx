import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import {
  GridFilterFieldType,
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC, useRef } from 'react'
import { useIntl } from 'react-intl'
import enumsMessage from '../enums.message'
import useEnumTypesGrid from '../hooks/useEnumTypesGrid'

const classes: HBAgGridClasses = {
  wrapper: {
    height: 390,
  },
}

type EnumTypesGridProps = {
  onChangeEnumSelected?: (id?: string) => void
}
const EnumTypesGrid: FC<EnumTypesGridProps> = ({ onChangeEnumSelected }) => {
  const { formatMessage } = useIntl()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '#',
      title: formatMessage(enumsMessage.enumsTitle),
    },
  ]

  const gridRef = useRef<HBDataGridClientRef>(null)
  const { actionUrl, autoGroupColumnDef, columnDefs } = useEnumTypesGrid({ gridRef })

  const handleChangedGridActions = (value: number | string, type: 'search') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Title', operator: 'contains', value: String(value) },
          { field: 'Name', operator: 'contains', value: String(value) },
          { field: 'Description', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchEnum',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchEnum')
      }
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current?.api.deselectAll()
  }

  const handleChangedSelectedRows = (selectedRows: GetBusinessTypeQueryResult[]) => {
    if (selectedRows.length === 1) {
      onChangeEnumSelected?.(selectedRows[0]?.id)
    } else {
      onChangeEnumSelected?.()
    }
  }

  return (
    <Box sx={{ height: 510 }}>
      <HBDataGridClient
        classes={classes}
        actionUrl={actionUrl}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(enumsMessage.enumsTitle)}
            breadItems={breadcrumbs}
          />
        }
        pagination
        paginationPageSize={8}
        rowSelection="multiple"
        enableRtl
        sideBar
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        serverSideSortingAlwaysResets
        serverSideFilteringAlwaysResets
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ show: false }}
            editProps={{ show: false }}
            deleteProps={{ show: false }}
            refreshProps={{
              onClick: refreshGridData,
            }}
            searchProps={{ show: true, openPosition: 'right' }}
            moreProps={{ show: true }}
            statusProps={{ show: false }}
            {...props}
          />
        )}
        {...{ columnDefs }}
      />
    </Box>
  )
}

export default EnumTypesGrid

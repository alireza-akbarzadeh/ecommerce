import HBGrid, {
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { SortType } from '@hasty-bazar/admin-shared/core/enums'
import { HBCheckBox, HBIconButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { CheckboxSelectionCallbackParams, RowDragEvent } from 'ag-grid-community'
import { Dispatch, RefObject, SetStateAction, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { collectionSortOptionListType } from '../../sort-option-add-edit-page'
import sortOptionMessages from '../../sort-option.messages'
import AddColumnField from './addColumnField'

type SortOptionGridsProp = {
  collectionSortOptionList: collectionSortOptionListType
  destinationGridRef: RefObject<HBDataGridClientRef>
  originGridRef: RefObject<HBDataGridClientRef>
  originList: any
  setCollectionSortOptionList: Dispatch<SetStateAction<collectionSortOptionListType>>
}

const SortOptionGrids = ({
  collectionSortOptionList,
  destinationGridRef,
  originGridRef,
  originList,
  setCollectionSortOptionList,
}: SortOptionGridsProp) => {
  const { formatMessage } = useIntl()
  const actionUrl = ''

  const checkboxSelection = (params: CheckboxSelectionCallbackParams) => {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const destinationColumnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 40,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        showRowGroup: true,
        rowDrag: true,
      },
      {
        suppressMenu: true,
        checkboxSelection: true,
        headerCheckboxSelection: checkboxSelection,
        sortable: false,
        maxWidth: 60,
      },
      {
        headerName: formatMessage(sortOptionMessages.originRow),
        valueGetter: 'node.rowIndex + 1',
        sortable: false,
        maxWidth: 80,
      },
      {
        field: 'title',
        headerName: formatMessage(sortOptionMessages.destinationTitle),
        suppressMenu: true,
        sortable: false,
        minWidth: 120,
      },
      {
        headerName: formatMessage(sortOptionMessages.descending),
        field: 'sortType',
        suppressMenu: false,
        checkboxSelection: false,
        sortable: false,
        cellRenderer: (props: any) => (
          <HBCheckBox
            size="small"
            id={props.data.collectionFieldId}
            value={props.data.sortType === SortType.descending}
            defaultChecked={props.data.sortType === SortType.descending}
            onChange={(e) => {
              const updatedList = [...collectionSortOptionList]
              updatedList[props.rowIndex].sortType = e.target.checked
                ? SortType.descending
                : SortType.ascending
              setCollectionSortOptionList(updatedList)
            }}
          />
        ),
      },
    ],
    [destinationGridRef.current?.api?.getRenderedNodes()?.length],
  )

  const originColumnDefs = useMemo(
    () => [
      {
        checkboxSelection: true,
        suppressMenu: true,
        sortable: false,
        headerCheckboxSelection: checkboxSelection,
        maxWidth: 40,
      },
      {
        headerName: formatMessage(sortOptionMessages.originRow),
        valueGetter: 'node.rowIndex + 1',
        suppressMenu: true,
        sortable: false,
        maxWidth: 65,
      },
      {
        field: 'title',
        headerName: formatMessage(sortOptionMessages.originTitle),
        suppressMenu: true,
        sortable: false,
        minWidth: 120,
      },
      {
        field: 'collectionTypeTitle',
        headerName: formatMessage(sortOptionMessages.relatedEntity),
        suppressMenu: true,
        sortable: false,
        minWidth: 120,
      },
    ],
    [],
  )

  const handleDragDestinationItems = () => {
    destinationGridRef.current?.api.refreshCells()
  }

  const createSortOptionConfig = () => {
    const selectedNodes = originGridRef.current?.api?.getSelectedNodes()
    if (!selectedNodes || selectedNodes?.length === 0) return
    const array = selectedNodes.map(
      (item: any, i: number) => ({ ...selectedNodes[i].data, sortType: SortType.ascending }),
      originGridRef.current?.api.removeItems(selectedNodes),
    )
    setCollectionSortOptionList((prev) => [...prev, ...array])
  }

  const deleteSortOptionConfig = () => {
    const selectedDestinationNodes = destinationGridRef.current?.api?.getSelectedNodes()
    if (!selectedDestinationNodes || selectedDestinationNodes?.length === 0) return
    selectedDestinationNodes.forEach((selected: any, i: number) => {
      originGridRef.current?.api?.addItems([selectedDestinationNodes[i].data])
      destinationGridRef.current?.api.removeItems(selectedDestinationNodes)
      setCollectionSortOptionList((prev) => {
        return prev.filter((item) => item.id !== selected?.data?.id)
      })
    })
  }

  return (
    <Stack direction="row" alignItems="center" spacing={2} mt={6}>
      <Box sx={{ width: '100%' }}>
        <Typography sx={{ mb: 2 }} variant="subtitle1">
          {formatMessage(sortOptionMessages.selectedTitle)}
        </Typography>
        <HBGrid
          actionUrl={actionUrl}
          columnDefs={destinationColumnDefs}
          rowModelType={'clientSide'}
          rowData={collectionSortOptionList}
          rowDragManaged={true}
          enableRtl
          rowSelection="multiple"
          ref={destinationGridRef}
          onRowDragEnd={handleDragDestinationItems}
          suppressRowClickSelection={true}
          onRowDragMove={(event: RowDragEvent) => {
            if (event.overIndex === -1) return
          }}
          noToolbar
          suppressMoveWhenRowDragging
        />
      </Box>
      <Stack spacing={2}>
        <HBIconButton
          icon="angleRight"
          sx={{
            backgroundColor: 'grey.200',
            color: 'text.primary',
          }}
          onClick={createSortOptionConfig}
        />
        <HBIconButton
          icon="angleLeft"
          sx={{
            backgroundColor: 'grey.200',
            color: 'text.primary',
          }}
          onClick={deleteSortOptionConfig}
        />
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="subtitle1"
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          {formatMessage(sortOptionMessages.availableOptionsTitle)}
          <AddColumnField />
        </Typography>
        <HBGrid
          actionUrl={actionUrl}
          columnDefs={originColumnDefs}
          rowModelType={'clientSide'}
          rowData={originList}
          enableRtl
          rowSelection="multiple"
          ref={originGridRef}
          noToolbar
        />
      </Box>
    </Stack>
  )
}
export default SortOptionGrids

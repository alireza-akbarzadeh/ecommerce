import { GridActionColumn, GridActionMenuProps, Status } from '@hasty-bazar/admin-shared/components'
import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBAgGridClasses, HBDataGrigToolbar, HBDialog, MenuItemProps } from '@hasty-bazar/core'
import { Box, Typography, useTheme } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import attributesPageMessages from '../Attributes.messages'
import { AttributeDetailDialog, IAttributeDetailSubjectForm } from '../components'
import { AttributeKindTypeCode } from './AttributesAddEditForm'
import { useAttributesGridActions } from './hooks/useAttributesGridActions'

export enum RoleStateEnum {
  Draft = 0,
  Sent = 1,
  Publish = 2,
  Block = 3,
}

interface AttributeDetailDataGridProps extends Partial<ICellRendererParams> {
  id?: string
  title?: string
  changeRoles?: () => void
  isList?: boolean
  attributeId?: string
  attributeType?: AttributeKindTypeCode
}
const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  return params.columnApi.getRowGroupColumns().length === 0
}

export type AttributeDetailDataProps = {
  id?: string
  value: string
  sortOrder?: number
  iconPath?: string
  isActive?: number
  attributeId?: string
  color?: string
}

const AttributeDetailDataGrid: FC<AttributeDetailDataGridProps> = ({
  id,
  title,
  changeRoles,
  isList,
  attributeId,
  attributeType,
  ...props
}) => {
  id = id || props?.data?.id

  const { formatMessage } = useIntl()
  const theme = useTheme()
  const [selectedRows, setSelectedRows] = useState<AttributeDetailDataProps[]>([])
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [openAttributeFormDialog, setOpenAttributeFormDialog] = useState<boolean>(false)
  const [updatedRow, setUpdatedRow] = useState<AttributeDetailDataProps | null>(null)

  const [openActive, setOpenActive] = useState(false)
  const [status, setStatus] = useState<boolean>()

  const selectRowByIdForUpdate = (id: string) => {
    gridRef.current!.api.forEachNode((node) => {
      node.setSelected(node.data.id === id)
      if (node.data.id === id) {
        setUpdatedRow(node.data)
      }
    })
  }

  const deselectRows = () => {
    gridRef.current?.api.deselectAll()
  }

  const cancelEdit = () => {
    setUpdatedRow(null)
    deselectRows()
    setOpenAttributeFormDialog(false)
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api?.deselectAll()
  }, [])

  const {
    addAttributeDetailValue,
    removeAttribute,
    updateAttributeDetailValue,
    gridColumns,
    gridMenuItems,
    changeActive,
  } = useAttributesGridActions({
    attributeId: attributeId!,
    refreshGridData,
    cancelEdit,
  })

  const getMenuItems = useCallback((props: ICellRendererParams) => {
    let items: GridActionMenuProps[] = gridMenuItems(
      selectRowByIdForUpdate,
      handleRemoveAttribute,
      props.data?.id,
    ) as GridActionMenuProps[]

    return items
  }, [])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <GridActionColumn {...props} menuItems={getMenuItems(props)} />
    },
    [selectedRows],
  )

  const columnDefs = useMemo<ColDef[]>(
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
        cellRenderer: GridActions,
        checkboxSelection,
        headerCheckboxSelection,
      },
      {
        field: 'value',
        headerName: formatMessage(attributesPageMessages.attributesColumnValue),
        minWidth: 120,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'iconPath',
        headerName: formatMessage(attributesPageMessages.attributesColumnIcon),
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: (props: any) => (
          <Box>
            {props?.value! ? (
              <img
                src={`${process.env.NEXT_PUBLIC_CDN}${props.value}`}
                alt=""
                style={{ width: 50, height: 50 }}
              />
            ) : (
              ''
            )}
          </Box>
        ),
      },
      {
        field: 'color',
        headerName: formatMessage(attributesPageMessages.attributesFieldColor),
        minWidth: 120,
        sortable: false,
        filter: false,
        cellRenderer: (props: any) => (
          <>
            {props?.value! ? (
              <Box
                sx={{
                  backgroundColor: props.value,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  margin: 'auto',
                }}
              />
            ) : (
              ''
            )}
          </>
        ),
      },
      {
        field: 'sortOrder',
        headerName: formatMessage(attributesPageMessages.attributesColumnDisplayOrder),
        minWidth: 150,
      },
      {
        field: 'isActive',
        headerName: formatMessage(attributesPageMessages.attributesColumnStatus),
        filter: 'agNumberColumnFilter',
        maxWidth: 150,
        minWidth: 150,
        cellRenderer: Status,
        cellRendererParams: {
          active: formatMessage(phrasesMessages.active),
          inActive: formatMessage(phrasesMessages.deActive),
        },
      },
    ],
    [],
  )

  const classes: HBAgGridClasses = {
    wrapper: {
      backgroundColor: `${theme.palette.common.white} !important`,
      height: 300,
      '& .ag-layout-normal .ag-header': {
        backgroundColor: `${theme.palette.grey[100]} !important`,
        border: 'unset',
      },
      '&>div:last-child': {
        padding: theme.spacing(3),
        borderRadius: 2,
        backgroundColor: theme.palette.grey[100],
      },
      '& div.ag-root-wrapper': {
        border: 'unset',
      },
    },
  }

  const handleAddAttributeValue = () => {
    setOpenAttributeFormDialog(true)
  }

  const handleUpdateAttributeValue = () => {
    setUpdatedRow(selectedRows[0])
  }

  const handleSubmitAttributeValue = (values: IAttributeDetailSubjectForm) => {
    if (values.id) {
      updateAttributeDetailValue(values)
    } else {
      addAttributeDetailValue(values)
    }
  }

  const handleRemoveAttribute = async (id?: string) => {
    const delIds = id && typeof id === 'string' ? [id] : selectedRows?.map((item) => item.id)
    if (delIds.length < 1) return
    for (let id of delIds) {
      await removeAttribute(id)
    }
  }

  const handleChangedSelectedRows = (selectedRows: AttributeDetailDataProps[]) => {
    setSelectedRows(selectedRows)
  }

  const isRowSelectable = useCallback((rowNode: any) => {
    return rowNode.data ? !rowNode.data.isAdd : true
  }, [])

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const handleChangeStatus = (status: boolean) => {
    setStatus(status)
    setOpenActive(true)
  }

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
        onClick: () => handleChangeStatus(true),
        show: !disabledActive,
      },
      {
        label: formatMessage(phrasesMessages.deActive),
        icon: 'toggleOff',
        disabled: disabledOnNoSelected || disabledUnActive,
        onClick: () => handleChangeStatus(false),
        show: !disabledUnActive,
      },
    ]
  }, [selectedRows])

  const handleChangeActive = useCallback(async () => {
    const selectedRows = gridRef.current!.api.getSelectedRows()
    await changeActive(selectedRows, status!)

    refreshGridData()
    setOpenActive(false)
  }, [status])

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? value : null,
        })
    } else if (type === 'search') {
      let filterFirstComponent = gridRef.current!.api.getFilterInstance('value')
      filterFirstComponent &&
        filterFirstComponent.setModel({
          type: 'contains',
          filter: value ?? null,
        })
    }
    gridRef.current!.api.onFilterChanged()
  }

  return (
    <Box sx={{ height: 362 }}>
      <HBDataGridClient
        id="attributes-detail-grid"
        actionUrl={
          attributeId && isList
            ? `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Catalog/api/AttributeValue/GetAll?AttributeId=${attributeId}`
            : ''
        }
        rightHeader={
          <Typography variant="h6" color="text.primary">
            {title}
          </Typography>
        }
        columnDefs={columnDefs}
        isRowSelectable={isRowSelectable}
        rowSelection="multiple"
        ref={gridRef}
        enableRtl
        classes={classes}
        onSelectedChanged={handleChangedSelectedRows}
        onDoubleClick={handleUpdateAttributeValue}
        paginationPageSize={25}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            statusProps={{
              disabled: !isList,
              show: true,
            }}
            addProps={{
              disabled: toolbarStatus.disabledOnSelected || !isList,
              onClick: handleAddAttributeValue,
            }}
            deleteProps={{
              disabled: toolbarStatus.disabledOnNoSelected || !isList,
              onClick: handleRemoveAttribute,
            }}
            editProps={{
              disabled: !toolbarStatus.disabledOnSelected || !isList || selectedRows.length !== 1,
              onClick: handleUpdateAttributeValue,
            }}
            moreProps={{
              disabled: !isList,
            }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            searchProps={{ inputWidth: 114, show: true, disabled: !isList }}
            onChange={handleChangedGridActions}
            items={toolbarMoreItems}
            {...props}
          />
        )}
      />

      <AttributeDetailDialog
        open={openAttributeFormDialog || !!updatedRow}
        onClose={() => {
          setOpenAttributeFormDialog(false)
          cancelEdit()
        }}
        updatedValue={updatedRow}
        onSubmit={handleSubmitAttributeValue}
        attributeType={attributeType}
      />

      <HBDialog
        content={formatMessage(attributesPageMessages.attributeChangeStateConfirm, {
          changeCount: selectedRows.length,
        })}
        title={formatMessage(attributesPageMessages.attributesChangeStateValues)}
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

export default AttributeDetailDataGrid

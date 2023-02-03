import {
  HBDataGridClient,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import {
  PaginatedGetByFilterQueryResult,
  usePostAdminAuditEntitiesNestedMutation,
} from '@hasty-bazar/admin-shared/services/auditApi.generated'
import {
  TableProperties,
  usePostAdminGeneralDataTablesGetColumnsByFilterMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  HBAgGridClasses,
  HBAutoComplete,
  HBCheckBox,
  HBDataGrigToolbar,
  HBIcon,
} from '@hasty-bazar/core'
import {
  Box,
  inputLabelClasses,
  outlinedInputClasses,
  styled,
  TextField,
  textFieldClasses,
  Typography,
} from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { format } from 'date-fns-jalali'
import { isEmpty } from 'ramda'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import ModalContentDetail from './modalContentDetail'
import RecordChangeHistoryMessages from './recordChangeHistory.messages'

const classes: HBAgGridClasses = {
  wrapper: {
    mt: 6,
    height: `calc(100vh - 240px)`,
  },
}

type ModalContentProps = {
  id: string
  onClose: VoidFunction
  type: string
}

const HBTextField = styled(TextField)(({ theme }) => ({
  [`&.${textFieldClasses.root}`]: {
    [`& .${outlinedInputClasses.root}`]: {
      '& fieldset': {
        borderLeft: 1,
        borderTop: 1,
        borderRight: 1,

        borderRadius: 0,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}))

export default function ModalContent({ id, onClose, type }: ModalContentProps) {
  const [fields, setFields] = useState<any[]>([])
  const [tableData, setTableData] = useState<PaginatedGetByFilterQueryResult[]>([])
  const [tableFilters, setTableFilters] = useState<TableProperties[]>([])
  const [searchValue, setSearchValue] = useState<string>('')

  const [postNestedMutation, { isLoading: postNestedMutationIsLoading }] =
    usePostAdminAuditEntitiesNestedMutation()

  useEffect(() => {
    const postNested = async () => {
      const { data } = await postNestedMutation({
        'client-name': 'Swagger on HIT.Hastim.Audit.Endpoints.AdminApi',
        'client-version': '1.0.0.0',
        paginatedGetByFilterQueryFilter: {
          entityId: id,
          filter: searchValue ? searchValue : '',
          ordering: 'Id desc',
          pageSize: 1000,
          selectedFields: !fields.length
            ? []
            : [
                ...fields?.map(({ tableName, schema, value }) => ({
                  tableName,
                  tableSchema: schema,
                  propertyName: value,
                })),
              ],
        },
      }).unwrap()

      setTableData(data?.items || [])
    }

    postNested()
  }, [fields, searchValue])
  const [getFilterMutation, { isLoading: getFilterMutationIsLoading }] =
    usePostAdminGeneralDataTablesGetColumnsByFilterMutation()

  useEffect(() => {
    const getFilter = async () => {
      const { data } = await getFilterMutation({
        'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
        'client-version': '1.0.1.100',
        tablesFilter: {
          relatedTables: [
            {
              name: 'product',
              schema: 'catalog',
            },
            {
              name: 'productpricing',
              schema: 'catalog',
            },
          ],
        },
      }).unwrap()

      setTableFilters(data?.tableProperties || [])
    }

    getFilter()
  }, [])

  const tableFiltersColumns = useMemo(() => {
    if (!isEmpty(tableFilters)) {
      let refactoredTableFilters: {
        title: string
        value: string
        schema: string
        tableName: string
      }[] = []

      tableFilters?.forEach((itemWrapper) => {
        return itemWrapper?.properties?.map((item) => {
          refactoredTableFilters?.push({
            title: item?.localName ? item?.localName : item?.name || '',
            value: item?.name || '',
            schema: itemWrapper?.schema || '',
            tableName: itemWrapper?.tableName || '',
          })
        })
      })

      return refactoredTableFilters
    }
    return []
  }, [tableFilters])

  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)

  const JALALI_DATE_FORMAT = 'yyyy-MM-dd'
  const JALALI_HOUR_FORMAT = 'HH:mm:ss'

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 60,
        minWidth: 60,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: () => {},
        },
      },
      {
        field: 'number',
        headerName: formatMessage(RecordChangeHistoryMessages.record),
      },
      {
        field: 'localAuditType',
        headerName: formatMessage(RecordChangeHistoryMessages.operation),
      },
      {
        field: 'username',
        headerName: formatMessage(RecordChangeHistoryMessages.username),
      },
      {
        field: 'changeDate',
        headerName: formatMessage(RecordChangeHistoryMessages.changeDate),
        cellRenderer: (params: ICellRendererParams) =>
          format(new Date(params?.value), JALALI_DATE_FORMAT),
      },
      {
        field: 'changeHour',
        headerName: formatMessage(RecordChangeHistoryMessages.changeHour),
        cellRenderer: (params: ICellRendererParams) =>
          format(new Date(params?.value), JALALI_HOUR_FORMAT),
      },
      {
        field: 'gateway',
        headerName: formatMessage(RecordChangeHistoryMessages.gateway),
      },
      {
        field: 'userIp',
        headerName: formatMessage(RecordChangeHistoryMessages.userIp),
      },
    ],
    [],
  )

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      setSearchValue(value as string)
    }
  }

  useEffect(() => {
    if (!getFilterMutationIsLoading && !postNestedMutationIsLoading) {
      gridRef.current?.api?.hideOverlay()
    } else {
      gridRef.current?.api?.showLoadingOverlay()
    }
  }, [getFilterMutationIsLoading, postNestedMutationIsLoading])

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 4,
        maxHeight: '90vh',
        overflow: 'auto',
        p: 6,
        pb: 36,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          {formatMessage(RecordChangeHistoryMessages.seeDetails)}
        </Typography>

        <Box sx={{ cursor: 'pointer' }} onClick={onClose}>
          <HBIcon type="times" />
        </Box>
      </Box>
      <HBDataGridClient
        actionUrl=""
        columnDefs={columnDefs}
        rowData={
          tableData?.length
            ? [
                ...tableData?.map((item) => ({
                  ...item,
                  _actions: item?.trackingId?.toString(),
                  username: item?.environment?.username,
                  changeDate: item?.auditDate,
                  changeHour: item?.auditDate,
                  gateway: item?.environment?.platform,
                  userIp: item?.environment?.userIp,
                })),
              ]
            : []
        }
        totalRows={tableData.length}
        pagination
        paginationPageSize={10}
        paginationOptions={{ hideselectPage: true }}
        enableRtl
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        masterDetail
        detailCellRenderer={ModalContentDetail}
        detailRowAutoHeight
        detailCellRendererParams={{ title: formatMessage(RecordChangeHistoryMessages.seeMore) }}
        ref={gridRef}
        GridToolbar={() => (
          <HBDataGrigToolbar
            onChange={handleChangedGridActions}
            addProps={{ show: false }}
            deleteProps={{
              show: false,
            }}
            editProps={{ show: false }}
            refreshProps={{ show: false }}
            moreProps={{ show: false }}
            statusProps={{ show: false }}
            searchProps={{
              show: true,
              defaultShow: true,
              openPosition: 'right',
              toggleShow: false,
              inputWidth: 200,
            }}
          >
            <Box sx={{ mr: 44 }}>
              <HBAutoComplete
                value={fields}
                multiple
                onChange={(event, newValue) => {
                  setFields(newValue)
                }}
                options={tableFiltersColumns! || [{ title: '', value: '' }]}
                getOptionLabel={(option: any) => option.title || ''}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <HBCheckBox checked={selected} />
                    <Typography variant="caption">{option?.title}</Typography>
                  </li>
                )}
                renderInput={(params) => (
                  <HBTextField
                    {...params}
                    label={formatMessage(RecordChangeHistoryMessages.fieldFilter)}
                    sx={{
                      height: 33,
                      minWidth: 250,
                      [`& .${inputLabelClasses.root}`]: {
                        top: -4,
                      },
                      [`& .${outlinedInputClasses.root}`]: {
                        height: 33,
                      },
                      [`& .${outlinedInputClasses.input}`]: {
                        position: 'relative',
                        top: -4,
                      },
                    }}
                  />
                )}
                size="small"
                disabled={false}
              />
            </Box>
          </HBDataGrigToolbar>
        )}
      />
    </Box>
  )
}

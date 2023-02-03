import { usePostAdminAuditEntitiesNestedMutation } from '@hasty-bazar/admin-shared/services/auditApi.generated'
import { useGetAdminGeneralDataTablesGetColumnsByCodeByCodeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBDialog, HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { GridChangeRecordHistory } from './containers/ChangeRecordHistoryGrid'
import ModalSearch from './containers/ModalSearch'
import changeRecordHistoryMessages from './HBChangeRecordHistory.messages'
import { ChangeRecordHistoryRowsType } from './types'
import useHBChangeRecordHistory, { ColumnType } from './useHBChangeRecordHistory'

export type HBChangeRecordHistoryProps = {
  entityId?: string
  tableName?: string
  open: boolean
  onClose?: () => void
  title?: string
}

export type ModalFilterType = {
  search?: string
  filterColumn?: ColumnType[]
}

export type gridType = {
  PageNumber: number
  PageSize: number
  Ordering: string
  Filter: string
}

export default function HBChangeRecordHistory({
  entityId,
  tableName,
  open,
  onClose,
  title,
}: HBChangeRecordHistoryProps) {
  const { changeDataTree } = useHBChangeRecordHistory()
  const { formatMessage } = useIntl()
  const formProvider = useForm<ModalFilterType>({
    mode: 'all',
  })
  const [filterTypeValue, setFilterTypeValue] = useState<ModalFilterType | undefined>()
  const [loadData] = usePostAdminAuditEntitiesNestedMutation()
  const [gridData, setGridData] = useState<ChangeRecordHistoryRowsType[]>([])
  const [totalRows, setTotalRows] = useState(0)

  useEffect(() => {
    formProvider.reset({})
  }, [open])

  const { data: { data: { tablesColumnsSections = [] } = {} } = {} } =
    useGetAdminGeneralDataTablesGetColumnsByCodeByCodeQuery(
      {
        'client-name': 'vendor',
        'client-version': '1.0.0',
        code: tableName!,
      },
      { skip: !tableName || !open, refetchOnFocus: true, refetchOnMountOrArgChange: true },
    )

  const columns = changeDataTree(tablesColumnsSections || [])

  const handleSearch = (data: ModalFilterType) => {
    setFilterTypeValue(data)
    handleLoadData(null, data)
  }

  const handleLoadData = (params?: gridType | null, data?: ModalFilterType) => {
    data = data || filterTypeValue
    loadData({
      'client-name': 'vendor',
      'client-version': '1.0.0',
      paginatedGetByFilterQueryFilter: {
        entityId,
        filter: data?.search,
        pageNumber: params?.PageNumber || 1,
        pageSize: params?.PageSize || 25,
        ordering: params?.Ordering || undefined,
        selectedFields: data?.filterColumn?.map((item) => {
          return {
            propertyName: item.propertyName,
            tableName: item.tableName,
            tableSchema: item.tableSchema,
          }
        }),
      },
    })
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          setTotalRows(res?.data?.totalItems)
          setGridData(
            (res?.data?.items?.map((item: ChangeRecordHistoryRowsType) => ({
              _actions: item?.id,
              ...item,
            })) as ChangeRecordHistoryRowsType[]) || [],
          )
        } else {
          setTotalRows(0)
          setGridData([])
        }
      })
  }

  return (
    <HBDialog
      open={open!}
      onClose={onClose}
      onReject={onClose}
      title={title || formatMessage(changeRecordHistoryMessages.modalTitle)}
      PaperProps={{ sx: { width: { md: 1200, xs: 900 }, maxWidth: { md: 1200, xs: 700 } } }}
    >
      <Box height={630} mt={4}>
        <HBForm onSubmit={handleSearch} formProviderProps={formProvider}>
          <ModalSearch columns={columns} formProvider={formProvider} handleSearch={handleSearch} />
          <GridChangeRecordHistory
            data={gridData}
            onGridReady={handleLoadData}
            totalRows={totalRows}
          />
        </HBForm>
      </Box>
    </HBDialog>
  )
}

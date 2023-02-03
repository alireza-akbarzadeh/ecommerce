import HBGrid, {
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { CollectionType } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAgGridClasses, HBDataGrigToolbar } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import collectionPageMessages from '../CollectionPage.messages'

export interface CollectionQueryResultProps {
  collectionType?: CollectionType | undefined
  formProviderProps?: UseFormReturn<any, any>
  gridColumn: { name: string; title: string; isShow: boolean; type: string }[] | undefined
  refreshQueryResult?: string
  id: string | undefined
}

const classes: HBAgGridClasses = {
  wrapper: {
    height: 400,
  },
}

const CollectionQueryResult: FC<CollectionQueryResultProps> = ({
  gridColumn,
  refreshQueryResult,
  id,
}) => {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/GeneralData/Collection/result/pageable?id=${id}`

  const toCamelCase = (str: string) => {
    let f = str.replace(/(?<=\.)[A-Z]/gm, function ($2) {
      return $2.toLowerCase()
    })
    return f.charAt(0).toLowerCase() + f.slice(1)
  }

  const columnDefs = useMemo(
    () =>
      gridColumn?.map((item) => {
        return {
          field: toCamelCase(item.name),
          headerName: item.title,
          minWidth: 100,
          hide: !item.isShow,
          cellRenderer: (params: ICellRendererParams) => {
            switch (item.type) {
              case 'Date':
                return (
                  <>
                    {params?.value
                      ? new Date(params?.value).toLocaleDateString('fa-IR', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                        })
                      : '-'}
                  </>
                )
              case 'Logical':
                return (
                  <>
                    {params?.value
                      ? formatMessage(collectionPageMessages.yes)
                      : formatMessage(collectionPageMessages.no)}
                  </>
                )
              case 'Decimal':
                return <>{params?.value ? params?.value.toLocaleString() : '-'}</>
              default:
                return <>{params?.value}</>
            }
          },
        }
      }),
    [gridColumn],
  )

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef.current?.refreshGridData(isClearSearch)
    gridRef.current!.api?.deselectAll()
  }, [])

  useEffect(() => {
    if (refreshQueryResult) {
      refreshGridData()
    }
  }, [refreshQueryResult])

  return (
    <Box sx={{ height: 500 }}>
      <HBGrid
        actionUrl={actionUrl}
        columnDefs={columnDefs}
        pagination
        paginationPageSize={25}
        cacheBlockSize={25}
        rowModelType={'serverSide'}
        serverSideStoreType={'partial'}
        enableRtl
        sideBar
        classes={classes}
        autoGroupColumnDef={autoGroupColumnDef}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <HBDataGrigToolbar
            statusProps={{ show: false }}
            addProps={{ show: false }}
            deleteProps={{ show: false }}
            editProps={{ show: false }}
            refreshProps={{ onClick: () => refreshGridData(true) }}
            searchProps={{ show: false }}
            moreProps={{ show: false }}
            {...props}
          />
        )}
      />
    </Box>
  )
}

export default CollectionQueryResult

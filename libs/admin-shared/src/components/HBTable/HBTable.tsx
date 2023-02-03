import {
  Checkbox,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { CSSProperties, ReactElement, ReactNode, useState } from 'react'
import { useIntl } from 'react-intl'
import EmptyIsLoadingComponent from './EmptyIsLoadingComponent'
import HBTableMessages from './HBTable.messages'

const PREFIX_CLASSES = 'HBDataGrid'
export const HBDataGridClasses = {
  root: `${PREFIX_CLASSES}-root`,
  tableHeader: `${PREFIX_CLASSES}-tableHeader`,
  tableRow: `${PREFIX_CLASSES}-iconButton`,
  tableCell: `${PREFIX_CLASSES}-tableCell`,
  th: `${PREFIX_CLASSES}-th`,
}
export interface TheadType<T> {
  title: string
  key: keyof T | string
  style?: CSSProperties
  className?: string
  render?: (param: string, rowData: T) => ReactElement | string
}
export interface TableState<T> {
  allSelected: boolean
  selectedCount: number
  selectedRows: T[]
}
export interface TableProps<T> {
  columns: TheadType<T>[]
  data: Array<T>
  keyExtractor: (item: T) => string
  selectableRows?: boolean
  isLoading?: boolean
  onSelectedRowsChange?: (data: TableState<T>) => void
  isLoadingComponent?: ReactNode
  recordsNotFoundComponent?: ReactNode
}
const HBDataGridRoot = styled(Table)(({ theme }) => ({
  [`& .${HBDataGridClasses.tableHeader}`]: {},
  [`& .${HBDataGridClasses.tableRow}`]: {},
  [`& .${HBDataGridClasses.tableCell}`]: {},
}))

function HBTable<T extends object = any>({
  data,
  keyExtractor,
  columns,
  isLoading,
  selectableRows,
  onSelectedRowsChange,
  isLoadingComponent,
  recordsNotFoundComponent,
}: TableProps<T>): JSX.Element {
  const { formatMessage } = useIntl()

  isLoadingComponent = isLoadingComponent || (
    <EmptyIsLoadingComponent text={formatMessage(HBTableMessages.isLoadingText)} />
  )

  recordsNotFoundComponent = recordsNotFoundComponent || (
    <EmptyIsLoadingComponent text={formatMessage(HBTableMessages.recordsNotFoundText)} />
  )

  const [tableStates, setTableState] = useState<TableState<T>>({
    allSelected: false,
    selectedCount: 0,
    selectedRows: [],
  })

  const handleCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowData: T | any,
    index: number,
  ) => {
    if (event.target.checked) {
      const selectedRows = [...tableStates.selectedRows, rowData]
      const newTableStates = {
        allSelected: data.length === selectedRows.length,
        selectedCount: selectedRows.length + 1,
        selectedRows,
      }
      setTableState(newTableStates)
      onSelectedRowsChange?.(newTableStates)
    } else {
      const newTableState = {
        allSelected: false,
        selectedCount: tableStates.selectedRows.length + 1,
        selectedRows: tableStates.selectedRows.filter(
          (item) => keyExtractor(item) !== keyExtractor(rowData),
        ),
      }
      setTableState(newTableState)
      onSelectedRowsChange?.(newTableState)
    }
  }
  const handleCheckedAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newTableState = {
        allSelected: true,
        selectedCount: data.length + 1,
        selectedRows: data,
      }
      setTableState(newTableState)
      onSelectedRowsChange?.(newTableState)
    } else {
      const newTableState = {
        allSelected: false,
        selectedCount: 0,
        selectedRows: [],
      }
      onSelectedRowsChange?.(newTableState)
      setTableState(newTableState)
    }
  }

  return (
    <HBDataGridRoot className={HBDataGridClasses.root}>
      <TableHead className={HBDataGridClasses.tableHeader}>
        {selectableRows && (
          <TableCell
            sx={{ p: 0, width: 'min-content' }}
            data-title={'checkbox'}
            className={HBDataGridClasses.th}
          >
            <Stack
              sx={{
                width: 'min-content',
              }}
            >
              <Checkbox
                indeterminate={tableStates.selectedRows.length !== 0 && !tableStates.allSelected}
                onChange={handleCheckedAllChange}
                checked={tableStates.allSelected && data.length !== 0}
              />
            </Stack>
          </TableCell>
        )}
        {columns.map((th) => (
          <TableCell
            data-title={th.title}
            className={HBDataGridClasses.th}
            key={th.key as unknown as string}
          >
            <Stack style={th.style}>{th.title}</Stack>
          </TableCell>
        ))}
      </TableHead>
      <TableBody>
        {isLoading ? (
          <TableRow className={HBDataGridClasses.tableRow}>
            <TableCell colSpan={columns.length + 1}>{isLoadingComponent}</TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow className={HBDataGridClasses.tableRow}>
            <TableCell colSpan={columns.length + 1}>{recordsNotFoundComponent}</TableCell>
          </TableRow>
        ) : (
          data.map((tb: any, index) => {
            return (
              <TableRow className={HBDataGridClasses.tableRow} key={keyExtractor(tb)}>
                {selectableRows && (
                  <TableCell
                    sx={{ p: 0, width: 'min-content' }}
                    data-title={'checkBox'}
                    key={'checkbox'}
                  >
                    <Stack
                      sx={{
                        width: 'min-content',
                      }}
                      className={HBDataGridClasses.tableCell}
                    >
                      <Checkbox
                        name={`select-row-${index}`}
                        onChange={(event) => handleCheckBoxChange(event, tb, index)}
                        checked={
                          !!tableStates.selectedRows.find(
                            (tableRow) => keyExtractor(tableRow) === keyExtractor(tb),
                          )
                        }
                      />
                    </Stack>
                  </TableCell>
                )}
                {columns.map((th) => {
                  return (
                    <TableCell data-title={th.title} key={th.key as unknown as string}>
                      <Stack className={HBDataGridClasses.tableCell} style={th.style}>
                        {th.render ? th.render(tb[th.key], tb) : tb[th.key]}
                      </Stack>
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })
        )}
      </TableBody>
    </HBDataGridRoot>
  )
}

export default HBTable

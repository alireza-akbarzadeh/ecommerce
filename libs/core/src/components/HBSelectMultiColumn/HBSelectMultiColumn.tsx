import {
  AutocompleteInputChangeReason,
  Box,
  Chip,
  debounce,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { SxProps, Theme, useTheme } from '@mui/material/styles'
import {
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { getElementOffset } from '../../utils'
import { HBAutoComplete, HBAutocompleteProps } from '../HBAutoComplete'
import { HBTextField, HBTextFieldProps } from '../HBTextField'
import ListBox from './component/ListBox'

export type HBSelectMultiColumnColumnDefs<T> = {
  field: string
  width: number | string
  headerName: string
  showInChip?: boolean
  hidden?: boolean
  cellRenderer?: (params: T) => ReactNode
  isIdField?: boolean
}

const HBSelectMultiColumnPrefix = 'HBSelectMultiColumn'

export type HBSelectMultiColumnProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> = Omit<
  HBAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  'css' | 'ref' | 'options' | 'renderInput'
> & {
  renderInputProps?: HBTextFieldProps
  columnDefs: HBSelectMultiColumnColumnDefs<T>[]
  label: string
  items: T[]
  totalItems: number
  pageSize?: number
  rowHeight?: number
  height?: number
  loadNextPage?: VoidFunction
  placeholder?: string
  error?: boolean
  errorMessage?: boolean
  disabled?: boolean
  onOpenClose?: (value: boolean) => void
}

const CHECKBOX_WIDTH = 40
const HORIZONTAL_PADDING = 32

const HBSelectMultiColumn = forwardRef(
  <
    T extends HTMLInputElement,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
  >(
    {
      disableClearable = true,
      ...props
    }: HBSelectMultiColumnProps<T, Multiple, DisableClearable, FreeSolo>,
    ref?: Ref<any>,
  ) => {
    const {
      columnDefs = [],
      label,
      loadNextPage,
      totalItems,
      pageSize,
      items,
      rowHeight,
      height,
      onInputChange,
      placeholder,
      renderInputProps,
      errorMessage,
      disabled,
      onOpenClose,
      ...otherProps
    } = props

    const [dataList, setDataList] = useState<T[]>([])
    const [options, setOptions] = useState<T[]>([])
    const [scrollToIndex, setScrollToIndex] = useState<number>(0)
    const [inputValue, setInputValue] = useState<string>('')
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true)
    const idField = columnDefs.filter((col) => col.isIdField)[0]?.field
    const { palette } = useTheme()
    const debouncedHandleSearch = useCallback(debounce(onInputChange!, 500), [])
    const paperRef = useRef<HTMLDivElement>(null)
    const autoRef = useRef<HTMLFormElement>(null)
    const breakpointMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
    const getItemsWithoutValue = (dataItams: T[]) => {
      const itemsWithoutValue = dataItams.filter((item) =>
        props?.value
          ? //@ts-ignore//
            props?.value?.findIndex((data) => data[idField] === item[idField]) === -1
          : true,
      )
      return itemsWithoutValue
    }

    useEffect(() => {
      if (props.multiple && !isFirstLoad) {
        const tempItems = getItemsWithoutValue(dataList)
        const values = props?.value! || []
        //@ts-ignore//
        tempItems.length > 0 && setOptions([...values, ...tempItems])
      }
    }, [props.value])

    const handleInputChange = (
      event: React.SyntheticEvent<Element, Event>,
      value: string,
      reason: AutocompleteInputChangeReason,
    ) => {
      if (value) {
        setInputValue(value)
        debouncedHandleSearch(event, value, reason)
      }
      if (reason === 'clear') {
        setInputValue('')
        debouncedHandleSearch(event, '', reason)
      }
    }

    const ListboxComponent = forwardRef(function ListboxComponent(props: any, ref: Ref<any>) {
      return (
        <ListBox
          columnDefs={columnDefs}
          items={items}
          pageSize={pageSize}
          totalItems={totalItems}
          loadNextPage={loadNextPage}
          rowHeight={rowHeight}
          height={height}
          inputValue={inputValue}
          setScrollToIndex={setScrollToIndex}
          scrollToIndex={scrollToIndex}
          value={otherProps.value}
          multiple={otherProps.multiple}
          ref={ref}
          {...props}
        />
      )
    })
    return (
      <HBAutoComplete
        ref={autoRef}
        disableListWrap
        ListboxComponent={ListboxComponent}
        options={items}
        getOptionLabel={(option: any) => {
          let label = ''
          columnDefs
            .filter((item) => item.showInChip || (item.isIdField && props.multiple))
            .map((item) => {
              label += option[item.field] ? `${option[item.field]} ` : ''
            })
          return label || ''
        }}
        isOptionEqualToValue={(option: any, value: any) => option[idField] === value[idField]}
        renderInput={(params) => (
          <HBTextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={!!props.error}
            {...renderInputProps}
            helperText={props.error && errorMessage}
          />
        )}
        onInputChange={handleInputChange}
        onKeyDown={(event) => {
          if ((event.key === 'Backspace' || event.key === 'Delete') && inputValue.length === 1) {
            setInputValue('')
            //@ts-ignore//
            debouncedHandleSearch(null, '', null)
          }
        }}
        inputValue={inputValue ?? ''}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option: any, index) => {
            let label = ''
            columnDefs
              .filter((item) => item.showInChip)
              .map((item) => {
                label += `${option[item.field]} `
              })
            return (
              <Chip
                label={label}
                sx={{ backgroundColor: palette.primary.light }}
                {...getTagProps({ index })}
              />
            )
          })
        }
        PaperComponent={({ children, ...other }) => {
          const [leftPosition, setLeftPosition] = useState<number>(0)
          const columnWidths =
            Number(
              columnDefs
                .filter((column) => !column.isIdField)
                .map((column) => column.width)
                .reduce((a, b) => Number(a) + Number(b)) || 0,
            ) +
            HORIZONTAL_PADDING +
            (props.multiple ? CHECKBOX_WIDTH : 0)

          useLayoutEffect(() => {
            const clientWidth = autoRef?.current?.clientWidth ?? 0
            const left = getElementOffset(autoRef?.current!).left ?? 0
            if (left + clientWidth < columnWidths) {
              setLeftPosition(clientWidth - columnWidths)
            }
          }, [])

          const paperSx: SxProps<Theme> =
            leftPosition && breakpointMdUp
              ? {
                  width: columnWidths,
                  left: leftPosition,
                  position: 'absolute',
                }
              : { width: breakpointMdUp ? columnWidths : '100%' }

          return (
            <Paper {...other} sx={paperSx} ref={paperRef}>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  pl: !breakpointMdUp
                    ? HORIZONTAL_PADDING / 4 + (props.multiple ? CHECKBOX_WIDTH / 4 : 0)
                    : 0,
                  background: palette.grey[400],
                  borderBottom: `1px solid ${palette.grey[600]}`,
                }}
              >
                <Box
                  sx={{
                    width: HORIZONTAL_PADDING + (props.multiple ? CHECKBOX_WIDTH : 0),
                    background: palette.grey[400],
                    borderBottom: `1px solid ${palette.grey[600]}`,
                  }}
                />

                {columnDefs
                  .filter((col) => !col.hidden)
                  .map((col: HBSelectMultiColumnColumnDefs<T>) => {
                    return (
                      <Typography
                        component="span"
                        sx={{
                          p: 2,
                          width: col.width,
                          minWidth: col.width,
                          display: 'flex',
                          background: palette.grey[400],
                          borderBottom: `1px solid ${palette.grey[600]}`,
                        }}
                        key={col.field}
                      >
                        {col.headerName}
                      </Typography>
                    )
                  })}
              </Box>
              {children}
            </Paper>
          )
        }}
        disableCloseOnSelect={otherProps.multiple}
        disabled={disabled}
        {...otherProps}
        onClose={(event, reason) => {
          onOpenClose?.(false)
        }}
        onOpen={(event) => {
          onOpenClose?.(true)
        }}
      />
    )
  },
)

HBSelectMultiColumn.displayName = 'HBSelectMultiColumn'
HBSelectMultiColumn.defaultProps = {
  limitTags: 2,
  pageSize: 40,
  onInputChange: () => {},
}

export default HBSelectMultiColumn as <
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>(
  props: HBSelectMultiColumnProps<T, Multiple, DisableClearable, FreeSolo> & {
    ref?: Ref<HTMLFormElement>
  },
) => JSX.Element

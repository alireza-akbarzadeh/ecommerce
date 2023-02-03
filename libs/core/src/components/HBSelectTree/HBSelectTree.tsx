import { Box, InputLabel, InputLabelProps, SelectProps } from '@mui/material'
import { ForwardedRef, forwardRef, useCallback, useEffect, useState } from 'react'
import { HBIcon, HBIconType } from '../HBIcon'
import { HBFormControlRootStyle } from '../HBSelect/HBSelect.styles'
import { HBTextField } from '../HBTextField'
import { listToTree } from '../HBTreeViewFlat/utils'
import {
  HBSelectTreeRootStyle,
  HBSelectTreeSearchStyle,
  HBSelectTreeViewStyle,
} from './HBSelectTree.styles'
import HBSelectTreeItem from './HBSelectTreeItem'
import HBSelectTreeRenderValue from './HBSelectTreeRenderValue'
import { flatListToTreeList, searchTree } from './utils'

export type HBSelectTreeDataProps = {
  id: string
  parentId: string | null
  selectable?: boolean
  label: string
  parentSelectable?: boolean
  value: string
  children?: HBSelectTreeDataProps[]
  isAllocatableToProduct?: boolean
}

let doFilter: NodeJS.Timeout

export interface HBSelectTreeProps extends Omit<SelectProps, 'ref' | 'children' | 'onChange'> {
  data: HBSelectTreeDataProps[]
  onSelectParent?: (parentId: string) => void
  onSelectChild?: (childId: string) => void
  onSearch?: (search?: string) => void
  searchPlaceholder?: string
  renderValueEmptyLabel?: string
  defaultValue?: HBSelectTreeDataProps | null
  collapseIcon?: HBIconType
  expandIcon?: HBIconType
  rootParentValue?: string | number | null | undefined
  onChange?: (value: string | string[]) => void
  inputLabelProps?: InputLabelProps
  label?: string
}

const HBSelectTree = forwardRef(
  <T extends HTMLSelectElement>(
    {
      data,
      onSelectParent,
      onSelectChild,
      defaultValue,
      onSearch,
      multiple,
      searchPlaceholder = 'جستجو',
      renderValueEmptyLabel = 'یک مورد را انتخاب نمایید',
      collapseIcon = 'angleDown',
      expandIcon = 'angleLeft',
      rootParentValue = '',
      inputLabelProps,
      onChange,
      ...props
    }: HBSelectTreeProps,
    ref: ForwardedRef<T>,
  ) => {
    const [tree, setTree] = useState<HBSelectTreeDataProps[]>([])
    const [searchValue, setSearchValue] = useState<string>()
    const [open, setOpen] = useState(false)
    const [treeItemSelect, setTreeItemSelect] = useState<HBSelectTreeDataProps[]>([])
    const [selectValue, setSelectValue] = useState<string | string[]>(multiple ? [] : '')
    const [isLoadData, setIsLoadData] = useState(false)
    useEffect(() => {
      const tree = listToTree<HBSelectTreeDataProps>(data, {
        childField: 'id',
        parentField: 'parentId',
        rootParentValue,
        titleField: 'label',
        valueField: 'value',
      })
      setTree(tree)
      if (data.length > 0) {
        const value = props?.value! as string | string[]
        if (value && !isLoadData) {
          !multiple ? setSelectValue(value) : setSelectValue([...value])
          const treeItems = data.filter((item) =>
            !multiple
              ? value === item.value
              : (value as string[]).findIndex((data: string) => data === item.value) !== -1,
          )
          setTreeItemSelect(treeItems)
          setIsLoadData(true)
        }
      }
    }, [data])

    const handleClickTreeItem = useCallback(
      (item: HBSelectTreeDataProps, event?: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event?.target || {}
        if (typeof checked !== 'boolean') {
          return
        }
        if (checked) {
          const isParent = item.parentSelectable
            ? false
            : data.filter((f) => f.parentId === item.id).length > 0
          if (!isParent) {
            onChange?.(!multiple ? item.value : [...selectValue, item.value])
            setSelectValue(
              !multiple
                ? item.value
                : selectValue.includes(item.value)
                ? (selectValue as string[]).filter((f: string) => f !== item.value)
                : [...selectValue, item.value],
            )
            setTreeItemSelect(
              !multiple
                ? [item]
                : treeItemSelect.find((f) => f.id === item.id)
                ? treeItemSelect.filter((f) => f.id !== item.id)
                : [...treeItemSelect, item],
            )
            if (!multiple) {
              onSelectChild?.(item.id)
              setOpen(false)
            }
          } else {
            onSelectParent?.(item.id)
          }
        } else {
          onChange?.(
            !multiple ? '' : (selectValue as string[]).filter((f: string) => f !== item.value),
          )
          setSelectValue(
            !multiple ? '' : (selectValue as string[]).filter((f: string) => f !== item.value),
          )
          setTreeItemSelect(!multiple ? [] : treeItemSelect.filter((f) => f.id !== item.id))
          if (!multiple) {
            onSelectChild?.(item.id)
            setOpen(false)
          }
        }
      },
      [],
    )

    const handleClose = () => {
      setOpen(false)
    }

    const handleOpen = () => {
      setOpen(true)
    }

    const handleSearch = (search: string) => {
      clearTimeout(doFilter)
      setSearchValue(search)

      if (onSearch) {
        onSearch?.(search)
      } else {
        doFilter = setTimeout(() => {
          if (search.length > 0) {
            const dataTree = searchTree([...data], search)
            setTree(flatListToTreeList(dataTree))
          } else {
            setTree(flatListToTreeList([...data]))
          }
        }, 500)
      }
    }

    useEffect(() => {
      if (defaultValue) {
        handleClickTreeItem(defaultValue, {
          target: {
            checked: true,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>)
      }

      if (!props?.value) {
        if (!multiple) {
          setSelectValue('')
        } else {
          setSelectValue([])
        }
        setTreeItemSelect([])
      }
    }, [defaultValue, props?.value])

    return (
      <HBFormControlRootStyle
        style={props.style}
        sx={props.sx}
        size={props.size}
        fullWidth={props.fullWidth}
        required={props.required}
      >
        <InputLabel {...inputLabelProps}>{props.label}</InputLabel>
        <HBSelectTreeRootStyle
          ref={ref}
          variant="outlined"
          {...props}
          multiple={multiple}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={selectValue}
          displayEmpty
          renderValue={(value) => {
            return (
              <HBSelectTreeRenderValue
                value={value}
                treeItemSelect={treeItemSelect}
                label={renderValueEmptyLabel}
              />
            )
          }}
        >
          <Box>
            <HBSelectTreeSearchStyle>
              <HBTextField
                value={searchValue}
                placeholder={searchPlaceholder}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mx: 2, mt: 1, color: (theme) => theme.palette.grey[300] }}>
                      <HBIcon type="searchAlt" />
                    </Box>
                  ),
                }}
                fullWidth
              />
            </HBSelectTreeSearchStyle>
            <HBSelectTreeViewStyle
              defaultCollapseIcon={<HBIcon type={collapseIcon} size="medium" />}
              defaultExpandIcon={<HBIcon type={expandIcon} size="medium" />}
            >
              <HBSelectTreeItem
                tree={tree}
                onClick={handleClickTreeItem}
                selectedIds={treeItemSelect.map((item) => item.id)}
              />
            </HBSelectTreeViewStyle>
          </Box>
        </HBSelectTreeRootStyle>
      </HBFormControlRootStyle>
    )
  },
)

HBSelectTree.displayName = 'HBSelectTree'
HBSelectTree.defaultProps = {}

export default HBSelectTree

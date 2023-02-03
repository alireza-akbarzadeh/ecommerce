import { Status } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBIcon } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import GridAction from '../components/GridAction'
import relatedAttributesMessage from '../relatedAttributes.message'
type GridColumnsType = {
  onDelete: (show: boolean, id: string) => void
  onEdit: (id: string) => void
  gridRef: RefObject<AgGridReact>
  editId?: string
}

function useGridColumns({ onEdit, onDelete, gridRef, editId }: GridColumnsType) {
  const { formatMessage } = useIntl()
  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const columnDefs = useMemo(
    () =>
      [
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
          checkboxSelection,
          headerCheckboxSelection,
          showRowGroup: true,
          pinned: 'right',
          lockPinned: true,
          cellClass: 'lock-pinned',
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {
            suppressCount: true,
            suppressDoubleClickExpand: true,
            innerRenderer: (params: ICellRendererParams) => (
              <GridAction {...params} {...{ onEdit, onDelete }} />
            ),
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          filter: 'agNumberColumnFilter',
          minWidth: 100,
          hide: true,
        },
        {
          field: 'name',
          headerName: formatMessage(relatedAttributesMessage.gridName),
          filter: 'agTextColumnFilter',
          minWidth: 120,
          pinned: 'right',
          tooltipField: 'name',
        },
        {
          field: 'featureDisplaySortTypeTitle',
          headerName: formatMessage(relatedAttributesMessage.gridDisplaySortType),
          filter: 'agTextColumnFilter',
          minWidth: 150,
          tooltipField: 'featureDisplaySortTypeTitle',
        },
        {
          field: 'displayOrder',
          headerName: formatMessage(relatedAttributesMessage.gridDisplayOrder),
          filter: 'agNumberColumnFilter',
          minWidth: 120,
          comparator: (valueA, valueB) => {
            return +valueA - +valueB
          },
        },
        {
          field: 'isMultipleChoice',
          headerName: formatMessage(relatedAttributesMessage.gridIsMultipleChoice),
          filter: 'agTextColumnFilter',
          minWidth: 120,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'isEffectiveInMultiplication',
          headerName: formatMessage(relatedAttributesMessage.gridIsPriceEffective),
          filter: 'agTextColumnFilter',
          minWidth: 120,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'changeableByOtherCustomer',
          headerName: formatMessage(relatedAttributesMessage.gridChangeableByOtherCustomer),
          filter: 'agTextColumnFilter',
          minWidth: 210,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'attributeName',
          headerName: formatMessage(relatedAttributesMessage.gridAttributeId),
          filter: 'agTextColumnFilter',
          minWidth: 130,
        },
        {
          field: 'categoryName',
          headerName: formatMessage(relatedAttributesMessage.gridCategoryId),
          filter: 'agTextColumnFilter',
          minWidth: 140,
        },
        {
          field: 'displayTitleAfter',
          headerName: formatMessage(relatedAttributesMessage.gridDisplayTitleAfter),
          filter: 'agTextColumnFilter',
          minWidth: 130,
        },
        {
          field: 'displayTitleBefore',
          headerName: formatMessage(relatedAttributesMessage.gridDisplayTitleBefore),
          filter: 'agTextColumnFilter',
          minWidth: 130,
        },
        {
          field: 'groupingSortOrder',
          headerName: formatMessage(relatedAttributesMessage.gridGroupingSortOrder),
          filter: 'agNumberColumnFilter',
          minWidth: 220,
          comparator: (valueA, valueB) => {
            return +valueA - +valueB
          },
        },
        {
          field: 'importantTypeCodeTitle',
          headerName: formatMessage(relatedAttributesMessage.gridImportantTypeCode),
          filter: 'agTextColumnFilter',
          minWidth: 140,
        },
        {
          field: 'isCompereable',
          headerName: formatMessage(relatedAttributesMessage.gridIsComparable),
          filter: 'agTextColumnFilter',
          minWidth: 120,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'isEffectiveInProductUnification',
          headerName: formatMessage(relatedAttributesMessage.gridIsEffectiveInProductUnification),
          filter: 'agTextColumnFilter',
          minWidth: 220,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'sortOrderInIsEffectiveInUnification',
          headerName: formatMessage(
            relatedAttributesMessage.gridSortOrderInIsEffectiveInProductUnification,
          ),
          filter: 'agNumberColumnFilter',
          minWidth: 220,
          comparator: (valueA, valueB) => {
            return +valueA - +valueB
          },
        },
        {
          field: 'isGroupingFilter',
          headerName: formatMessage(relatedAttributesMessage.gridIsGroupingFilter),
          filter: 'agTextColumnFilter',
          minWidth: 190,
        },
        {
          field: 'isQuickView',
          headerName: formatMessage(relatedAttributesMessage.gridIsQuickView),
          filter: 'agTextColumnFilter',
          minWidth: 210,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'isRateable',
          headerName: formatMessage(relatedAttributesMessage.gridIsRateable),
          filter: 'agTextColumnFilter',
          minWidth: 140,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'isUsedForFilter',
          headerName: formatMessage(relatedAttributesMessage.gridIsUsedForFilter),
          filter: 'agTextColumnFilter',
          minWidth: 160,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'isUsedForProductName',
          headerName: formatMessage(relatedAttributesMessage.gridIsUsedForProductName),
          filter: 'agTextColumnFilter',
          minWidth: 190,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'isEffectiveInDisplay',
          headerName: formatMessage(relatedAttributesMessage.isEffectiveInDisplay),
          filter: 'agTextColumnFilter',
          minWidth: 150,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },

        {
          field: 'isUsedInQuickCompare',
          headerName: formatMessage(relatedAttributesMessage.gridIsUsedInQuickCompare),
          filter: 'agTextColumnFilter',
          minWidth: 200,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'isVisible',
          headerName: formatMessage(relatedAttributesMessage.gridIsVisible),
          filter: 'agTextColumnFilter',
          minWidth: 160,
          cellRenderer: ({ value }: { value: boolean }) => {
            return value ? (
              <HBIcon type="check" size="medium" />
            ) : (
              <HBIcon type="minus" size="medium" />
            )
          },
        },
        {
          field: 'quickViewSortOrder',
          headerName: formatMessage(relatedAttributesMessage.gridQuickViewSortOrder),
          filter: 'agTextColumnFilter',
          minWidth: 240,
          comparator: (valueA, valueB) => {
            return +valueA - +valueB
          },
        },
        {
          field: 'searchWeight',
          headerName: formatMessage(relatedAttributesMessage.gridSearchWeight),
          filter: 'agNumberColumnFilter',
          minWidth: 120,
        },
        {
          field: 'sortOrderInProductName',
          headerName: formatMessage(relatedAttributesMessage.gridSortOrderInProductName),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'usedInQuickCompareSortOrder',
          headerName: formatMessage(relatedAttributesMessage.gridUsedInQuickCompareSortOrder),
          filter: 'agNumberColumnFilter',
          minWidth: 200,
          comparator: (valueA, valueB) => {
            return +valueA - +valueB
          },
        },
        {
          field: 'isActive',
          headerName: formatMessage(relatedAttributesMessage.gridIsActive),
          filter: 'agTextColumnFilter',
          maxWidth: 120,
          pinned: 'left',
          cellRenderer: Status,
          cellRendererParams: {
            active: formatMessage(phrasesMessages.active),
            inActive: formatMessage(phrasesMessages.deActive),
          },
        },
      ] as ColDef[],
    [gridRef.current?.api?.getSelectedRows(), editId],
  )

  return { columnDefs }
}

export default useGridColumns

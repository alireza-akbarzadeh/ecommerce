import { GetCurrenciesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject } from 'react'
export interface ISelectRowModel {
  id: string
  name: string
  isActive: boolean
  parentId?: string
}

export interface CreateColumnsModel {
  selectedRows: ISelectRowModel[]
}

export type SelectRowModel = {
  id: string
  code: number
  name: string
  symbol: string
  latinName: string
  isActive: boolean
}

export type AddEditStatusOneProps = {
  open: boolean
  onClose: () => void
  onSave: () => void
  id?: string
}

export type IconType = {
  id: string
  symbol: string
}

export type CurrenciesAddEditProps = {
  id?: string
  name?: string
  latinName?: string
  code?: string
  symbol?: IconType
  isActive?: boolean
  isDefault?: boolean
  conversionFactor?: number | undefined
  numberOfDecimal?: number | undefined
  tradingCurrency?: string
}

export type PeriodFilterOneModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: SelectRowModel[]
  onDelete: (show: boolean, id: string) => void
  onEditClick: (id: string) => void
  attributeId: string
  editId?: string
}

export interface IGridActionType extends ICellRendererParams {
  onEdit(id: number): void
  onDelete(show: boolean, id: string): void
}

export interface CreateToolbarModel<T> {
  selectedRows: T[]
  handleSetDeleteDialogState: (show: boolean, id?: string) => void
  onGridActionsChange: (value: number | string, type: 'search' | 'status') => void
  onRefreshClick: () => void
  onAddClick?: () => void
  onEditClick?: (id: string) => void
  onCancelClick?: () => void
  onSubmit?: () => void
  isEditOrAdd?: boolean
  isLoading?: boolean
  gridRef: RefObject<HBDataGridClientRef>
  handleChangeStatus: (status: boolean) => void
}

export interface ParamsValueType {
  value?: string
}

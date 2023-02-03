export interface SelectRowModel {
  id?: string
  title: string
  isActive: boolean
  isAdd?: boolean
}

export interface CreateColumnsModel {
  selectedRows: SelectRowModel[]
}

export interface SelectRowModel {
  id: string
  name: string
  isActive: boolean
  parentId?: string
}

export interface CreateColumnsModel {
  selectedRows: SelectRowModel[]
}

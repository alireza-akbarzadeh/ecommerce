export interface SelectRowModel {
  id: string
  name: string
  isActive: boolean
  parentId?: string
}

export interface CreateColumnsModel {
  selectedRows: SelectRowModel[]
}

export type SelectRowModelOne = {
  id: string
  code: number
  title: string
  description: string
  targetEntityFieldName: string
  factor: string
  isActive: boolean
}

export type SelectRowModelTwo = {
  id: string
  title: string
  code: string
  isActive: boolean
  isFinal?: boolean
  isInitial?: boolean
  icon?: string
  color?: string
  description?: string
}

export type SelectRowModelThree = {
  id: string
  toStateId: string
  fromStateId: string
  isActive: boolean
  icon?: string
  color?: string
  actionTitle: string
  description?: string
  stateMachineId: string
  isCommentRequired?: boolean
  isSystemic?: boolean
}

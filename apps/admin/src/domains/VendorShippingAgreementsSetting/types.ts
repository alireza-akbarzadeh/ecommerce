export interface ToolbarMoreItemsModel {
  formatMessage: (params: {}) => string
  disabledOnNoSelected: boolean
}

export interface ProducctsModel {
  hsin: string
  id: string
  name: string
  vendor: string
}

export type HBPageClassNames = 'selectComponentWidth' | 'gridSection' | 'currentState'

export interface CurrentStatusProps {
  text: string
  stateCode: string
}

export interface refetchMethodModel {
  refetch: () => void
}

export interface FormHeaderProps extends refetchMethodModel {
  id?: string
}

import { ICellRendererParams } from 'ag-grid-community'

type RolesDataGridProps = {
  createdBy?: string
  createdOn?: string
  id: string
  modifiedBy?: string
  modifiedOn?: string
  platform?: string
  type?: string
  state?: string
  typeTitle?: string
}

interface UserRoleDataGridProps extends Partial<ICellRendererParams> {
  id?: string
  title?: string
  changeRoles?: () => void
}

type RoleProps = {
  type?: string
  typeTitle?: string
}

export type { RoleProps, UserRoleDataGridProps, RolesDataGridProps }

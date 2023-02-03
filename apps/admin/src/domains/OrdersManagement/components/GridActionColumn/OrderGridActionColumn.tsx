import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { ICellRendererParams } from 'ag-grid-community'

export interface UserGridActionColumnProps extends ICellRendererParams {
  editUser?: (id: string) => void
  navigateToDetails?: (id: string) => void
}

export default function OrderGridActionColumn({ editUser, ...props }: UserGridActionColumnProps) {
  return <GridActionColumn {...props} menuItems={[]} />
}

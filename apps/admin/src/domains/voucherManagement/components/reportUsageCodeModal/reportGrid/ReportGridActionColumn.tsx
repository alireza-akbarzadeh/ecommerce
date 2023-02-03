import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { ICellRendererParams } from 'ag-grid-community'

export interface UserGridActionColumnProps extends ICellRendererParams {
  editUser?: (id: string) => void
}

export default function ReportGridActionColumn({ editUser, ...props }: UserGridActionColumnProps) {
  return <GridActionColumn menuItems={[]} {...props} />
}

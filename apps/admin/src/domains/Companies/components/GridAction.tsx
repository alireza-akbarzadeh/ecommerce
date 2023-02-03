import { GridActionColumn, GridActionMenuProps } from '@hasty-bazar/admin-shared/components'
import { ICellRendererParams } from 'ag-grid-community'
import { FC } from 'react'

interface IGridActionType extends ICellRendererParams {
  menuItems: GridActionMenuProps[]
}

const GridAction: FC<IGridActionType> = ({ menuItems = [], ...props }) => {
  return <GridActionColumn {...props} menuItems={menuItems} />
}

export default GridAction

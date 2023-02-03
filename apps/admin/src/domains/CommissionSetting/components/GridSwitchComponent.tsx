import { HBSwitch } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'

const GridSwitchComponent = ({ value }: ICellRendererParams) => {
  return <HBSwitch defaultChecked={value} readOnly={true} disabled />
}

export default GridSwitchComponent

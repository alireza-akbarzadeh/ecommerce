import { HBSwitch } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'

const UsageLimitCheck = ({ value }: ICellRendererParams) => {
  return <HBSwitch disabled checked={value} />
}

export default UsageLimitCheck

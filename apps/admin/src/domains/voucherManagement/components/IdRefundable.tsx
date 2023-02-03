import { HBSwitch } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'

interface IStatus extends ICellRendererParams {
  typeComponent: string
}

const IdRefundable = (props: IStatus) => {
  const { isRefundableReturn, isActive } = props?.data

  return props?.typeComponent === 'active' ? (
    <HBSwitch defaultChecked={isActive} readOnly={true} disabled />
  ) : (
    <HBSwitch defaultChecked={isRefundableReturn} readOnly={true} disabled />
  )
}

export default IdRefundable

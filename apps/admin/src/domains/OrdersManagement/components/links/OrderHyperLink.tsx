import { HBLink } from '@hasty-bazar/admin-shared/components'
import { ICellRendererParams } from 'ag-grid-community'

interface IOrderHyperLink extends ICellRendererParams {
  cellType: string
}

const OrderHyperLink = (props: IOrderHyperLink) => {
  return props?.value ? (
    <HBLink
      underline={'none'}
      href={`/users/detail/${props?.data?.customerId}`}
      variant={'subtitle2'}
      target="_blank"
      color={'info.main'}
    >
      {props?.value}
    </HBLink>
  ) : (
    ''
  )
}

export default OrderHyperLink

import HBSelectController from '@hasty-bazar-commerce/containers/HBSelectController'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebGeneralDataReasonsSettingQuery } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { inputLabelClasses, svgIconClasses } from '@mui/material'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import OrderTrackingMessages from '../../../orderTracking.messages'
import { IRefundForm } from '../../refund/RefundCard'

interface ICancelConsignmentReasonSelectProps {
  onChange?: (value: string) => void
  readOnly?: boolean
}

const CancelReasonSelect: FC<ICancelConsignmentReasonSelectProps> = (props) => {
  const { onChange, readOnly = false } = props
  const { watch } = useFormContext<IRefundForm>()
  const { formatMessage } = useIntl()
  const { data } = useGetWebGeneralDataReasonsSettingQuery({
    ...ApiConstants,
    userTypeCode: 1010003,
  })

  useEffect(() => {
    if (onChange) onChange(watch('reason'))
  }, [watch('reason')])

  return (
    <HBSelectController
      name="reason"
      size="small"
      fullWidth
      menuItem={data?.data?.items?.map((i) => ({ title: i.title, value: i.id })) ?? []}
      required
      label={formatMessage({ ...OrderTrackingMessages.cancelReason })}
      readOnly={readOnly}
      disabled={readOnly}
      sx={{
        ...(readOnly && {
          [`& .${svgIconClasses.root}`]: {
            display: 'none',
          },
          [`& .${inputLabelClasses.root}`]: {
            color: (theme) => `${theme.palette.primary.main}!important`,
          },
        }),
      }}
      formRules={{ required: true }}
    />
  )
}

export default CancelReasonSelect

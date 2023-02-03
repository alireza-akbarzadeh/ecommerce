import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebGeneralDataReasonsSettingQuery } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { HBSelect } from '@hasty-bazar/core'
import { inputLabelClasses, svgIconClasses } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'

interface ICancelConsignmentReasonSelectProps {
  onChange?: (value: string) => void
  readOnly?: boolean
  cancelReason?: string | null
  systemCancelReason?: string | null
}

const CancelConsignmentReasonSelect: FC<ICancelConsignmentReasonSelectProps> = (props) => {
  const { onChange, cancelReason, systemCancelReason, readOnly = false } = props
  const { formatMessage } = useIntl()
  const { data } = useGetWebGeneralDataReasonsSettingQuery({
    ...ApiConstants,
    userTypeCode: 1010003,
  })

  return (
    <HBSelect
      size="small"
      value={cancelReason}
      fullWidth
      onChange={(e) => {
        if (onChange) onChange(e.target.value as string)
      }}
      menuItem={
        systemCancelReason
          ? [{ title: systemCancelReason, value: systemCancelReason }]
          : data?.data?.items?.map((i) => ({ title: i.title, value: i.id })) ?? []
      }
      required
      label={formatMessage({ ...OrderTrackingMessages.cancelReason })}
      readOnly={readOnly}
      disabled={readOnly}
      sx={(theme) => ({
        ...(readOnly && {
          [`& .${svgIconClasses.root}`]: {
            display: 'none',
          },
          [`& .${inputLabelClasses.root}`]: {
            color: (theme) => `${theme.palette.primary.main}!important`,
          },
        }),
      })}
    />
  )
}

export default CancelConsignmentReasonSelect

import { HBChart } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { IVocherUsageInfoQuery } from '../../types/IVocherUsageInfoQuery'
import VoucherManagementPageMessages from '../../VoucherManagementPage.messages'

const ChartReport: FC<IVocherUsageInfoQuery> = ({ data }) => {
  const { formatMessage } = useIntl()

  const groupData = {
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontFamily: 'Peyda',
      },
    },
    color: ['#FFB067', '#2EBB66'],
    legend: {
      orient: 'vertical',
      bottom: 'bottom',
      show: true,
      textStyle: {
        fontFamily: 'Peyda',
      },
    },
    label: {
      show: true,
      position: 'center',
      textStyle: {
        fontFamily: 'Peyda',
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['90%', '0'],
        label: {
          normal: {
            show: true,
            position: 'inner',
            formatter: '{c}',
            fontSize: 12,
            fontFamily: 'Peyda',
          },
        },
        data: [
          {
            value: data?.data?.totalUsedVoucherPric || 0,
            name: formatMessage(VoucherManagementPageMessages.totalUsedVoucherPric),
          },
          {
            value: data?.data?.totalUseableVoucherPrice || 0,
            name: formatMessage(VoucherManagementPageMessages.amountUsablePrice),
          },
        ],
      },
    ],
  }

  return (
    <Box display={'flex'} justifyContent="center">
      <HBChart
        option={groupData}
        sx={{
          height: 288,
          width: 248,
          justifyContent: 'center',
          display: 'flex',
        }}
      />
    </Box>
  )
}

export default ChartReport

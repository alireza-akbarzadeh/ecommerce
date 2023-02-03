import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { GetQuestionRecordHistoryQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { HBExplanation } from '../HBExplanation'
import { HBRecordHistoryProps, RecordHistory } from './containers'
import HBRecordHistoryMessages from './HBRecordHistory.messages'

const HBRecordHistory = ({ isShowAccordion, ...props }: HBRecordHistoryProps) => {
  const { formatMessage } = useIntl()
  const [historyData, setHistoryData] = useState<GetQuestionRecordHistoryQueryResult | undefined>(
    undefined,
  )

  if (props?.useGetHistory && props?.entityId) {
    const { data: { data } = {}, isLoading } = props?.useGetHistory?.(
      {
        'client-name': 'vendor',
        'client-version': '1.0.0',
        id: props?.entityId,
      },
      {
        skip: !props?.entityId,
        refetchOnMountOrArgChange: true,
      },
    )
    useEffect(() => {
      setHistoryData(data)
    }, [props?.useGetHistory, isLoading, props?.entityId])
  }

  const RecordHistoryMemo = useCallback(
    (props: HBRecordHistoryProps) => {
      return <RecordHistory {...props} />
    },
    [historyData, props?.data],
  )

  return isShowAccordion ? (
    <HBExplanation
      disabled={props?.disabled}
      summary={
        <HBExplanationSummary
          title={formatMessage(HBRecordHistoryMessages.historyTitle)}
          icon="history"
        />
      }
      detail={<RecordHistoryMemo {...props} data={historyData || props.data} />}
    />
  ) : (
    <RecordHistoryMemo {...props} data={historyData || props?.data} />
  )
}

export default HBRecordHistory

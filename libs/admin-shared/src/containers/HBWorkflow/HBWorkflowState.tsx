import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import { StateResultApiResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Typography } from '@mui/material'
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query'
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import { useIntl } from 'react-intl'

export type StateMachineModelArg = {
  stateCode: string
  stateMachineCode: string
  'client-name': any
  'client-version': any
  factor: string
}

export type StateElementType = {
  stateCode: string
  factor: string
  machineCode: number
  useGetStateInfo?: UseQuery<
    QueryDefinition<
      StateMachineModelArg,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      StateResultApiResult,
      'api'
    >
  >
}
export default function HBWorkflowState({
  stateCode,
  factor,
  machineCode,
  useGetStateInfo,
}: StateElementType) {
  //@ts-ignore
  const { data: { data: state } = {} } = useGetStateInfo?.(
    {
      'client-name': 'vendor',
      'client-version': '1.0.0',
      factor,
      stateCode,
      stateMachineCode: String(machineCode),
    },
    {
      skip: !stateCode,
    },
  )

  const { formatMessage } = useIntl()
  return (
    <Typography
      sx={{
        borderRadius: ({ spacing }) => spacing(2),
        p: ({ spacing }) => spacing(1.5, 3),
        backgroundColor: state?.color ? `${state?.color}73` : 'grey.100',
        color: state?.color ?? 'grey.500',
      }}
      component="span"
      variant="body2"
    >
      {state?.title ?? formatMessage(phrasesMessages.noData)}
    </Typography>
  )
}

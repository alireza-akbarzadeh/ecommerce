import {
  GetMessageQueryResult,
  useLazyGetAdminNotificationMessagesQuery,
} from '@hasty-bazar/admin-shared/services/notificationApi.generated'
import { pascalCase } from '@hasty-bazar/admin-shared/utils/util'
import { HBButton, HBForm, HBIcon } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { MessageForm, UserMessageGrid } from './containers'
import { UserMessagesFilter } from './types'
import userMessages from './userMessages.messages'

export type MessageFormType = {
  partyId?: string
}

export type PageOptionType = {
  page: number
  pageSize: number
}

export default function Messages({ partyId }: MessageFormType) {
  const { formatMessage } = useIntl()
  const formProvider = useForm<UserMessagesFilter>({ mode: 'all' })
  const [messages, setMessages] = useState<GetMessageQueryResult[]>([])
  const [total, setTotal] = useState(0)
  const [pageOption, setPageOption] = useState<PageOptionType>({ page: 1, pageSize: 10 })
  const [userMessagesFilter, setUserMessagesFilter] = useState<UserMessagesFilter | undefined>()
  const [loadDataMessage] = useLazyGetAdminNotificationMessagesQuery()

  const handleSubmit = async (values: UserMessagesFilter) => {
    setUserMessagesFilter(values)
    values.recipientUserId = partyId

    let filter = ''
    Object.keys(values).forEach((key) => {
      //@ts-ignore
      if (!key.includes('Date') && values[key]) {
        filter += `${pascalCase(key)}_Equal_--${pascalCase(key)} And `
      }
    })
    filter = filter.slice(0, -5)

    const { data: { data: { items = [], totalItems = 0 } = {} } = {} } = await loadDataMessage({
      'client-name': 'admin',
      'client-version': '1.0.0',
      //@ts-ignore
      messageTransferType: values.messageTransferType?.id || undefined,
      fromDateTime: values?.fromDateTime
        ? new Date(values?.fromDateTime)
            .toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/\//g, '-')
        : undefined,
      toDateTime: values?.toDateTime
        ? new Date(values?.toDateTime)
            .toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/\//g, '-')
        : undefined,
      //@ts-ignore
      protocolType: values?.protocolType?.id || undefined,
      //@ts-ignore
      panelType: values?.panelType?.id || undefined,
      //@ts-ignore
      reason: values?.reason?.id || undefined,
      recipientUserId: partyId,
      pageSize: pageOption.pageSize,
      pageNumber: pageOption.page,
      filter: filter || undefined,
    })
    setMessages(items as GetMessageQueryResult[])
    setTotal(totalItems)
  }

  useEffect(() => {
    handleSubmit(userMessagesFilter || {})
  }, [pageOption])

  const handleChangePageOption = (pageOption: PageOptionType) => {
    setPageOption(pageOption)
  }

  return (
    <Box bgcolor={'common.white'} p={6}>
      <Typography
        sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: '700' }}
        variant={'h6'}
      >
        <HBIcon type="envelopeEdit" />
        {formatMessage(partyId ? userMessages.titleUserTab : userMessages.titleTab)}
      </Typography>
      <Box my={8}>
        <HBForm formProviderProps={formProvider} onSubmit={handleSubmit}>
          <MessageForm />
          <Box mt={6} display="flex" justifyContent="flex-end">
            <HBButton type="submit">{formatMessage(userMessages.buttonSearch)}</HBButton>
          </Box>
        </HBForm>
      </Box>
      <UserMessageGrid
        messages={messages}
        partyId={partyId}
        total={total}
        onChangePageOption={handleChangePageOption}
      />
    </Box>
  )
}

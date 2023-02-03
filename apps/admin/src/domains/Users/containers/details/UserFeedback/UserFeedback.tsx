import { pascalCase, toDateString } from '@hasty-bazar/admin-shared/utils/util'
import { HBForm, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import UserFeedbackFilter, { UserFeedbackFilterFormType } from './containers/UserFeedbackFilter'
import { UserFeedbackGrid } from './containers/UserFeedbackGrid'
import userFeedbackMessages from './UserFeedback.messages'

export type UserFeedbackProps = {
  userId: string
}

export default function UserFeedback({ userId }: UserFeedbackProps) {
  const { formatMessage } = useIntl()
  const [query, setQuery] = useState('')
  const formProvider = useForm<UserFeedbackFilterFormType>({ mode: 'all' })

  const handleFilter = async (values: UserFeedbackFilterFormType) => {
    const body = {
      partyId: userId,
      ...(values.fromDateTime
        ? { fromDateTime: toDateString({ date: values.fromDateTime, separator: '-' }) }
        : {}),
      ...(values.toDateTime
        ? { toDateTime: toDateString({ date: values.toDateTime, separator: '-' }) }
        : {}),
      ...(values.stateCode ? { stateCode: values.stateCode?.code } : {}),
      ...(values.rate ? { rate: values.rate } : {}),
      ...(values.recommendationType ? { recommendationType: values.recommendationType?.id } : {}),
    }

    const filter = Object.keys(body)
      .filter((f) => !f.includes('DateTime'))
      .map((key) => `${pascalCase(key)}_Equal_--${pascalCase(key)}`)
      .join(' And ')

    const fields = Object.keys(body)
      //@ts-ignore
      .map((key) => `${pascalCase(key)}=${body[key]}`)
      .join('&')

    const query = Object.keys(body).length ? `?filter=${filter}&${fields}` : ''
    setQuery(query)
  }

  const handleSubmit = async (values: UserFeedbackFilterFormType) => {
    await handleFilter(values)
  }

  const clearFilter = () => {
    formProvider.reset()
  }

  return (
    <Box
      bgcolor="common.white"
      px={8}
      pt={6}
      pb={10}
      sx={{
        borderRadius: (theme) => theme.spacing(4),
        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        minHeight: 300,
      }}
    >
      <Stack spacing={3} alignItems="center" direction="row">
        <HBIcon type="envelopeEdit" />
        <Typography variant="h5">{formatMessage(userFeedbackMessages.feedbackTitle)}</Typography>
      </Stack>
      <HBForm onSubmit={handleSubmit} formProviderProps={formProvider}>
        <UserFeedbackFilter onClear={clearFilter} />
      </HBForm>
      <UserFeedbackGrid query={query} partyId={userId} />
    </Box>
  )
}

import { HBLink } from '@hasty-bazar-commerce/components'
import { DolphinSavedSearchQueryResult } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'

type ISavedSearchCardProps = DolphinSavedSearchQueryResult

const SavedSearchCard: FC<ISavedSearchCardProps> = (props) => {
  const { query, title, createDate } = props
  const { formatDate } = useIntl()

  return (
    <HBLink href={`${query}`} underline="none" color="info.main">
      <Stack direction="row" columnGap={4} ml={4}>
        {createDate && (
          <Typography color="primary.main" variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
            {formatDate(createDate, {
              month: 'long',
              day: '2-digit',
            })}
          </Typography>
        )}
        <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
          {title}
        </Typography>
      </Stack>
    </HBLink>
  )
}

export default SavedSearchCard

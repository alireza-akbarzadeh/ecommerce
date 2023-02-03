import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import careersMessage from '../careers.message'
import { JobItem } from '../components'

const JobList: FC = () => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Stack direction="row" alignItems="center" mb={8} mt={9}>
        <Typography variant="h4" color="info.dark">
          {formatMessage(careersMessage.view)}
        </Typography>
        <Typography variant="h4" color="primary.main">
          {formatMessage(careersMessage.allJobs)}
        </Typography>
      </Stack>

      <JobItem />
      <JobItem />
      <JobItem />
      <JobItem />
      <JobItem />
    </>
  )
}

export default JobList

import { fontWeights } from '@hasty-bazar/material-provider'
import { Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import ticketingMessages from '../ticketing.messages'

interface EmptyComponentProps {
  searchValue?: string
}
function EmptyComponent({ searchValue }: EmptyComponentProps) {
  const { formatMessage } = useIntl()

  const imagePath = searchValue ? '/assets/svg/notFondIcon.svg' : '/assets/svg/emptyIcon.svg'
  return (
    <Stack
      width="100%"
      sx={{
        bgcolor: 'common.white',
      }}
    >
      <Stack py={10} width="100%" justifyContent="center" alignItems="center">
        <Stack component="img" src={imagePath} alt="emptyIcon" />

        <Typography
          pt={8}
          fontWeight={fontWeights.fontWeightBold}
          variant="h5"
          color="common.black"
          textAlign={{ md: 'start', xs: 'center' }}
        >
          {searchValue
            ? formatMessage(ticketingMessages.notFondDescription, {
                searchValue,
              })
            : formatMessage(ticketingMessages.emptyTitle)}
        </Typography>
        {!searchValue && (
          <Typography
            pt={2}
            color={'text.secondary'}
            variant="subtitle2"
            textAlign={{ md: 'start', xs: 'center' }}
          >
            {formatMessage(ticketingMessages.emptyDescription)}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

export default EmptyComponent

import { Box, Rating, Stack, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import VendorMessages from '../../../Vendor.messages'

type ScoreProps = {
  storeName?: string
  score: number
  captionNumber: number
  isSeller?: boolean
}

function Score({ storeName, score, captionNumber, isSeller }: ScoreProps) {
  return (
    <Stack spacing={4}>
      <Typography variant="subtitle1">
        <FormattedMessage
          {...VendorMessages?.[isSeller ? 'sellerScore' : 'commentsFor']}
          values={{
            storeName,
          }}
        />
      </Typography>

      <Typography variant="h6">{score}</Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          color: ({ palette }) => palette.warning.light,
        }}
      >
        <Rating value={score} readOnly precision={0.1} />
      </Box>

      <FormattedMessage
        {...VendorMessages?.[isSeller ? 'satisfiedSeller' : 'basedOnCommentsCount']}
        values={{
          value: captionNumber,
        }}
      />
    </Stack>
  )
}

export default Score

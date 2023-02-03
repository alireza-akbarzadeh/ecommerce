import { HBButton, HBTextField } from '@hasty-bazar/core'
import { Box, Grid, outlinedInputClasses, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useFaqContext } from '../context'
import faqMessage from '../faq.message'

const SearchQuestions: FC = () => {
  const { formatMessage } = useIntl()
  const { setSearchParam } = useFaqContext()
  const [param, setParam] = useState<string>('')

  useEffect(() => {
    if (!param) {
      setSearchParam('')
    }
  }, [param])

  return (
    <Grid container flexDirection="column" alignItems="center">
      <Stack direction="row" alignItems="center" mb={8} mt={9}>
        <Typography variant="h4" color="info.dark">
          {formatMessage(faqMessage.topic)}
        </Typography>
        <Typography variant="h4" color="primary.main">
          {formatMessage(faqMessage.question)}
        </Typography>
        <Typography variant="h4" color="info.dark">
          {formatMessage(faqMessage.whatAreYou)}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} position="relative">
        <HBTextField
          dir="rtl"
          sx={{
            width: { sm: 407, xs: '100%' },
            bgcolor: 'common.white',
            [`& .${outlinedInputClasses.root}`]: {
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <Box mr={2} mt={2}>
                <Image src={'/assets/svg/search.svg'} alt="" width={16.56} height={16.63} />
              </Box>
            ),
          }}
          onChange={(event) => setParam(event.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              setSearchParam(param)
            }
          }}
        />
        <HBButton
          size="small"
          sx={(theme) => ({
            width: 74,
            position: 'absolute',
            right: theme.spacing(2),
            top: theme.spacing(1),
            boxShadow: 'none',
          })}
          onClick={() => setSearchParam(param)}
        >
          {formatMessage(faqMessage.search)}
        </HBButton>
      </Stack>
    </Grid>
  )
}

export default SearchQuestions

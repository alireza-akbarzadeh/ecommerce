import {
  HBLink,
  RateChip,
  RecomandationType,
  TextWithHBIcon,
} from '@hasty-bazar-commerce/components'
import { CommentRecommendationType } from '@hasty-bazar-commerce/core/enums'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBRadioButton, HBRating } from '@hasty-bazar/core'
import {
  Box,
  createTheme,
  FormControl,
  FormControlLabel,
  Grid,
  RadioGroup,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { FC, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import CommentMessages from './Comment.messages'
import FileUpload from './FileUpload'

interface ICommentForm {
  isLoading?: boolean
}

enum RateBadgeType {
  veryBad = 1,
  bad,
  usual,
  good,
  veryGood,
}

export const recommendationTypeItems: RecomandationType[] = [
  {
    value: CommentRecommendationType.recommended,
    title: <FormattedMessage {...CommentMessages.recommended} />,
    icon: 'thumbsUp',
  },
  {
    value: CommentRecommendationType.notSure,
    title: <FormattedMessage {...CommentMessages.notSure} />,
    icon: 'commentAltQuestion',
  },
  {
    value: CommentRecommendationType.notRecommended,
    title: <FormattedMessage {...CommentMessages.notRecommended} />,
    icon: 'thumbsDown',
  },
]

const CommentForm: FC<ICommentForm> = ({ isLoading }) => {
  const BODY_CHARACTER_LIMIT = 500
  const SUBJECT_CHARACTER_LIMIT = 25
  const { formatMessage } = useIntl()
  const { watch, control } = useFormContext()
  const theme2 = createTheme({ direction: 'ltr' })

  const handleDisable = useMemo(() => {
    if (
      !watch('subject') ||
      watch('subject').length < 1 ||
      !watch('body') ||
      watch('body').length < 10 ||
      isLoading
    )
      return true
  }, [watch('body'), watch('subject')])

  const getBodyLength = useMemo(() => {
    return `${watch('body')?.length ?? 0}/${BODY_CHARACTER_LIMIT}`
  }, [watch('body')])

  const getSubjectLength = useMemo(() => {
    return `${watch('subject')?.length ?? 0}/${SUBJECT_CHARACTER_LIMIT}`
  }, [watch('subject')])

  const getRateBadge: Record<RateBadgeType, string> = {
    [RateBadgeType.veryBad]: formatMessage(CommentMessages.veryBad),
    [RateBadgeType.bad]: formatMessage(CommentMessages.bad),
    [RateBadgeType.usual]: formatMessage(CommentMessages.usual),
    [RateBadgeType.good]: formatMessage(CommentMessages.good),
    [RateBadgeType.veryGood]: formatMessage(CommentMessages.veryGood),
  }

  return (
    <Stack spacing={6}>
      <Grid container rowGap={4}>
        <Grid item xs={12}>
          <Controller
            name="rate"
            control={control}
            defaultValue={0}
            render={({ field }) => {
              return (
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="subtitle1" mt={1}>
                      {formatMessage(CommentMessages.saveRateMessage)}
                    </Typography>
                    {!!watch('rate') && (
                      <RateChip label={getRateBadge[watch('rate') as RateBadgeType]} />
                    )}
                  </Stack>
                  <ThemeProvider theme={theme2}>
                    <Box dir="ltr" textAlign="left">
                      <HBRating
                        sx={{ width: 'fit-content' }}
                        value={+field.value}
                        onChange={(_, value) => field.onChange(value)}
                      />
                    </Box>
                  </ThemeProvider>
                </Stack>
              )
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="recommendationType"
            control={control}
            defaultValue={null}
            render={({ field }) => {
              return (
                <FormControl sx={{ width: 'fit-content' }}>
                  <RadioGroup {...field} onChange={(_, value) => field.onChange(+value)}>
                    {recommendationTypeItems?.map((item, index) => {
                      return (
                        <FormControlLabel
                          sx={{ px: 1 }}
                          key={index}
                          value={item.value}
                          checked={field.value === item.value}
                          control={
                            <HBRadioButton
                              sx={{
                                '& > span:first-of-type': {
                                  width: 16,
                                  height: 16,
                                  boxShadow:
                                    field.value === item.value
                                      ? 'inset 0 0 0 4px !important'
                                      : 'unset',
                                  border: 'none !important',
                                  outline: 'none !important',
                                },
                              }}
                            />
                          }
                          label={
                            <TextWithHBIcon
                              text={item.title}
                              customVariant="subtitle2"
                              iconType={item.icon}
                              size="small"
                              iconColor={
                                field.value === item.value ? 'text.primary' : 'text.secondary'
                              }
                              textColor={
                                field.value === item.value ? 'text.primary' : 'text.secondary'
                              }
                            />
                          }
                        />
                      )
                    })}
                  </RadioGroup>
                </FormControl>
              )
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <HBTextFieldController
            name="subject"
            label={formatMessage(CommentMessages.commentSubjectLabel)}
            formRules={{ required: true }}
            inputProps={{ maxLength: 25 }}
            helperText={getSubjectLength}
            FormHelperTextProps={{ sx: { mx: 0, alignSelf: 'flex-end' } }}
            helperTextIcon={false}
          />
        </Grid>

        <Grid item xs={12}>
          <HBTextFieldController
            name="body"
            placeholder={formatMessage(CommentMessages.commentBodyPlaceholder)}
            label={formatMessage(CommentMessages.commentDescriptionLabel)}
            formRules={{ required: true, minLength: 10, maxLength: 500, min: 10, max: 500 }}
            rows={5}
            multiline
            inputProps={{ maxLength: 500, minLength: 10 }}
            helperText={getBodyLength}
            FormHelperTextProps={{ sx: { mx: 0, alignSelf: 'flex-end' } }}
            helperTextIcon={false}
          />
          <FileUpload
            accept={'image/*, video/*'}
            labelText={
              <HBLink color="info.main" underline="none">
                <TextWithHBIcon
                  text={
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      gap={1}
                    >
                      {formatMessage(CommentMessages.commentUploadLabel)}

                      <Typography variant="button" color="text.secondary">
                        <FormattedMessage {...CommentMessages.commentUploadLimitLabel} />
                      </Typography>
                    </Stack>
                  }
                  iconType="upload"
                  sx={{
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                />
              </HBLink>
            }
          />
        </Grid>
      </Grid>
      <Stack spacing={4}>
        <HBButton loading={isLoading} type="submit" disabled={handleDisable || isLoading} fullWidth>
          <FormattedMessage {...CommentMessages.confrim} />
        </HBButton>
        <Typography variant="caption">
          <FormattedMessage {...CommentMessages.commentTermsMessage} />
        </Typography>
      </Stack>
    </Stack>
  )
}

export default CommentForm

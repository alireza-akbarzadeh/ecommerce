import { Nothing } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCatalogProductRulesGetallPublishedQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBAccordion } from '@hasty-bazar/core'
import {
  accordionClasses,
  accordionSummaryClasses,
  CircularProgress,
  Divider,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import CommentMessages from './Comment.messages'

const CommentTerms = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { data, isFetching } = useGetWebCatalogProductRulesGetallPublishedQuery({
    ...ApiConstants,
    processEventName: 'Catalog_RateFeedbackComment_CommentRules',
    filter: 'ProcessEventName_Equal_--ProcessEventName',
  })

  const commentTermContent = () => {
    return (
      <Stack
        spacing={2}
        sx={{
          height: '100%',
          maxHeight: 450,
        }}
      >
        {isFetching ? (
          <CircularProgress sx={{ m: '0 auto' }} />
        ) : data && !!data.data?.items?.length ? (
          data.data?.items?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Typography variant="subtitle2" color="info.main">
                  {item.name}
                </Typography>
                <Typography
                  component="div"
                  sx={{
                    '& *': {
                      fontFamily: (theme) => `${theme.typography.fontFamily} !important`,
                      textAlign: 'justify !important',
                    },
                    '& h1,h2,h3,h4,h5': {
                      lineHeight: ({ spacing }) => `${spacing(8)} !important`,
                    },
                    lineHeight: `2.3 !important`,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: item?.description || '',
                  }}
                />
              </React.Fragment>
            )
          })
        ) : (
          <Nothing />
        )}
      </Stack>
    )
  }

  return (
    <Stack spacing={4} divider={<Divider variant="middle" sx={{ color: 'grey.200' }} />}>
      {!isSmall && (
        <>
          <Typography variant="subtitle1">
            <FormattedMessage {...CommentMessages.commentTermsTitle} />
          </Typography>
          {commentTermContent()}
        </>
      )}
      {isSmall && (
        <HBAccordion
          summary={
            <Typography variant="subtitle1">
              <FormattedMessage {...CommentMessages.commentTermsTitle} />
            </Typography>
          }
          detail={<>{commentTermContent()}</>}
          sx={{
            width: '100%',
            boxShadow: 'unset',
            [`&.${accordionClasses.expanded}`]: {
              my: 0,
            },
            [`& .${accordionSummaryClasses.root}`]: {
              px: 0,
              minHeight: 'min-content',
            },
            [`& .${accordionSummaryClasses.content}`]: {
              m: 0,
            },
          }}
        />
      )}
    </Stack>
  )
}

export default CommentTerms

import { HBLink } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import useClientSession from '@hasty-bazar-commerce/core/hook/useClientSession'
import { usePutWebCatalogFaqsQuestionReactionByIdMutation } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBButton, HBIcon, openToast } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import { Box, Grid, styled, Theme, Typography, useMediaQuery } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import faqMessage from '../faq.message'

export const DetailWrapper = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(5, 2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: 16,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5, 0),
  },
}))

export const ReactionConst = {
  liked: 'liked',
  disLiked: 'disLiked',
  noSelected: 'noSelected',
}

const QuestionsDetailComment: FC = () => {
  const router = useRouter()
  const [reaction, setReaction] = useState(ReactionConst.noSelected)
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { formatMessage } = useIntl()
  const [updateReaction] = usePutWebCatalogFaqsQuestionReactionByIdMutation()
  const { data } = useSession()
  const partyId = data?.user.partyId || null
  const clientSessionId = useClientSession()
  const onSetReaction = (like: boolean) => {
    updateReaction({
      ...ApiConstants,
      id: router?.query?.params?.[0]!,
      setReactionQuestionModel: {
        like: like ? (reaction === ReactionConst.liked ? false : true) : false,
        dislike: !like ? (reaction === ReactionConst.disLiked ? false : true) : false,
        partyId,
        clientSessionId: clientSessionId!,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        setReaction(
          like
            ? reaction === ReactionConst.liked
              ? ReactionConst.noSelected
              : ReactionConst.liked
            : reaction === ReactionConst.disLiked
            ? ReactionConst.noSelected
            : ReactionConst.disLiked,
        )
        openToast({
          message: formatMessage(faqMessage.yourAnwerIsSaved),
          type: 'success',
        })

        router.query.commentResult = like
          ? reaction === ReactionConst.liked
            ? ReactionConst.noSelected
            : ReactionConst.liked
          : reaction === ReactionConst.disLiked
          ? ReactionConst.noSelected
          : ReactionConst.disLiked
        router.push(router, undefined, { shallow: true })
      }
    })
  }

  useEffect(() => {
    setReaction(router.query.commentResult as string)
  }, [])

  return (
    <DetailWrapper container>
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        container
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {!!router?.query?.params?.[1] && (
          <Box textAlign="left">
            <Typography
              mb={4}
              sx={{
                fontWeight: fontWeights.fontWeightBold,
              }}
              variant={breakpointDownSm ? 'caption' : 'h6'}
            >
              {formatMessage(faqMessage.wereTheAnswersHelpful)}
            </Typography>
            <Box display={'flex'} mt={2}>
              <HBButton
                variant="outlined"
                type="button"
                sx={{ minWidth: 50, m: 1, pr: { xs: 1 }, pl: { xs: 1 }, height: { xs: 30 } }}
                onClick={() => onSetReaction(true)}
              >
                <Box sx={{ display: 'flex', pr: 1 }}>
                  <Image
                    width={15}
                    height={15}
                    src={`/assets/svg/${reaction === ReactionConst.liked ? 'liked' : 'like'}.svg`}
                  />
                </Box>
                {formatMessage(faqMessage.yes)}
              </HBButton>
              <HBButton
                variant="outlined"
                type="button"
                sx={{ minWidth: 50, m: 1, pr: { xs: 1 }, pl: { xs: 1 }, height: { xs: 30 } }}
                onClick={() => onSetReaction(false)}
              >
                <Box sx={{ display: 'flex', pr: 1 }}>
                  <Image
                    width={15}
                    height={15}
                    src={`/assets/svg/${
                      reaction === ReactionConst.disLiked ? 'disLiked' : 'disLike'
                    }.svg`}
                  />
                </Box>
                {formatMessage(faqMessage.no)}
              </HBButton>
            </Box>
          </Box>
        )}
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={6}
        lg={6}
        container
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box textAlign="left">
          <Typography
            mb={4}
            sx={{ fontWeight: fontWeights.fontWeightBold }}
            variant={breakpointDownSm ? 'caption' : 'h6'}
          >
            {formatMessage(faqMessage.youDidNotFindYourAnswer)}
          </Typography>
          <HBLink href={`/contact-us`}>
            <Typography
              variant="subtitle2"
              color="info.main"
              mt={5}
              display="flex"
              alignItems="center"
            >
              <HBIcon type="envelope" sx={{ mr: 1 }} />
              {formatMessage(faqMessage.sendMessage)}
            </Typography>
          </HBLink>
        </Box>
      </Grid>
    </DetailWrapper>
  )
}

export default QuestionsDetailComment

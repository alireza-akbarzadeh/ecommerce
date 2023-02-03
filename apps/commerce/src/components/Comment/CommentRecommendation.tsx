import { CommentRecommendationType } from '@hasty-bazar-commerce/core/enums'
import { HBIconType } from '@hasty-bazar/core'
import { Theme, useMediaQuery } from '@mui/material'
import { FC, ReactNode } from 'react'
import { TextWithHBIcon } from '../TextWithHBIcon'

export type RecomandationType = {
  value: CommentRecommendationType
  title: ReactNode
  icon: HBIconType
}

interface ICommentRecommandation {
  content: RecomandationType
}

const CommentRecommandation: FC<ICommentRecommandation> = ({ content }) => {
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const selectRecommendationColor: Record<CommentRecommendationType, string> = {
    [CommentRecommendationType.recommended]: 'success.main',
    [CommentRecommendationType.notSure]: 'text.secondary',
    [CommentRecommendationType.notRecommended]: 'error.main',
  }

  return (
    <TextWithHBIcon
      text={content?.title}
      customVariant={breakpointDownSm ? 'caption' : 'subtitle2'}
      iconType={content?.icon}
      size="small"
      iconColor={selectRecommendationColor[content.value]}
      textColor={selectRecommendationColor[content.value]}
    />
  )
}

export default CommentRecommandation

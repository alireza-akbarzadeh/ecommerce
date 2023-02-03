import { CommerceLoading } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  QuestionCategoryQueryModel,
  useGetWebCatalogFaqsCategoriesQuery,
} from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Box, Stack, styled, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { QuestionsCategoryItem } from '../components'
import faqMessage from '../faq.message'

export const ItemWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
}))

const QuestionsCategory: FC = () => {
  const { formatMessage } = useIntl()
  const { data: categories, isFetching: categoryFetching } = useGetWebCatalogFaqsCategoriesQuery({
    ...ApiConstants,
  })

  return (
    <>
      {categoryFetching && <CommerceLoading />}
      <Stack direction="row" alignItems="center" mb={8}>
        <Typography variant="h4" color="info.dark">
          {formatMessage(faqMessage.category)}
        </Typography>
        <Typography component="h1" variant="h4" color="primary.main">
          {formatMessage(faqMessage.questions)}
        </Typography>
      </Stack>

      <ItemWrapper>
        {categories?.data?.items &&
          categories.data.items
            .slice()
            .sort((a, b) => (a.sortOrderIndex || 0) - (b.sortOrderIndex || 0))
            ?.map(
              (item: QuestionCategoryQueryModel) =>
                item.isActive && item.hasQuestion && <QuestionsCategoryItem {...{ item }} />,
            )}
      </ItemWrapper>
    </>
  )
}

export default QuestionsCategory

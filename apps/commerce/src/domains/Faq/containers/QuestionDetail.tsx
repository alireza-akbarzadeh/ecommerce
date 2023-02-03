import { CommerceLoading } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { EntityTypeEnums } from '@hasty-bazar-commerce/core/enums'
import { useGetWebCmsContentsByEntityTypeIdAndEntityIdQuery } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { ContentTypeEnums } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'

const QuestionDetail: FC = () => {
  const router = useRouter()

  const { data: questionDetail, isFetching: questionFetching } =
    useGetWebCmsContentsByEntityTypeIdAndEntityIdQuery({
      ...ApiConstants,
      contentType: ContentTypeEnums.Html,
      entityId: router?.query?.params?.[0] as string,
      entityTypeId: EntityTypeEnums.FAQ,
    })

  return (
    <>
      {questionFetching && <CommerceLoading />}
      <Typography variant="h4">{questionDetail?.data?.items![0].title}</Typography>
      {questionDetail?.data?.items?.map((item) => (
        <Box
          dangerouslySetInnerHTML={{ __html: item.value || '' }}
          mb={5}
          sx={{
            '& img': { maxWidth: '100%', height: '100%', objectFit: 'contain' },
            '& *': {
              fontFamily: (theme) => `${theme.typography.fontFamily} !important`,
              textAlign: 'justify !important',
            },
            lineHeight: `2.3 !important`,
          }}
        ></Box>
      ))}
    </>
  )
}

export default QuestionDetail

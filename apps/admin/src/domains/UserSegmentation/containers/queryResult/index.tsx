import { CollectionTypeEnum } from '@hasty-bazar/admin-shared/core/enums/CollectionType'
import CollectionQueryResult from '@hasty-bazar-admin/domains/Collection/containers/CollectionQueryResult'
import { useGetAdminGeneralDataCollectionCollectionFieldsQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { UserQueryGrid } from '../../components'
import { ListCreationTypeCodeEnum } from '../../enums/UserCategoriesValidationFormEnum'
import UserCategoriesMessage from '../../messages/UserCategoriesMessage'
import { IQueryResult } from '../../types/IUserCategories'

const QueryResult: FC<IQueryResult> = ({ isDirty, listCreationType, data }) => {
  const { formatMessage } = useIntl()

  const { data: collectionFieldData } = useGetAdminGeneralDataCollectionCollectionFieldsQuery({
    'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
    'client-version': '1.0.1.100',
    collectionType: CollectionTypeEnum.User,
    withNestedProperties: true,
  })

  return (
    <Box
      bgcolor="common.white"
      sx={{
        pb: 8,
        pt: 6,
        px: 8,
        borderRadius: (theme) => theme.spacing(5),
        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        mt: 3,
      }}
    >
      <Stack
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        flexWrap={'wrap'}
      >
        <Box display={'inline-flex'} gap={2}>
          <HBIcon type="database" />
          <Typography variant={'h4'}>{formatMessage(UserCategoriesMessage.queryResult)}</Typography>
        </Box>
      </Stack>
      {listCreationType?.id === ListCreationTypeCodeEnum.Manual && (
        <UserQueryGrid {...{ listCreationType }} {...{ isDirty }} data={data} />
      )}
      {listCreationType?.id === ListCreationTypeCodeEnum.DynamicQuery && data?.data?.collectionId && (
        <CollectionQueryResult
          collectionType={CollectionTypeEnum.User}
          gridColumn={collectionFieldData?.data?.items
            ?.filter((item) => item.resultData?.showInCollectionResult)
            .map((item) => {
              return {
                name: item.resultData?.gridFieldName!,
                title: item.title!,
                isShow: item.resultData?.isDefaultField!,
                type: item?.dataTypeTitle!,
              }
            })}
          id={data?.data?.collectionId}
        />
      )}
    </Box>
  )
}

export default QueryResult

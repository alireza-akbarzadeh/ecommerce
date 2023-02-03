import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import instance from '@hasty-bazar/admin-shared/core/handler'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import {
  GetContentsByEntityTypeQueryResult,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetVendorStoreResultApiResult,
  usePostAdminIdrVendorsUpdateImageEventMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBAvatar, HBRating, openToast } from '@hasty-bazar/core'
import { Grid, List, ListItem, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

type NameInformationProps = {
  vendorData: GetVendorStoreResultApiResult
  userId: string
}

const NameInformation = ({ vendorData, userId }: NameInformationProps) => {
  const { formatMessage } = useIntl()
  const { data } = vendorData
  const [filePath, setFilePath] = useState<string>('')
  const [star, setStar] = useState<number | null>(2)
  const [avatar, setAvatar] = useState<GetContentsByEntityTypeQueryResult>()

  const [postVendorStore] = usePostAdminIdrVendorsUpdateImageEventMutation()

  const { data: { data: { items: profileData = [] } = {} } = {}, refetch } =
    useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
      {
        'client-name': 'get-profile-img',
        'client-version': '0',
        entityId: userId,
        entityTypeId: EntityTypeEnums.User,
        contentType: ContentTypeEnums.Image,
        factor: 'StoreImage',
      },
      {
        skip: !userId,
      },
    )

  useEffect(() => {
    if (profileData?.length) {
      const avatarLoad = profileData![profileData?.length! - 1]
      setFilePath(avatarLoad?.value ? process.env.NEXT_PUBLIC_CDN + avatarLoad?.value : '')
      setAvatar(avatarLoad)
    }
  }, [profileData?.length])

  return (
    <Grid container spacing={1} bgcolor="common.white" p={6}>
      <Grid item sx={{ display: 'flex' }}>
        <Box>
          <HBAvatar
            instance={instance}
            avatarId={avatar?.id}
            factor="StoreImage"
            partyId={userId as string}
            profileUrl={filePath}
            changeWithIcon
            cmsUrl={process.env.NEXT_PUBLIC_CMS_URL}
            onError={(error) =>
              openToast({
                message: errorsToString(error),
                type: 'error',
              })
            }
            onDeleted={() => {
              setFilePath('')
              setAvatar(undefined)
              refetch()
            }}
            onSuccess={(image: any) => {
              setFilePath(`${process.env.NEXT_PUBLIC_CDN}${image?.value}`)
              setAvatar(image)
              openToast({
                message: formatMessage(userPageMessages.editAvatarStoreSuccessMessage),
                type: 'success',
              })
              postVendorStore({
                'client-name': 'update-vendor-store',
                'client-version': '1.0.0',
                updateImageEventModel: {
                  image: image?.value || '',
                  type: 'StoreImage',
                  vendorId: data?.id || undefined,
                },
              })
            }}
            sx={{
              width: 73,
              height: 73,
              '& .avatar-icon-wrapper': {
                width: 30,
                height: 30,
              },
            }}
          />
        </Box>
        <Box sx={({ spacing }) => ({ margin: spacing(0, 2) })}>
          <Box>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
              {data?.storeName}
              <Typography
                bgcolor="primary.lighter"
                color="primary.main"
                sx={{
                  borderRadius: 3,
                }}
                py={1}
                px={3}
                mx={2}
                my={0}
              >
                {`${formatMessage(userPageMessages.plaque)} ${data?.number}`}
              </Typography>
            </Typography>
          </Box>
          <Box>
            <List
              sx={{
                display: 'flex',
                gap: 4,
              }}
            >
              <ListItem
                disablePadding
                sx={{ display: 'flex', flexDirection: 'column', width: 'auto' }}
              >
                <Typography variant="body2">256</Typography>
                <Typography variant="body2" color={'primary'}>
                  {formatMessage(userPageMessages.visitors)}
                </Typography>
              </ListItem>
              <ListItem
                disablePadding
                sx={{ display: 'flex', flexDirection: 'column', width: 'auto' }}
              >
                <Typography variant="body2">1550</Typography>
                <Typography variant="body2" color={'primary'}>
                  {formatMessage(userPageMessages.followers)}
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        sx={{
          display: 'flex',
          alignSelf: 'flex-start',
          alignItems: 'center',
        }}
        mt={1}
      >
        <HBRating
          value={star}
          onChange={(event, newValue) => {
            setStar(newValue)
          }}
        />
        <Typography color={'text.secondary'} variant="body2">
          {formatMessage(userPageMessages.basedOnMessage, {
            msg: 10,
          })}
        </Typography>
      </Grid>
    </Grid>
  )
}
export default NameInformation

import { AlertElement } from '@hasty-bazar/admin-shared/components/Status/Status'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { RoleType } from '@hasty-bazar/admin-shared/core/enums/RoleType'
import instance from '@hasty-bazar/admin-shared/core/handler'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  GetContentsByEntityTypeQueryResult,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetPartyDetailsQueryResult,
  usePostAdminIdrVendorsUpdateImageEventMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { HBAvatar, HBButton } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import userPageMessages from '../../UserPage.messages'

export type UserAvatarProps = {
  id?: string
  details: GetPartyDetailsQueryResult
}

export default function UserAvatar({ id, details }: UserAvatarProps) {
  const { showToast } = useToast()
  const [filePath, setFilePath] = useState<string>('')
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [avatar, setAvatar] = useState<GetContentsByEntityTypeQueryResult>()

  const [postUserProfile] = usePostAdminIdrVendorsUpdateImageEventMutation()

  const { data, refetch } = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      entityId: id!,
      entityTypeId: EntityTypeEnums.User,
      contentType: ContentTypeEnums.Image,
      factor: 'ProfileImage',
    },
    { skip: !id },
  )

  useEffect(() => {
    if (data?.data?.totalItems! > 0) {
      const avatarLoad = data?.data?.items![data?.data?.items?.length! - 1]
      setFilePath(process.env.NEXT_PUBLIC_CDN + avatarLoad?.value!)
      setAvatar(avatarLoad)
    }
  }, [data?.data?.totalItems])

  return (
    <Box
      bgcolor="common.white"
      px={2}
      py={5}
      mb={6}
      alignItems="center"
      display="flex"
      sx={(theme) => ({
        borderRadius: theme.spacing(1),
        border: `1px solid ${theme.palette.grey[200]}`,
        minHeight: 128,
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={'space-between'}
        sx={{ width: '100%' }}
      >
        <Stack direction="row" spacing={4}>
          <HBAvatar
            avatarId={avatar?.id}
            partyId={id as string}
            profileUrl={filePath}
            changeWithIcon
            cmsUrl={process.env.NEXT_PUBLIC_CMS_URL}
            onError={(error) => showToast(errorsToString(error), 'error')}
            instance={instance}
            onDeleted={() => {
              setFilePath('')
              setAvatar(undefined)
              refetch()
            }}
            onSuccess={(image: any) => {
              setFilePath(`${process.env.NEXT_PUBLIC_CDN}${image?.value}`)
              showToast(formatMessage(userPageMessages.editAvatarSuccessMessage), 'success')
              setAvatar(image)
              postUserProfile({
                'client-name': 'update-vendor-store',
                'client-version': '1.0.0',
                updateImageEventModel: {
                  image: image?.value || '',
                  type: 'ProfileImage',
                  vendorId:
                    details?.roles?.find((role) => role.type === RoleType.vendor)?.partyRoleId ||
                    undefined,
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
          <Stack direction="row" spacing={12.5}>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="button" color="gray.200">
                {details?.fullName}
              </Typography>
              <AlertElement
                status={details?.isActive ? 'active' : 'inActive'}
                value={
                  details?.isActive
                    ? formatMessage(phrasesMessages.active)
                    : formatMessage(phrasesMessages.deActive)
                }
              />
            </Stack>
            {details?.roles?.map((role, index) => (
              <Stack spacing={2} key={index} sx={{ alignItems: 'center' }}>
                <Typography variant="button" color={'text.secondary'}>
                  {role.typeTitle}
                </Typography>
                <AlertElement
                  status={
                    role.stateCode == '3' ? 'active' : role.stateCode == '2' ? 'inActive' : 'draft'
                  }
                  value={role.stateNama || ''}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
        <HBButton variant="outlined" color="primary" onClick={() => router.replace('/users')}>
          {formatMessage(phrasesMessages.back)}
        </HBButton>
      </Stack>
    </Box>
  )
}

import {
  GetPartySocialMediaQueryResult,
  useGetAdminIdrRolesByPartyIdQuery,
  usePutAdminIdrRolesByIdSocialMediaMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import userPageMessages from '../../../UserPage.messages'
import SocialForm from './SocialForm'
import SocialMediaGrid from './SocialMediaGrid'

export type UserSocialType = {
  instagram?: string
  linkedIn?: string
  partyRoleId: { value: string; title: string }
  whatsApp?: string
}

export type UserSocialMediaType = {
  userId: string
}

export default function SocialMedia({ userId }: UserSocialMediaType) {
  const [isEditOrAdd, setIsEditOrAdd] = useState(false)
  const [isCopy, setIsCopy] = useState(false)
  const { formatMessage } = useIntl()
  const socialFormProviderProps = useForm<UserSocialType>({
    mode: 'all',
  })

  const { data: userRolesData } = useGetAdminIdrRolesByPartyIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      partyId: userId,
    },
    { skip: !userId },
  )

  const userRoles = useMemo(() => {
    return (
      userRolesData?.data?.items?.map((item) => {
        return {
          value: item.id!,
          title: item.typeTitle!,
        }
      }) || []
    )
  }, [userRolesData])

  const [updateSocialMedia] = usePutAdminIdrRolesByIdSocialMediaMutation()

  const handleAddSocial = () => {
    setIsEditOrAdd(true)
  }

  const handleEditSocial = (social: GetPartySocialMediaQueryResult) => {
    socialFormProviderProps.reset({
      instagram: social.instagram || '',
      linkedIn: social.linkedIn || '',
      partyRoleId: userRoles?.find((item) => item.value == social.partyRoleId)!,
      whatsApp: social.whatsApp || '',
    })
    setIsEditOrAdd(true)
  }

  const handleSaveSocial = (callback: () => void) => {
    const model = socialFormProviderProps.getValues()
    updateSocialMedia({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: model.partyRoleId?.value,
      updatePartySocialMediaModel: {
        instagram: model.instagram,
        linkedIn: model.linkedIn,
        whatsApp: model.whatsApp,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        openToast({
          message: formatMessage(userPageMessages.socialMediaUpdated),
          type: 'success',
        })
        setIsEditOrAdd(false)
        setIsCopy(false)
        callback()
      }
    })
  }

  const handleCancel = () => {
    setIsEditOrAdd(false)
    setIsCopy(false)
  }

  const handleCopySocial = (social: UserSocialType) => {
    socialFormProviderProps.reset({
      instagram: social.instagram,
      linkedIn: social.linkedIn,
      partyRoleId: social.partyRoleId,
      whatsApp: social.whatsApp,
    })
    setIsEditOrAdd(true)
    setIsCopy(true)
  }

  return (
    <HBForm formProviderProps={socialFormProviderProps} onSubmit={() => {}}>
      <Box>
        <SocialMediaGrid
          onAdd={handleAddSocial}
          onEdit={handleEditSocial}
          onSave={handleSaveSocial}
          onCancel={handleCancel}
          onCopy={handleCopySocial}
        />
        <SocialForm disabled={!isEditOrAdd} isCopy={isCopy} userRoles={userRoles} />
      </Box>
    </HBForm>
  )
}

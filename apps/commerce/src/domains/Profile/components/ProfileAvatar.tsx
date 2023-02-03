import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import instance from '@hasty-bazar-commerce/core/handler'
import { useGetWebCmsContentsByEntityTypeIdAndEntityIdQuery } from '@hasty-bazar-commerce/services/cmsApi.generated'
import { UserAvatarSubjectFuncs } from '@hasty-bazar-commerce/subjects/UserAvatarSubject'
import { HBAvatar, HBToast } from '@hasty-bazar/core'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ShowTostType } from '../addressManagment/AddressManagment'
import profileMessage from '../profile.messages'

const ProfileAvatar = () => {
  const { formatMessage } = useIntl()
  const { data } = useSession()
  const user = data?.user ?? null
  const [filePath, setFilePath] = useState<string>('')
  const [fileId, setFileId] = useState<string>('')
  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })

  const { refetch, data: contents } = useGetWebCmsContentsByEntityTypeIdAndEntityIdQuery(
    {
      ...ApiConstants,
      entityId: user?.partyId!,
      entityTypeId: 3001,
      factor: 'ProfileImage',
    },
    { skip: !user },
  )

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (contents?.data?.items) {
      const tempContents = contents?.data?.items
      const lastFile = contents.data?.items[tempContents.length - 1]
      if (lastFile) {
        setFilePath(`${process.env.NEXT_PUBLIC_CDN}${lastFile.value!}`)
        setFileId(lastFile.id!)
      }
    }
  }, [contents])

  const deleteAvatar = () => {
    setFilePath('')
    setFileId('')
    UserAvatarSubjectFuncs.avatarCreated('')
  }

  return (
    <>
      <HBAvatar
        partyId={user?.partyId ?? ''}
        profileUrl={filePath}
        changeWithIcon
        cmsUrl={process.env.NEXT_PUBLIC_CMS_URL}
        instance={instance}
        avatarId={fileId}
        removePhotoDialogTitle={formatMessage(profileMessage.areYouSureToDeleteProfilePicture)}
        cancelTitle={formatMessage(profileMessage.cancel)}
        deleteTitle={formatMessage(profileMessage.delete)}
        sx={{
          '& img': {
            objectPosition: 'center',
          },
        }}
        // profileProgress={10}
        onError={(error) =>
          setShowToast({
            message: error,
            open: true,
            type: 'error',
          })
        }
        onSuccess={(image: any) => {
          UserAvatarSubjectFuncs.avatarCreated(`${process.env.NEXT_PUBLIC_CDN}${image?.value}`)
          setFilePath(`${process.env.NEXT_PUBLIC_CDN}${image?.value}`)
          setFileId(image.id)
          setShowToast({
            message: formatMessage({ ...profileMessage.avatarEditingWasDoneSuccessfully }),
            open: true,
            type: 'success',
          })
        }}
        onDeleted={deleteAvatar}
      />
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        vertical="top"
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
    </>
  )
}

export default ProfileAvatar

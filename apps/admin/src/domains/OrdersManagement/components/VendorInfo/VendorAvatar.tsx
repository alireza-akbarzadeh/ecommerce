import { FC, useEffect, useState } from 'react'
import { useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBAvatar } from '@hasty-bazar/core'
enum ContentTypeEnums {
  entityTypeId = 3001,
  contentType = 1022002,
  factor = 'ProfileImage',
}
interface IVendorAvatar {
  partyId: string
}
const VendorAvatar: FC<IVendorAvatar> = ({ partyId }) => {
  const [filePath, setFilePath] = useState<string>('')

  const { data } = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      entityId: partyId!,
      entityTypeId: ContentTypeEnums.entityTypeId,
      contentType: ContentTypeEnums.contentType,
      factor: String(ContentTypeEnums.factor),
    },
    { skip: !partyId },
  )
  const path = process.env.NEXT_PUBLIC_CDN!

  useEffect(() => {
    if (data?.data?.totalItems && data.data.totalItems > 0) {
      setFilePath(
        path + (data?.data?.items && data?.data?.items[data?.data?.items?.length - 1]?.value),
      )
    }
  }, [data?.data?.totalItems])

  return (
    <HBAvatar
      sx={{ margin: '0 auto' }}
      partyId={partyId ?? ''}
      profileUrl={filePath}
      cmsUrl={process.env.NEXT_PUBLIC_CMS_URL}
    />
  )
}

export default VendorAvatar

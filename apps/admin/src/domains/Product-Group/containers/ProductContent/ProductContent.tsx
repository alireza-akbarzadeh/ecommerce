import { HBContentForm } from '@hasty-bazar/admin-shared/containers/HBContentForm'
import { ResponseFileUpload } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import { usePutAdminCatalogCategoriesByIdCategoryDefaultImageMutation } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { EntityTypeEnums } from '@hasty-bazar/core'
import React from 'react'

type ProductContentProps = {
  entityId?: string
}
export default function ProductContent({ entityId }: ProductContentProps) {
  const [updateImage] = usePutAdminCatalogCategoriesByIdCategoryDefaultImageMutation()

  const onFileUploaded = (data: ResponseFileUpload, factor?: string, isLoad?: boolean) => {
    if (factor === 'main' && data?.value && !isLoad) {
      updateImage({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id: entityId!,
        setCategoryDefaultImageModel: {
          defaultImage: data?.value,
          imageMetaData: data?.metaData,
        },
      })
    }
  }

  return (
    <HBContentForm
      entityTypeId={EntityTypeEnums.Category}
      entityId={entityId}
      isShowAccordion={false}
      onFileUploaded={onFileUploaded}
    />
  )
}

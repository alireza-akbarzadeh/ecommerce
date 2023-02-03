import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/core'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

type UploadFileProps = {
  menuId: string
  action: string
  handleSave: any
}

const UploadFile = ({ menuId, action, handleSave }: UploadFileProps) => {
  const { setValue, watch, getValues } = useFormContext()

  useEffect(() => {
    if (watch('imageUrl')) {
      if (watch('imageUrl') === 'deleted') {
        handleSave({ ...getValues(), imageUrl: null })
      } else {
        handleSave(getValues())
      }
    }
  }, [watch('imageUrl')])

  return menuId && action === 'edit' ? (
    <HBContentUploader
      entityId={menuId}
      entityTypeId={EntityTypeEnums.Menugroups}
      fileType={ContentTypeEnums.Image}
      title={'upload'}
      showContainer={false}
      showDragButton={false}
      max={1}
      onSuccess={(uploadedData) => {
        if (typeof uploadedData === 'string') {
          setValue('imageUrl', 'deleted')
        } else {
          setValue('imageUrl', uploadedData.value)
        }
      }}
    />
  ) : (
    <></>
  )
}

export default UploadFile

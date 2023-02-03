import { DragEndEvent } from '@dnd-kit/core'
import { HBFileUploader, HBFileUploaderListItemProps } from '@hasty-bazar/admin-shared/containers'
import { HBUploadItemPopUpItem } from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import instance from '@hasty-bazar/admin-shared/core/handler'
import phrasesMessages from '@hasty-bazar/admin-shared/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar/admin-shared/core/translations/validations.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { usePutAdminCatalogCategoriesByIdCategoryDefaultImageMutation } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetContentsByEntityTypeQueryResult,
  useDeleteAdminCmsContentsByIdMutation,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
  usePutAdminCmsContentsByIdMutation,
  usePutAdminCmsContentsUpdateContentsOrderMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { sleep } from '@hasty-bazar/admin-shared/utils/util'
import { HBIconType, openToast } from '@hasty-bazar/core'
import { Box, Modal, SxProps } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { EntityType } from '../../services/cmsApi.generated'
import HBContentUploaderFormMessages from './HBContentUploader.message'
import { PictureSettingModal, VideoSettingModal } from './Modals'
import FullScreenModal from './Modals/FullScreenModal'

enum fileTypeContent {
  Image = ContentTypeEnums.Image,
  Video = ContentTypeEnums.Video,
  Document = ContentTypeEnums.Document,
  Banner = ContentTypeEnums.Banner,
}
export interface ResponseFileUpload {
  id: string
  parentId?: null
  contentType: number
  entityId?: null
  entityTypeId?: null
  title: string
  name: string
  description?: null
  factor?: null
  metaData?: null
  value: string
  order: number
}

const fileTypeIcon = (type: ContentTypeEnums): HBIconType => {
  switch (type) {
    case ContentTypeEnums.Image || ContentTypeEnums.Banner:
      return 'cameraPlus'
    case ContentTypeEnums.Video:
      return 'video'
    case ContentTypeEnums.Document:
      return 'documentInfo'
    default:
      return 'documentInfo'
  }
}

const fileTypeAccept = (type: ContentTypeEnums): string => {
  switch (type) {
    case ContentTypeEnums.Image:
    case ContentTypeEnums.Banner:
      return 'image/*'
    case ContentTypeEnums.Video:
      return 'video/*'
    case ContentTypeEnums.Document:
      return 'document'
    default:
      return '*'
  }
}

export type feedbackProps = {
  show: boolean
  likeCount?: number
  visitorsCount?: number
}

export type HBMultiUploaderProps = {
  entityId: string | undefined
  entityTypeId: EntityTypeEnums
  parentId?: string
  disabled?: boolean
  factor?: string
  onUploaded?: (
    fileDetails: ResponseFileUpload,
    files: HBFileUploaderListItemProps[],
    isLoad?: boolean,
  ) => void
  onSuccess?: (
    fileDetails: ResponseFileUpload | string,
    files?: HBFileUploaderListItemProps[],
  ) => void
  title?: ReactNode
  buttonTitle?: string
  fileType:
    | ContentTypeEnums.Image
    | ContentTypeEnums.Video
    | ContentTypeEnums.Document
    | ContentTypeEnums.Banner
  onChange?: (data: HBFileUploaderListItemProps[]) => void
  onDragend?: (file: GetContentsByEntityTypeQueryResult, event: DragEndEvent) => void
  showContainer?: boolean
  showMoreButton?: boolean
  showDragButton?: boolean
  showSettingButton?: boolean
  showDeleteButton?: boolean
  showFullScreenButton?: boolean
  max?: number
  feedback?: feedbackProps
  sx?: SxProps
}

export default function HBContentUploader({
  entityId = '1',
  entityTypeId = EntityTypeEnums.Section,
  parentId = '',
  factor,
  title = 'test',
  onUploaded,
  onSuccess,
  buttonTitle,
  fileType,
  onDragend,
  disabled,
  onChange,
  showContainer = true,
  showDragButton = true,
  showMoreButton = true,
  showSettingButton = true,
  showDeleteButton = true,
  showFullScreenButton = true,
  max,
  feedback = {
    show: false,
  },
  sx,
}: HBMultiUploaderProps) {
  const { formatMessage } = useIntl()

  const [updateOrders] = usePutAdminCmsContentsUpdateContentsOrderMutation()

  buttonTitle = buttonTitle || formatMessage(HBContentUploaderFormMessages.uploadButtonTitle)

  const popup = [
    {
      icon: 'setting',
      title: formatMessage(phrasesMessages.setting),
      action: 'setting',
      show: showSettingButton,
    },
    {
      icon: 'trash',
      title: formatMessage(phrasesMessages.delete),
      action: 'delete',
      show: showDeleteButton,
    },
    {
      icon: 'windowMaximize',
      title: formatMessage(phrasesMessages.fullScreen),
      action: 'fullScreen',
      show: showFullScreenButton,
    },
  ] as HBUploadItemPopUpItem[]

  const [files, setFiles] = useState<HBFileUploaderListItemProps[]>([])
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [openSettings, setOpenSettings] = useState<false | GetContentsByEntityTypeQueryResult>(
    false,
  )
  const [openFullScreen, setOpenFullScreen] = useState<false | GetContentsByEntityTypeQueryResult>(
    false,
  )
  const { showToast } = useToast()
  const handleCloseSettings = () => setOpenSettings(false)
  const handleCloseFullScreen = () => setOpenFullScreen(false)
  const [updateImages] = usePutAdminCmsContentsByIdMutation()
  const [deleteImages] = useDeleteAdminCmsContentsByIdMutation()

  const [updateImage] = usePutAdminCatalogCategoriesByIdCategoryDefaultImageMutation()

  const { data: { data: { items = [] } = {} } = {}, refetch } =
    useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery(
      {
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        entityId,
        entityTypeId: entityTypeId as unknown as EntityType,
        contentType: fileType,
        factor,
      },
      { skip: !entityId || !entityTypeId },
    )

  useEffect(() => {
    const values: HBFileUploaderListItemProps[] =
      items?.map((item) => {
        return {
          id: item.id!,
          caption: item.name!,
          media: process.env['NEXT_PUBLIC_CDN'] + item.value!,
          order: item.order!,
        }
      }) || []
    setFiles(values!)
    onChange?.(values)
    onUploaded?.(items?.[0] as ResponseFileUpload, values, true)
  }, [items])

  const updateImageHandler = (item: GetContentsByEntityTypeQueryResult) => {
    if (factor === 'main') {
      updateImage({
        'client-name': 'vendor',
        'client-version': '1.0.0',
        id: item?.entityId!,
        setCategoryDefaultImageModel: {
          defaultImage: null,
          imageMetaData: '',
        },
      })
    }
  }

  return (
    <Box sx={sx}>
      <HBFileUploader
        title={title}
        showContainer={showContainer}
        popups={popup}
        uploadButtonIcon={fileTypeIcon(fileType)}
        uploadButtonAcceptType={fileTypeAccept(fileType)}
        uploadButtonTitle={buttonTitle}
        list={files.sort((a, b) => a.order! - b.order!)}
        showMoreButton={showMoreButton}
        showDragButton={showDragButton}
        max={max}
        disabled={disabled}
        feedback={feedback}
        isUploading={isUploading}
        uploadButtonOnUpload={async (media, file) => {
          //TODO: check file size on server
          // if (file.size < 5 * 1024 * 1000) {
          setIsUploading(true)
          const formData = new FormData()
          formData.append('EntityId', entityId)
          formData.append('EntityTypeId', entityTypeId + '')
          formData.append('ParentId', parentId)
          formData.append('Factor', factor || '')
          formData.append('ContentType', String(fileTypeContent[fileType]))
          formData.append('File', file)
          instance
            .post(`${process.env['NEXT_PUBLIC_GATEWAY']}/Admin/CMS/Contents/file`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Accept: '*/*',
              },
            })
            .then((res: any) => {
              const {
                data: { data },
              } = res
              const newFiles = [
                ...files,
                {
                  caption: data.name,
                  id: data.id,
                  media: process.env['NEXT_PUBLIC_CDN'] + data.value,
                  order: data.order,
                },
              ]
              onUploaded?.(data, newFiles)
              onSuccess?.(data, newFiles)
              setFiles(newFiles)
            })
            .catch((err) => {
              if (err.response.status === 400) {
                return showToast(
                  formatMessage(HBContentUploaderFormMessages.fileFormatNotValid),
                  'error',
                )
              }
              return showToast(formatMessage(HBContentUploaderFormMessages.errorInUpload), 'error')
            })
            .finally(() => {
              setIsUploading(false)
              refetch()
            })
          // } else {
          //   openToast({ type: 'error', message: formatMessage(validationsMessages.errorFileSize) })
          // }
        }}
        onDragend={async (event) => {
          await sleep(300)
          const {
            active: { data: { current: { sortable: { items = [] } = {} } = {} } = {} } = {},
          } = event

          if (items.length < 2) {
            return
          }

          const newOrders = items.map((item: any, index: number) => {
            return {
              id: item,
              order: index,
            }
          })

          updateOrders({
            'client-name': 'hasty-bazar-admin',
            'client-version': '1.0.0',
            updateContentOrderModel: {
              parameters: newOrders,
            },
          })
        }}
        onPopupClick={({ action }, { id }) => {
          if (action === 'setting') setOpenSettings(items?.find((item) => item.id === id)!)
          if (action === 'delete') {
            deleteImages({
              'client-name': 'hasty-bazar-admin',
              'client-version': '1.0.0',
              id: String(id),
            })
              .then(() => {
                onSuccess?.('deleted')
                updateImageHandler(items?.find((item) => item.id === id)!)
              })
              .catch(() => {})
              .finally(() => {
                refetch()
              })
          }
          if (action === 'fullScreen') {
            setOpenFullScreen(items?.find((item) => item.id === id)!)
          }
        }}
      />
      <Modal open={!!openSettings} onClose={handleCloseSettings}>
        <>
          {openSettings && fileType === (ContentTypeEnums.Image || ContentTypeEnums.Banner) && (
            <PictureSettingModal
              handleCloseSettings={handleCloseSettings}
              data={openSettings}
              refetch={refetch}
            />
          )}
          {openSettings && fileType === ContentTypeEnums.Video && (
            <VideoSettingModal
              handleCloseSettings={handleCloseSettings}
              data={openSettings}
              refetch={refetch}
            />
          )}
        </>
      </Modal>
      <Modal open={!!openFullScreen} onClose={handleCloseFullScreen}>
        <>
          {openFullScreen && (
            <FullScreenModal
              handleCloseFullScreen={handleCloseFullScreen}
              data={openFullScreen}
              fileType={fileType}
            />
          )}
        </>
      </Modal>
    </Box>
  )
}

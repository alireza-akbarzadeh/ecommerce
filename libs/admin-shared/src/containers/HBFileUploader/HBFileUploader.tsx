import { DragEndEvent } from '@dnd-kit/core'
import { HBClassesType } from '@hasty-bazar/core'
import { Skeleton, Stack } from '@mui/material'
import { useMemo } from 'react'
import { DragAbleList } from './containers/dragAbleList'
import { feedbackProps } from '../HBContentUploader'
import { HBUploadButton, HBUploadButtonProps, HBUploadItem, HBUploadItemProps } from './containers'
import HBFileUploaderContainer, {
  HBFileUploaderContainerProps,
} from './containers/HBFileUploaderContainer'
import HBFileUploaderWithoutContainer from './containers/HBFileUploaderWithoutContainer'

export type HBFileUploaderListItemProps = Omit<
  HBUploadItemProps,
  'popups' | 'dragButtonProps' | 'uploadButtonAcceptType'
>
const classes: HBClassesType<''> = {}

interface HBFileUploaderProps<T>
  extends Omit<HBFileUploaderContainerProps, 'children'>,
    Pick<HBUploadItemProps, 'popups' | 'onPopupClick'>,
    HBUploadButtonProps {
  list: HBFileUploaderListItemProps[]
  onDragend?: (event: DragEndEvent) => void
  showContainer?: boolean
  showMoreButton?: boolean
  showDragButton?: boolean
  disabled?: boolean
  max?: number
  feedback?: feedbackProps
  isUploading: boolean
}

function HBFileUploader<T extends object>({
  title,
  uploadButtonAcceptType,
  uploadButtonIcon,
  uploadButtonTitle,
  uploadButtonOnUpload,
  popups,
  disabled,
  list,
  onDragend,
  onPopupClick,
  showContainer,
  showMoreButton,
  showDragButton,
  max,
  feedback,
  isUploading,
}: HBFileUploaderProps<T>) {
  const DragList = useMemo(
    () => (
      <DragAbleList
        onDragEnd={onDragend}
        items={list}
        wrapperSx={{
          py: 0,
          gap: 4,
        }}
        itemSx={{
          p: 0,
          py: 0,
          px: 0,
        }}
        handle
        renderItem={(item, idx, { ref, listeners }) => (
          <HBUploadItem
            id={item.id}
            text={item.text}
            disabled={disabled}
            media={item.media}
            caption={item.caption}
            popups={popups}
            showMoreButton={showMoreButton}
            showDragButton={showDragButton}
            feedback={feedback}
            dragButtonProps={{
              ...listeners,
              ref,
            }}
            uploadButtonAcceptType={uploadButtonAcceptType}
            onPopupClick={onPopupClick}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    ),
    [list],
  )

  const uploader = (
    <>
      <HBUploadButton
        uploadButtonIcon={uploadButtonIcon}
        uploadButtonTitle={uploadButtonTitle}
        uploadButtonAcceptType={uploadButtonAcceptType}
        uploadButtonOnUpload={uploadButtonOnUpload}
        files={list}
        max={max}
        disabled={disabled}
      />
      <Stack direction="row" gap={4}>
        {DragList}
      </Stack>
      {isUploading && <Skeleton variant="rectangular" width={118} height={118} />}
    </>
  )

  return showContainer ? (
    <HBFileUploaderContainer title={title}>{uploader}</HBFileUploaderContainer>
  ) : (
    <HBFileUploaderWithoutContainer>{uploader}</HBFileUploaderWithoutContainer>
  )
}

export default HBFileUploader

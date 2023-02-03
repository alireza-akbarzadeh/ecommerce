import { HBAdminAccordion } from '@hasty-bazar/admin-shared/components'
import { EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { GetContentsByEntityTypeTagQueryResult } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import React, { FC, ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { ResponseFileUpload } from '../HBContentUploader'
import { ContentForm } from './containers'
import contentFormMessages from './HBContentForm.messages'

export type ContentFormType = {
  entityId?: string
  entityTypeId: EntityTypeEnums
  children?: ReactNode
  disabled?: boolean
  isShowLink?: boolean
  isShowImage?: boolean
  isShowVideo?: boolean
  isShowAccordion?: boolean
  isShowBanner?: boolean
  onFileUploaded?: (data: ResponseFileUpload, factor?: string, isLoad?: boolean) => void
}

export type ContentType = {
  id?: string
  title?: string
  value?: string
  description?: string
  tags?: GetContentsByEntityTypeTagQueryResult[]
}

const HBContentForm: FC<ContentFormType> = ({ isShowAccordion = true, ...props }) => {
  const { formatMessage } = useIntl()
  return isShowAccordion ? (
    <HBAdminAccordion
      title={formatMessage(contentFormMessages.content)}
      disabled={!props?.entityId || props?.disabled}
    >
      <ContentForm isShowAccordion {...props} />
    </HBAdminAccordion>
  ) : (
    <ContentForm isShowAccordion={false} {...props} />
  )
}

export default HBContentForm

import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { EntityTypeEnums } from '@hasty-bazar-commerce/core/enums'
import {
  usePostWebSocialCommentsMutation,
  usePutWebSocialCommentsByIdMutation,
} from '@hasty-bazar-commerce/Service-Enhancers/CommentApi.enhances'
import {
  useGetWebCmsContentsByEntityTypeIdAndEntityIdQuery,
  usePutWebCmsContentsUpdateContentEntityByContentIdMutation,
} from '@hasty-bazar-commerce/services/cmsApi.generated'
import { CommentAttchamentModel } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBDialog, HBForm, openToast } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import { DialogProps, Grid, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import CommentMessages from './Comment.messages'
import CommentForm from './CommentForm'
import CommentTerms from './CommentTerms'

interface ICommentDialog extends Required<Pick<DialogProps, 'onClose'>> {
  entityId: string
  comment?: ICommentModel
  onUpdateComment?: () => void
}

export interface IFileUpload {
  id: string
  value: string
  contentType: number
}

export interface ICommentModel {
  id?: string
  subject?: string | null
  body?: string | null
  attachments?: IFileUpload[]
  rate?: number | null
  recommendationType?: number | null
}

const initialValues = { id: '', body: '', subject: '', attachments: [] }

const CommentDialog: FC<ICommentDialog> = ({
  onClose,
  entityId,
  comment = initialValues,
  onUpdateComment,
}) => {
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const formProvider = useForm<ICommentModel>({ defaultValues: comment, mode: 'all' })
  const { setValue } = formProvider
  const { formatMessage } = useIntl()
  const [CreateCommentMutation, { isLoading }] = usePostWebSocialCommentsMutation()
  const [UpdateCommentMutation, { isLoading: updateIsLoading }] =
    usePutWebSocialCommentsByIdMutation()
  const [PutWebCmsContentsUpdateContent] =
    usePutWebCmsContentsUpdateContentEntityByContentIdMutation()

  const { refetch, data: CommentFiles } = useGetWebCmsContentsByEntityTypeIdAndEntityIdQuery(
    {
      ...ApiConstants,
      entityId: comment?.id ?? '',
      entityTypeId: EntityTypeEnums.Comment,
      factor: 'file',
    },
    { skip: !comment?.id },
  )

  const updateCommentContent = async (contentId: string, entityId: string | undefined) => {
    const payload = await PutWebCmsContentsUpdateContent({
      ...ApiConstants,
      contentId,
      updateContentEntityModel: {
        entityId,
        entityType: EntityTypeEnums.Comment,
      },
    }).unwrap()
    return payload
  }

  useEffect(() => {
    if (comment?.id) {
      refetch()
    }
  }, [comment])

  useEffect(() => {
    if (CommentFiles?.data?.items) {
      setValue(
        'attachments',
        CommentFiles.data.items?.map((item) => {
          return { id: item.id!, value: item.value!, contentType: item.contentType! }
        }),
      )
    }
  }, [CommentFiles])

  const closeSuccessfully = () => {
    openToast({
      message: comment?.id
        ? formatMessage(CommentMessages.updateCommentSuccess)
        : formatMessage(CommentMessages.addCommentSuccess),
      type: 'success',
      vertical: 'top',
    })
    onClose({}, 'backdropClick')
    if (onUpdateComment) onUpdateComment()
  }

  const handleSubmitComment: SubmitHandler<ICommentModel> = async (value) => {
    const { body, subject, rate, recommendationType, attachments = [] } = value
    const commentAttchamentModels: CommentAttchamentModel[] =
      attachments?.map?.((item) => {
        return {
          filePath: item.value,
          fileType: item.contentType,
        }
      }) ?? []

    try {
      if (comment?.id) {
        UpdateCommentMutation({
          ...ApiConstants,
          id: comment.id,
          updateCommentModel: {
            body,
            subject,
            rate: rate ?? 0,
            recommendationType,
            attachmentFileCount: attachments.length,
            commentAttchamentModels,
          },
        })
          .unwrap()
          .then(async () => {
            if (attachments.length) {
              const requests = attachments.map((item) => {
                return updateCommentContent(item.id, comment.id)
              })
              const responses = await Promise.all(requests)
              const error = responses.filter((res) => !res?.success).length
              if (error > 0) {
                openToast({
                  message: formatMessage(CommentMessages.connectionError),
                  type: 'error',
                  vertical: 'top',
                })
              } else {
                closeSuccessfully()
              }
            } else {
              closeSuccessfully()
            }
          })
      } else {
        CreateCommentMutation({
          ...ApiConstants,
          createCommentModel: {
            body,
            subject,
            rate: rate ?? 0,
            recommendationType,
            entityTypeId: 1,
            entityId,
            attachmentFileCount: attachments.length,
            commentAttchamentModels,
          },
        })
          .unwrap()
          .then(async (payload) => {
            if (payload.success) {
              if (attachments.length) {
                const requests = attachments.map((item) => {
                  return updateCommentContent(item.id, payload.data?.id)
                })
                const responses = await Promise.all(requests)
                const error = responses.filter((res) => !res?.success).length
                if (error > 0) {
                  openToast({
                    message: formatMessage(CommentMessages.connectionError),
                    type: 'error',
                    vertical: 'top',
                  })
                } else {
                  closeSuccessfully()
                }
              } else {
                closeSuccessfully()
              }
            }
          })
      }
    } catch {
      return
    }
  }

  return (
    <HBDialog
      contentSx={{ width: { md: 815, sm: '100%', xs: '100%' }, m: '0 auto' }}
      maxWidth="md"
      open
      title={
        <Typography variant="h6" fontWeight={fontWeights.fontWeightBold}>
          <FormattedMessage
            {...CommentMessages[comment?.id ? 'updateCommentTitle' : 'saveCommentTitle']}
          />
        </Typography>
      }
      onClose={(_, reason) => onClose({}, reason)}
      onReject={() => onClose({}, 'backdropClick')}
      onBackdropClick={() => onClose({}, 'backdropClick')}
    >
      <Grid
        container
        justifyContent="space-between"
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
        mt={{ xs: 0, md: 6 }}
        columnGap={4}
        rowGap={2}
        sx={{ maxHeight: '100%', overflow: 'hidden' }}
      >
        <Grid item xs={12} sm={12} md={6.5}>
          <HBForm<ICommentModel> formProviderProps={formProvider} onSubmit={handleSubmitComment}>
            <CommentForm isLoading={isLoading || updateIsLoading} />
          </HBForm>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          sx={{
            border: ({ palette }) =>
              breakpointDownMd ? 'unset' : `1px solid ${palette.grey[300]}`,
            borderRadius: 1,
            p: { md: 4, xs: 0 },
            overflowY: 'scroll',
          }}
        >
          <CommentTerms />
        </Grid>
      </Grid>
    </HBDialog>
  )
}

export default CommentDialog

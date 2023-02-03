import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBDialog, HBForm } from '@hasty-bazar/core'
import { Box, Stack } from '@mui/material'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ProcessPageMessages from '../../ProcessPage.messages'
import ProcessRelatedMessageDetailForm, {
  ProcessRelatedMessageDetailFormModel,
} from '../ProcessRelatedMessageComponent/ProcessRelatedMessageDetailForm'

interface IProcessRelatedMessageDetailDialog {
  open: boolean
  onClose: () => void
  onSubmit?: (values: ProcessRelatedMessageDetailFormModel) => void
  processRelatedMessageDetailFormModel: ProcessRelatedMessageDetailFormModel
  isAdd: boolean
}

const ProcessRelatedMessageDetailDialog: FC<IProcessRelatedMessageDetailDialog> = ({
  onClose,
  onSubmit,
  open,
  processRelatedMessageDetailFormModel,
  isAdd,
}) => {
  const formProviderProps = useForm<ProcessRelatedMessageDetailFormModel>({
    mode: 'all',
  })
  const handleSubmit = (values: ProcessRelatedMessageDetailFormModel) => {
    onSubmit?.(values)
  }

  const { data: { data: { items: businessTypeData = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueGetAllValuesByBusinessTypeIdQuery({
      'client-name': 'generalData',
      'client-version': '0',
      businessTypeCode: BusinessTypeEnums.IntervalType,
      pageSize: 1000,
    })

  useEffect(() => {
    const {
      messageId,
      messageName,
      messageSubject,
      endDateTime,
      startDateTime,
      interval,
      ...otherData
    } = processRelatedMessageDetailFormModel
    if (isAdd) {
      formProviderProps.reset({})
    }
    setTimeout(() => {
      if (!isAdd) {
        formProviderProps.reset({
          ...otherData,
          interval: businessTypeData?.filter(
            (item) => item.id == (otherData as any).intervalCode,
          )[0] as any,
          startDateTime: startDateTime ? new Date(startDateTime!) : null,
          endDateTime: endDateTime ? new Date(endDateTime!) : null,
          sendStartTime: startDateTime ? new Date(startDateTime!) : null,
          sendEndTime: endDateTime ? new Date(endDateTime!) : null,
          messageId: { name: messageName, id: messageId, subject: messageSubject } as any,
        })
      }
    }, 500)
  }, [isAdd, processRelatedMessageDetailFormModel?.messageId])

  const { formatMessage } = useIntl()

  return (
    <HBDialog
      sx={{ maxWidth: 554, mx: 'auto' }}
      title={formatMessage(ProcessPageMessages.processRelatedMessages)}
      open={open}
      onClose={onClose}
      onReject={onClose}
    >
      <HBForm<ProcessRelatedMessageDetailFormModel>
        formProviderProps={formProviderProps}
        onSubmit={handleSubmit}
        mode="all"
      >
        <Box sx={{ marginTop: 8 }}>
          <Stack spacing={8} alignItems="flex-start">
            <ProcessRelatedMessageDetailForm onClose={onClose} />
          </Stack>
        </Box>
      </HBForm>
    </HBDialog>
  )
}

export default ProcessRelatedMessageDetailDialog

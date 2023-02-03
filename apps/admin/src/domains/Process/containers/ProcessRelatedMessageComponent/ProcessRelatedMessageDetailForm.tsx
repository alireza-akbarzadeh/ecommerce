import HBDatePickerController from '@hasty-bazar/admin-shared/containers/HBDatePickerController'
import HBSelectMultiColumnController from '@hasty-bazar/admin-shared/containers/HBSelectMultiColumnController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { HBTimePickerController } from '@hasty-bazar/admin-shared/containers/HBTimePickerController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import messageTemplatePageMessages from '@hasty-bazar-admin/domains/Message-Template/MessageTemplate.messages'
import {
  AddProcessMessageTemplateSettingModel,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
  useGetAdminGeneralDataMessageTemplatesQuery,
  GetMessageTemplatesQueryResult,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  HBAutocompleteController,
  HBButton,
  HBIcon,
  HBRadioButton,
  HBSelectProps,
} from '@hasty-bazar/core'
import { Box, buttonClasses, Grid, Typography, useTheme } from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import processPageMessages from '../../ProcessPage.messages'
export interface ProcessRelatedMessageDetailFormModel
  extends Omit<AddProcessMessageTemplateSettingModel, 'startDateTime' | 'endDateTime'> {
  startDateTime?: Date | null
  endDateTime?: Date | null
  sendStartTime?: Date | null
  sendEndTime?: Date | null
  messageName?: string
  messageSubject?: string
}
interface ProcessRelatedMessageDetailFormProps {
  onClose: () => void
}
export type SelectBoxOptionsType = HBSelectProps['menuItem']
const ProcessRelatedMessageDetailForm: FC<ProcessRelatedMessageDetailFormProps> = ({ onClose }) => {
  const { spacing, breakpoints } = useTheme()
  const { formatMessage } = useIntl()
  const ref = useRef<HTMLButtonElement>(null)
  const {
    formState: { isValid, touchedFields },
    reset,
    watch,
    setValue,
    getValues,
  } = useFormContext<ProcessRelatedMessageDetailFormModel>()

  const [sendImmediately, setSendImmediately] = useState<boolean>(false)
  const [selectTime, setSelectTime] = useState<boolean>(false)
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>()
  const [page, setPage] = useState(1)
  const [messageTemplatesData, setMessageTemplatesData] = useState<
    GetMessageTemplatesQueryResult[]
  >([])
  const { data, refetch: messageTemplatesRefetch } = useGetAdminGeneralDataMessageTemplatesQuery({
    'client-name': '',
    'client-version': '',
    pageNumber: page,
    pageSize: 50,
    name: searchText,
    filter: 'Name.Contains(--Name)',
  })

  useEffect(() => {
    data?.data?.items && setMessageTemplatesData((prev) => [...prev, ...data?.data?.items!])
  }, [data?.data?.items])

  const { data: { data: { items: businessTypeData = [] } = {} } = {}, isLoading } =
    useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
      'client-name': 'generalData',
      'client-version': '0',
      pageSize: 1000,
    })

  const handleGoBack = () => {
    setIsFirstLoad(false)
    onClose()
  }

  useEffect(() => {
    if (watch('isRepeatable')) {
      setSendImmediately(false)
      setSelectTime(false)
    }
  }, [watch('isRepeatable')])

  useEffect(() => {
    if (watch('messageId')) {
      setSearchText('')
    }
  }, [watch('messageId')])

  useEffect(() => {
    reset({ startTime: null, endTime: null, sendStartTime: null, sendEndTime: null })
  }, [])

  useEffect(() => {
    if (!isFirstLoad) {
      if (getValues('sendImmediately')) {
        setSelectTime(false)
        setSendImmediately(true)
      } else if (!getValues('sendImmediately') && !getValues('isRepeatable')) {
        setSelectTime(true)
      }
    } else {
      setIsFirstLoad(false)
    }
  }, [watch('sendImmediately')])

  const sendImmediatelyOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (checked) {
      setSendImmediately(checked)
      setSelectTime(false)
      setValue('sendImmediately', checked)
      setValue('sendAfterMinute', null)
      setValue('startTime', null)
      setValue('endTime', null)
    }
  }

  const selectTimeOnChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSendImmediately(false)
      setSelectTime(checked)
      setValue('sendImmediately', false)
    }
  }

  return (
    <>
      <Grid container spacing={spacing(6)}>
        <Grid item xs={12} sm={12} md={12}>
          <HBSelectMultiColumnController
            columnDefs={[
              {
                field: 'name',
                width: 410,
                headerName: formatMessage(messageTemplatePageMessages.templateTitle),
                showInChip: true,
              },
              { field: 'id', width: 110, headerName: 'id', hidden: true, isIdField: true },
            ]}
            onInputChange={(_, searchValue) => {
              setMessageTemplatesData([])
              setSearchText(searchValue)
              setPage(1)
              messageTemplatesRefetch()
            }}
            items={messageTemplatesData || []}
            label={formatMessage(processPageMessages.messageTempletName)}
            name="messageId"
            multiple={false}
            totalItems={data?.data?.items?.length || 0}
            pageSize={50}
            formRules={{
              required: true,
            }}
            renderInputProps={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography>{formatMessage(processPageMessages.isRepeatable)}</Typography>
            <HBSwitchController name="isRepeatable" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <HBAutocompleteController
            fieldName="interval"
            options={
              businessTypeData?.filter(
                (item) => item.businessTypeId === BusinessTypeEnums.IntervalType + '',
              ) || []
            }
            label={formatMessage(processPageMessages.interval) + (watch('isRepeatable') ? '*' : '')}
            isOptionEqualToValue={(o, v) => o.code == v.code}
            getOptionLabel={(option) => option.title ?? ''}
            autoCompleteProps={{ disabled: !watch('isRepeatable') }}
            formRules={{ required: watch('isRepeatable') }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBDatePickerController
            name="startDateTime"
            formRules={{
              required: {
                value: watch('isRepeatable')!,
                message: `${formatMessage(processPageMessages.sendStartDate)} ${formatMessage(
                  processPageMessages.isRequired,
                )}`,
              },
            }}
            label={
              formatMessage(processPageMessages.sendStartDate) + (watch('isRepeatable') ? '*' : '')
            }
            disabled={!watch('isRepeatable')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBDatePickerController
            name="endDateTime"
            formRules={{
              required: {
                value: watch('isRepeatable')!,
                message: `${formatMessage(processPageMessages.sendEndDate)} ${formatMessage(
                  processPageMessages.isRequired,
                )}`,
              },
              validate: (value) => {
                return (
                  (!value && !watch('startDateTime')) ||
                  new Date(watch('startDateTime')!) < new Date(value) ||
                  formatMessage(processPageMessages.sendEndDateMustBeGreateThanTheSendStartDate)
                )
              },
            }}
            label={
              formatMessage(processPageMessages.sendEndDate) + (watch('isRepeatable') ? '*' : '')
            }
            minDateTime={new Date(watch('startDateTime')!)}
            disabled={!watch('isRepeatable')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBTimePickerController
            fieldName="sendStartTime"
            label={
              formatMessage(processPageMessages.sendStartTime) + (watch('isRepeatable') ? '*' : '')
            }
            ampm={false}
            disabled={!watch('isRepeatable')}
            formRules={{
              required: watch('isRepeatable'),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBTimePickerController
            fieldName="sendEndTime"
            label={
              formatMessage(processPageMessages.sendEndTime) + (watch('isRepeatable') ? '*' : '')
            }
            ampm={false}
            disabled={!watch('isRepeatable')}
            formRules={{
              required: watch('isRepeatable'),
              validate: (value) => {
                return (
                  (!value &&
                    !watch('startDateTime') &&
                    !watch('sendStartTime') &&
                    !watch('endDateTime')) ||
                  new Date(
                    watch('startDateTime')?.toLocaleDateString() +
                      ' ' +
                      watch('sendStartTime')?.toLocaleTimeString(),
                  ) <
                    new Date(
                      watch('endDateTime')?.toLocaleDateString() +
                        ' ' +
                        value?.toLocaleTimeString(),
                    ) ||
                  formatMessage(processPageMessages.sendEndTimeMustBeGreateThanTheSendStartTime)
                )
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography>{formatMessage(processPageMessages.sendTime)}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <HBRadioButton
                  onChange={sendImmediatelyOnChange}
                  checked={sendImmediately}
                  disabled={watch('isRepeatable')}
                />
                <Typography>{formatMessage(processPageMessages.immediately)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <HBRadioButton
                  onChange={selectTimeOnChange}
                  checked={selectTime}
                  disabled={watch('isRepeatable')}
                />
                <Typography>{formatMessage(processPageMessages.selectTime)}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <HBTextFieldController
            formRules={{
              required: false,
            }}
            name={'sendAfterMinute'}
            label={formatMessage(processPageMessages.timeIntervalAfterCreation)}
            type="number"
            disabled={!selectTime}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBTimePickerController
            fieldName="startTime"
            label={formatMessage(processPageMessages.sendStartTime)}
            ampm={false}
            disabled={!selectTime}
            formRules={{
              required: false,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <HBTimePickerController
            fieldName="endTime"
            label={formatMessage(processPageMessages.sendEndTime)}
            ampm={false}
            disabled={!selectTime}
            formRules={{
              required: false,
              validate: (value) => {
                return (
                  (!value && !watch('startTime')) ||
                  new Date(watch('startTime')!) < new Date(value) ||
                  formatMessage(processPageMessages.sendEndTimeMustBeGreateThanTheSendStartTime)
                )
              },
            }}
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="space-between" mt={8} width={'100%'}>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'small'}
          variant="outlined"
          onClick={handleGoBack}
          startIcon={<HBIcon type="angleRight" />}
          sx={{ minWidth: 100 }}
        >
          {formatMessage(phrasesMessages.back)}
        </HBButton>
        <HBButton
          size={breakpoints.down('sm') ? 'medium' : 'small'}
          sx={() => ({
            minWidth: 100,
            mx: 1,
            [`&.${buttonClasses.disabled}`]: {
              bgcolor: 'primary.main',
              opacity: '0.3',
              color: 'background.paper',
            },
          })}
          ref={ref}
          type="submit"
          disabled={!isValid}
          color="primary"
        >
          {formatMessage(phrasesMessages.save)}
        </HBButton>
      </Box>
    </>
  )
}

export default ProcessRelatedMessageDetailForm

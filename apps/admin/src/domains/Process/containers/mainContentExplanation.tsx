import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import { HBHistoryExplanation } from '@hasty-bazar/admin-shared/containers/HBHistoryExplanation'
import { ProductRulesPage } from '@hasty-bazar-admin/domains/Product-Rules'
import {
  PlatformType,
  ProcessMethodType,
  UpdateProcessModel,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { usePutAdminGeneralDataProcessesByIdMutation } from '../generalDataApi.enhanced'
import processPageMessages from '../ProcessPage.messages'
import ProcessDetail from './ProcessDetail'
import ProcessRelatedMessage from './ProcessRelatedMessage'

type MainContentExplanationProps = {}
const MainContentExplanation: FC<MainContentExplanationProps> = () => {
  const { formatMessage } = useIntl()
  const [expandedItem, setExpandItems] = useState<boolean>(true)
  const [expandedRuleItem, setExpandRuleItems] = useState<boolean>(true)
  const formProviderProps = useForm<UpdateProcessFormModel>({
    mode: 'all',
  })
  const router = useRouter()
  const id = router.query.id?.[0]
  const [updateProcesses] = usePutAdminGeneralDataProcessesByIdMutation()

  interface UpdateProcessFormModel extends UpdateProcessModel {
    processMethodTypeCode: number
    platformTypeCode: number
  }

  const handleSubmit = async (values: UpdateProcessFormModel) => {
    updateProcesses({
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      id: id!,
      updateProcessModel: {
        description: values.description,
        platformType: Number(values.platformTypeCode) as PlatformType,
        processMethodType: Number(values.processMethodTypeCode) as ProcessMethodType,
        eventName: values.eventName,
        hasSingleRule: values.hasSingleRule,
        parameters: values.parameters,
        title: values.title,
        statusId: values.statusId,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        openToast({ type: 'success', message: formatMessage(processPageMessages.successEdit) })
      }
    })
  }

  return (
    <>
      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={10}
        sx={{
          borderRadius: 4,
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <HBForm<UpdateProcessFormModel>
          mode="all"
          onSubmit={handleSubmit}
          formProviderProps={formProviderProps}
        >
          {<ProcessDetail />}
        </HBForm>
      </Box>
      <HBExplanation
        expanded={expandedItem && !!id}
        disabled={!id}
        onChange={(_, expandedItem) => {
          setExpandItems(expandedItem)
        }}
        sx={{ background: 'common.white' }}
        summary={
          <HBExplanationSummary
            title={formatMessage(processPageMessages.processRelatedMessages)}
            icon={'envelopeOpen'}
          />
        }
        detail={<ProcessRelatedMessage />}
      />
      <HBExplanation
        expanded={expandedRuleItem && !!id}
        disabled={!id}
        onChange={(_, expandedItem) => {
          setExpandRuleItems(expandedItem)
        }}
        sx={{ background: 'common.white' }}
        summary={
          <HBExplanationSummary
            title={formatMessage(processPageMessages.ruleRelatedMessages)}
            icon={'balanceScale'}
          />
        }
        detail={
          <ProductRulesPage
            showBreadcrumbs={false}
            processEventName={
              formProviderProps.watch('eventName')
                ? formProviderProps.watch('eventName')?.toString()
                : undefined
            }
          />
        }
      />
      <HBHistoryExplanation detail={<Box />} hidden />
    </>
  )
}
export default MainContentExplanation

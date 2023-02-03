import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetIconCategoryTypesResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { checkPositiveIntgerNumber } from '@hasty-bazar/admin-shared/utils/checkPositiveNumber'
import { HBTextFieldController } from '@hasty-bazar/auth'
import {
  HBAutocompleteController,
  HBButton,
  HBClassesType,
  HBDialog,
  HBIcon,
} from '@hasty-bazar/core'
import {
  useGetAdminGeneralDataSurveyGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminGeneralDataSurveyGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminGeneralDataSurveyChangeStateMutation as useChangeState,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { Box, Grid, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import surveyMessages from '../../survey.messages'
import { AnswerDisplayType, AnswerType, SelectBoxOptionsType } from '../../surveyAddEdit'

type SurveyQuestionsFormItemsTypes = {
  iconCategoryData?: GetIconCategoryTypesResult[] | null
  answerDisplayTypeCodes: SelectBoxOptionsType
  answerTypeCodes: SelectBoxOptionsType
  usageTypeCodes: SelectBoxOptionsType
  refetchSurvey: () => void
}

type HBPageClassNames = 'gridSection'

const classes: HBClassesType<HBPageClassNames> = {
  gridSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 },
}

const SurveyQuestionsFormItems = (props: SurveyQuestionsFormItemsTypes) => {
  const {
    iconCategoryData,
    answerDisplayTypeCodes,
    answerTypeCodes,
    usageTypeCodes,
    refetchSurvey,
  } = props
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id?.[0] || ''
  const ref = useRef<HTMLButtonElement>(null)
  const {
    formState: { isValid, isDirty, touchedFields },
    watch,
    setValue,
    getValues,
  } = useFormContext()

  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  const handleSave = () => {
    if (isValid) {
      ref.current?.click()
    }
    setOpenConfirmModal(false)
  }

  const handleCancel = () => {
    setOpenConfirmModal(false)
    router.back()
  }

  const handleGoBack = () => {
    if (isEmpty(touchedFields)) {
      router.replace('/survey')
    } else {
      setOpenConfirmModal(true)
    }
  }

  return (
    <>
      <Box sx={classes.gridSection} mb={4}>
        <Typography variant="h5" sx={{}} display="flex" gap={2}>
          <HBIcon type="fileExclamation" />
          {formatMessage(surveyMessages.surveyQuestions)}
        </Typography>
        <HBWorkflow
          entityId={id!}
          machineCode={StateMachineCode.Survey}
          useGetStateList={useGetStateList}
          useGetState={useGetStateInfo}
          useChangeState={useChangeState}
          stateCode={getValues('stateCode')}
          onChangeState={refetchSurvey}
          factor={'1'}
        />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController
            label={formatMessage(surveyMessages.type)}
            fieldName="answerType"
            isOptionEqualToValue={(o, v) => o.value === v}
            getOptionLabel={(option) => `${option.title}`}
            options={answerTypeCodes}
            formRules={{ required: true }}
            required
            autoCompleteProps={{
              blurOnSelect: true,
              onChange: (e, newValue) => {
                setValue('answerType', newValue)
                setValue('answerDisplayType', '')
                setValue('iconCategoryTypeId', '')
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <HBTextFieldController
            name={'name'}
            formRules={{ required: true }}
            label={formatMessage(surveyMessages.title)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController
            label={formatMessage(surveyMessages.displayType)}
            fieldName="answerDisplayType"
            isOptionEqualToValue={(o, v) => o.value === v}
            getOptionLabel={(option) => `${option.title}`}
            options={
              (watch('answerType')?.value || watch('answerType')) === AnswerType.Description
                ? answerDisplayTypeCodes.filter(
                    (item) => (item.value || item) === AnswerDisplayType.Text,
                  )
                : answerDisplayTypeCodes.filter(
                    (item) => (item.value || item) !== AnswerDisplayType.Text,
                  )
            }
            formRules={{ required: true }}
            required
            autoCompleteProps={{
              blurOnSelect: true,
              onChange: (e, newValue) => {
                setValue('answerDisplayType', newValue)
                setValue('iconCategoryTypeId', '')
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController
            label={formatMessage(surveyMessages.iconCategoryType)}
            fieldName="iconCategoryTypeId"
            isOptionEqualToValue={(o, v) => o.id === v}
            getOptionLabel={(option) => `${option.name}`}
            options={iconCategoryData || []}
            formRules={{ required: false }}
            autoCompleteProps={{
              blurOnSelect: true,
              disabled:
                (watch('answerDisplayType')?.value || watch('answerDisplayType')) !==
                AnswerDisplayType.Icon,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController
            label={formatMessage(surveyMessages.howToUse)}
            fieldName="usageType"
            isOptionEqualToValue={(o, v) => o.value === v}
            getOptionLabel={(option) => `${option.title}`}
            options={usageTypeCodes}
            formRules={{ required: true }}
            required
            autoCompleteProps={{
              blurOnSelect: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            name={'minCountSelectCharacter'}
            formRules={{ required: true }}
            label={formatMessage(surveyMessages.minNumberOfCharacters)}
            type="number"
            onInput={checkPositiveIntgerNumber}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            name={'maxCountSelectCharacter'}
            formRules={{ required: true }}
            label={formatMessage(surveyMessages.maxNumberOfCharacters)}
            type="number"
            onInput={checkPositiveIntgerNumber}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="space-between" mt={8}>
          <HBButton variant="outlined" onClick={handleGoBack}>
            {formatMessage(phrasesMessages.back)}
          </HBButton>
          <HBButton ref={ref} type="submit" disabled={!isValid || !isDirty} color="primary">
            {formatMessage(phrasesMessages.confirm)}
          </HBButton>
        </Grid>
      </Grid>
      <HBDialog
        title={formatMessage(phrasesMessages.saveSuccess)}
        content={formatMessage(surveyMessages.surveyLikeToSave)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}

export default SurveyQuestionsFormItems

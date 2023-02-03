import HBDateTimePickerController from '@hasty-bazar/admin-shared/containers/HBDateTimePickerController'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { widgetTypeEnums } from '@hasty-bazar/admin-shared/core/enums/WidgetType'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  CreateSectionModel,
  GetWidgetsQueryResult,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import {
  HBAutocompleteController,
  HBClassesType,
  HBFormItemTextField,
  HBIcon,
  HBSelectProps,
  openToast,
} from '@hasty-bazar/core'
import { Box, Grid, Tooltip, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { usePostAdminCmsPagesSectionsActivateMutation } from '../../cmsApi.generated.enhanced'
import ContentManagementPageMessages from '../../ContentManagementPage.messages'
import useFetchData from '../../hooks/useFetchData'
import SectionContainerDetailsFormMessages from './SectionContainerDetailsFormItem.messages'

type HBPageClassNames = 'fullWidth' | 'container'
const classes: HBClassesType<HBPageClassNames> = {
  fullWidth: {
    width: '100%',
  },
  container: ({ spacing }) => ({ borderRadius: spacing(1) }),
}
export type SelectBoxOptionsType = HBSelectProps['menuItem']

type SectionProps = {
  stateCode: string
  refetch: () => void
  widgetItems: GetWidgetsQueryResult[] | null
  widgetAutoCompleteItems: SelectBoxOptionsType
  outputQueryTypeItems: SelectBoxOptionsType
  formProvider: UseFormReturn
  pagePartFormProvider: UseFormReturn
}
export default function SectionContainerDetailsFormItem({
  widgetItems,
  widgetAutoCompleteItems,
  outputQueryTypeItems,
  formProvider,
  pagePartFormProvider,
}: SectionProps) {
  const { formatMessage } = useIntl()
  const { query: { action, sectionId, pageId } = {} } = useRouter()
  const [disabled, setDisabled] = useState(true)
  const [disabledOutputQueryType, setDisabledOutputQueryType] = useState(true)
  const { watch, setValue, getValues } = formProvider
  const { expandedSection } = useFetchData()
  const [platFormTypes, setPlatFormTypes] = useState<GetBusinessTypeValuesQueryResult[]>([])

  const { data: { data: { items: PageDisplayType = [] } = {} } = {} } =
    useGetAdminGeneralDataBusinessTypeValueByBusinessTypeByBusinessTypeQuery({
      'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.AdminApi',
      'client-version': '1.0.1.100',
      businessType: BusinessTypeEnums.PageDisplayType,
    })

  useEffect(() => {
    setPlatFormTypes(pagePartFormProvider.getValues('platformTypes'))
  }, [pagePartFormProvider.watch('platformTypes')])

  useEffect(() => {
    if (watch('isActive')) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [action, watch('isActive')])

  useEffect(() => {
    const widget = widgetItems?.filter(
      (item) => item.id?.toString() === watch('widgetId')?.value?.toString(),
    )[0]
    if (widget?.widgetTypeCode === widgetTypeEnums.Business) {
      setDisabledOutputQueryType(false)
    } else if (widget?.widgetTypeCode !== widgetTypeEnums.Business && !!widget) {
      setDisabledOutputQueryType(true)
      setValue('outputQueryType', null)
    }
  }, [widgetItems?.length, watch('widgetId')])

  const [updateSectionsActivate] = usePostAdminCmsPagesSectionsActivateMutation()

  return (
    <Box
      py={6}
      px={4}
      display="flex"
      bgcolor="common.white"
      sx={classes.container}
      justifyContent="space-between"
    >
      <Grid container spacing={4} rowSpacing={6}>
        <Grid
          item
          xs={12}
          md={12}
          container
          alignItems={'flex-start'}
          justifyContent={'space-between'}
        >
          <Typography variant="h5" mb={8} color="text.primary">
            <HBIcon type="documentInfo" />
            {formatMessage(SectionContainerDetailsFormMessages.pageTitle)}
          </Typography>
          <Grid>
            <Tooltip
              title={formatMessage(
                SectionContainerDetailsFormMessages.toApplyChangesDisableTheSection,
              )}
              placement="top"
            >
              <Grid container>
                <Typography sx={{ mx: 2 }}>
                  {formatMessage(SectionContainerDetailsFormMessages.isActive)}
                </Typography>
                <HBSwitchController
                  name={'isActive' as keyof CreateSectionModel}
                  onChange={(e, value) => {
                    if (expandedSection && action === 'edit') {
                      updateSectionsActivate({
                        'client-name': 'cms',
                        'client-version': '1',
                        activeSectionModel: {
                          isActive: value,
                          pageId: pageId as string,
                          sectionId: sectionId as string,
                        },
                      }).then((res: any) => {
                        if (res && res?.data?.success) {
                          openToast({
                            type: 'success',
                            message: formatMessage(phrasesMessages.successUpdate),
                          })
                        }
                      })
                    }
                  }}
                />
              </Grid>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <HBFormItemTextField
            disabled={disabled}
            formName={'name' as keyof CreateSectionModel}
            label={formatMessage(SectionContainerDetailsFormMessages.title)}
            rules={{
              required: true,
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: '',
                })}`,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBDateTimePickerController
            inputProps={{ sx: { width: '100%' } }}
            disabled={disabled}
            label={formatMessage(SectionContainerDetailsFormMessages.displayStartDate)}
            name={'displayStartDate' as keyof CreateSectionModel}
            minDateTime={new Date()}
            formRules={{
              validate: (value) => {
                if (
                  watch('displayEndDate') &&
                  Date.parse(watch('displayEndDate')) &&
                  !!Date.parse(value)
                ) {
                  return (
                    !value ||
                    (!value && !watch('displayEndDate')) ||
                    new Date(watch('displayEndDate')!) > new Date(value) ||
                    formatMessage(
                      SectionContainerDetailsFormMessages.displayStartDateMustBeLessThanTheDisplayEndDate,
                    )
                  )
                }
                return (
                  !value ||
                  !!Date.parse(value) ||
                  `${formatMessage(validationsMessages.invalidDate)}`
                )
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBDateTimePickerController
            inputProps={{ sx: { width: '100%' } }}
            disabled={disabled}
            label={formatMessage(SectionContainerDetailsFormMessages.displayEndDate)}
            name={'displayEndDate' as keyof CreateSectionModel}
            minDateTime={getValues('displayStartDate')}
            formRules={{
              validate: (value) => {
                if (
                  watch('displayStartDate') &&
                  Date.parse(watch('displayStartDate')) &&
                  !!Date.parse(value)
                ) {
                  return (
                    !value ||
                    (!value && !watch('displayStartDate')) ||
                    new Date(watch('displayStartDate')!) < new Date(value) ||
                    formatMessage(
                      SectionContainerDetailsFormMessages.displayEndDateMustBeGreateThanTheDisplayStartDate,
                    )
                  )
                }
                return (
                  !value ||
                  !!Date.parse(value) ||
                  `${formatMessage(validationsMessages.invalidDate)}`
                )
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBFormItemTextField
            disabled={disabled}
            formName={'rowIndex' as keyof CreateSectionModel}
            label={formatMessage(SectionContainerDetailsFormMessages.rowIndex)}
            rules={{
              required: true,
            }}
            type="number"
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBFormItemTextField
            disabled={disabled}
            formName={'displaySortOrder' as keyof CreateSectionModel}
            label={formatMessage(SectionContainerDetailsFormMessages.displaySortOrder)}
            rules={{
              required: true,
            }}
            type="number"
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBFormItemTextField
            disabled={disabled}
            formName={'columnDistance' as keyof CreateSectionModel}
            label={formatMessage(SectionContainerDetailsFormMessages.columnSpacing)}
            rules={{
              required: true,
            }}
            type="number"
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBTextFieldController
            disabled={disabled}
            name={'columnIndex' as keyof CreateSectionModel}
            label={formatMessage(SectionContainerDetailsFormMessages.columnIndex)}
            formRules={{
              required: true,
              max: {
                value: 40,
                message: formatMessage(SectionContainerDetailsFormMessages.mustBeSmallerThan40),
              },
            }}
            type="number"
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController
            label={formatMessage(SectionContainerDetailsFormMessages.widget)}
            fieldName={'widgetId' as keyof CreateSectionModel}
            isOptionEqualToValue={(o, v) => o.value?.toString() === v.value?.toString()}
            getOptionLabel={(option) => `${option.title}`}
            options={widgetAutoCompleteItems}
            controllerProps={{
              rules: { required: true },
            }}
            autoCompleteProps={{
              disabled,
            }}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController
            label={formatMessage(SectionContainerDetailsFormMessages.outputQueryType)}
            fieldName={'outputQueryType' as keyof CreateSectionModel}
            isOptionEqualToValue={(o, v) => o.value?.toString() === v.value?.toString()}
            getOptionLabel={(option) => `${option.title}`}
            options={outputQueryTypeItems}
            controllerProps={{
              rules: { required: !disabledOutputQueryType },
            }}
            required={!disabledOutputQueryType}
            autoCompleteProps={{
              disabled: disabledOutputQueryType || disabled,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <HBAutocompleteController
            label={formatMessage(ContentManagementPageMessages.platform)}
            fieldName="platformTypes"
            isOptionEqualToValue={(o, v) => o.id?.toString() === v.id?.toString()}
            getOptionLabel={(option) => `${option.title}`}
            options={platFormTypes! ?? []}
            controllerProps={{
              rules: { required: true },
            }}
            required
            autoCompleteProps={{
              multiple: true,
            }}
            disabled={disabled}
          />
        </Grid>
        {watch('outputQueryType')?.value === 1035002 ||
        watch('outputQueryType')?.value === 1035003 ? (
          <Grid item xs={12} md={4}>
            <HBAutocompleteController
              label={formatMessage(SectionContainerDetailsFormMessages.pageDisplayType)}
              fieldName={'pageDisplayType' as keyof CreateSectionModel}
              isOptionEqualToValue={(o, v) => o.id?.toString() === v.id?.toString()}
              getOptionLabel={(option) => `${option.title}`}
              options={PageDisplayType!}
              controllerProps={{
                rules: { required: true },
              }}
              autoCompleteProps={{
                disabled,
              }}
              required
            />
          </Grid>
        ) : null}
        <Grid item xs={12} md={4} container>
          <Typography sx={{ mx: 2 }}>
            {formatMessage(SectionContainerDetailsFormMessages.isClosable)}
          </Typography>
          <HBSwitchController name={'isClosable' as keyof CreateSectionModel} disabled={disabled} />
        </Grid>
      </Grid>
    </Box>
  )
}

import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { GetBusinessTypeValuesQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBAutocompleteController, HBSelectProps, openToast } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { usePostAdminCmsPagesPagePartsActivateMutation } from '../../cmsApi.generated.enhanced'
import ContentManagementPageMessages from '../../ContentManagementPage.messages'
import useFetchData from '../../hooks/useFetchData'
import SectionContainerDetailsFormMessages from '../HBSectionContainerDetails/SectionContainerDetailsFormItem.messages'

export type SelectBoxOptionsType = HBSelectProps['menuItem']
type PagePartFormItem = {
  pageFormProvider: UseFormReturn
}

export default function HBPagePartDetails({ pageFormProvider }: PagePartFormItem) {
  const { query: { pagePartId, pageId } = {}, push } = useRouter()
  const { formatMessage } = useIntl()
  const [platFormTypes, setPlatFormTypes] = useState<GetBusinessTypeValuesQueryResult[]>([])
  const { expandedPagePart } = useFetchData()
  const [updatePagePartsActivate] = usePostAdminCmsPagesPagePartsActivateMutation()

  useEffect(() => {
    setPlatFormTypes(pageFormProvider.getValues('platformTypes'))
  }, [pageFormProvider.watch('platformTypes')])

  return (
    <Box
      py={6}
      px={8}
      display="flex"
      bgcolor="common.white"
      justifyContent="space-between"
      mb={2}
      borderRadius={4}
    >
      <Grid container spacing={4} rowSpacing={6}>
        <Grid item xs={12} container spacing={4} rowSpacing={6} alignItems={'center'}>
          <Grid item xs={12} md={4}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                validate: (value) =>
                  !!value.trim() ||
                  `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(ContentManagementPageMessages.pagePartTitle),
                  })}`,
              }}
              label={formatMessage(ContentManagementPageMessages.pagePartTitle)}
              name={'name'}
              disabled={!expandedPagePart}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HBAutocompleteController
              label={formatMessage(ContentManagementPageMessages.platform)}
              fieldName="platformTypes"
              isOptionEqualToValue={(o, v) => o.id == v.id}
              getOptionLabel={(option) => `${option.title}`}
              options={platFormTypes ?? []}
              controllerProps={{
                rules: { required: true },
              }}
              required
              autoCompleteProps={{
                multiple: true,
                disabled: !expandedPagePart,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                validate: (value) =>
                  !!value.trim() ||
                  `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(ContentManagementPageMessages.originName),
                  })}`,
              }}
              label={formatMessage(ContentManagementPageMessages.originName)}
              name={'originName'}
              disabled={!expandedPagePart}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HBTextFieldController
              required
              type="number"
              formRules={{
                required: true,
              }}
              label={formatMessage(ContentManagementPageMessages.displaySortOrder)}
              name={'sort'}
              disabled={!expandedPagePart}
            />
          </Grid>
          <Grid item xs={12} md={4} container>
            <Typography sx={{ mx: 2 }}>
              {formatMessage(SectionContainerDetailsFormMessages.isActive)}
            </Typography>
            <HBSwitchController
              name={'isActive'}
              disabled={!expandedPagePart}
              onChange={(event, value) => {
                updatePagePartsActivate({
                  'client-name': 'cms',
                  'client-version': '1',
                  activePagePartModel: {
                    isActive: value,
                    pageId: pageId as string,
                    pagePartId: pagePartId as string,
                  },
                }).then((res: any) => {
                  if (res && res?.data?.success) {
                    openToast({
                      type: 'success',
                      message: formatMessage(phrasesMessages.successUpdate),
                    })
                  }
                })
              }}
            />
          </Grid>
          <Grid item xs={12} md={4} container>
            <Typography sx={{ mx: 2 }}>
              {formatMessage(SectionContainerDetailsFormMessages.expandable)}
            </Typography>
            <HBSwitchController name={'isExtendable'} disabled={!expandedPagePart} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

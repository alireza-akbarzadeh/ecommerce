import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import {
  useGetAdminCmsPagesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery,
  useGetAdminCmsPagesGetTransitionByEntityIdAndStateMachineCodeFactorQuery,
  usePostAdminCmsPagesChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBAutocompleteController, HBSelectProps } from '@hasty-bazar/core'
import { Box, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import ContentManagementPageMessages from '../../ContentManagementPage.messages'
import useFetchData from '../../hooks/useFetchData'
import SectionContainerDetailsFormMessages from '../HBSectionContainerDetails/SectionContainerDetailsFormItem.messages'

export type SelectBoxOptionsType = HBSelectProps['menuItem']
type pageItemProps = {
  stateCode: string
  refetch: () => void
}

export default function PageInformationFormItem({ refetch, stateCode }: pageItemProps) {
  const { formatMessage } = useIntl()
  const { query: { pageId, pagePartId, sectionId, action } = {} } = useRouter()
  const { platFormTypes, expandedPage, templatePages } = useFetchData()
  const refWrapper = useRef<HTMLDivElement>()

  useEffect(() => {
    if (pageId) {
      refWrapper?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [pageId, pagePartId, sectionId, action])

  return (
    <Box
      py={6}
      px={8}
      display="flex"
      bgcolor="common.white"
      justifyContent="space-between"
      mb={2}
      borderRadius={4}
      ref={refWrapper}
    >
      <Grid container spacing={4} rowSpacing={6}>
        <Box sx={{ flexGrow: 1 }} />
        {pageId && (
          <HBWorkflow
            factor="1"
            entityId={pageId as string}
            machineCode={StateMachineCode.ContentArrangement}
            useGetStateList={
              useGetAdminCmsPagesGetTransitionByEntityIdAndStateMachineCodeFactorQuery
            }
            useGetState={useGetAdminCmsPagesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery}
            useChangeState={usePostAdminCmsPagesChangeStateMutation}
            stateCode={stateCode}
            onChangeState={refetch}
            disabled={!expandedPage}
          />
        )}
        <Grid item xs={12} container spacing={4} rowSpacing={6} alignItems={'center'}>
          <Grid item xs={12} md={4}>
            <HBTextFieldController
              required
              formRules={{
                required: true,
                validate: (value) =>
                  !!value.trim() ||
                  `${formatMessage(validationsMessages.isRequired, {
                    msg: formatMessage(ContentManagementPageMessages.pageInformationTitle),
                  })}`,
              }}
              label={formatMessage(ContentManagementPageMessages.pageInformationTitle)}
              name={'name'}
              disabled={!expandedPage}
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
              disabled={!expandedPage}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HBAutocompleteController
              label={formatMessage(ContentManagementPageMessages.platform)}
              fieldName="platformTypes"
              isOptionEqualToValue={(o, v) => o.id == v.id}
              getOptionLabel={(option) => `${option.title}`}
              options={platFormTypes!}
              controllerProps={{
                rules: { required: true },
              }}
              required
              autoCompleteProps={{
                multiple: true,
                disabled: !expandedPage,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HBTextFieldController
              formRules={{
                required: false,
              }}
              label={formatMessage(ContentManagementPageMessages.pageInformationHeaderTitle)}
              name={'pageTitle'}
              disabled={!expandedPage}
            />
          </Grid>
          <Grid item xs={12} md={4} container>
            <Typography sx={{ mx: 2 }}>
              {formatMessage(SectionContainerDetailsFormMessages.isActive)}
            </Typography>
            <HBSwitchController name={'isActive'} disabled={!expandedPage} />
          </Grid>
          <Grid item xs={12} md={4} container>
            <Typography sx={{ mx: 2 }}>
              {formatMessage(SectionContainerDetailsFormMessages.expandable)}
            </Typography>
            <HBSwitchController name={'isExtendable'} disabled={!expandedPage} />
          </Grid>
          <Grid item xs={12} md={12}>
            <HBTextFieldController
              formRules={{
                required: false,
              }}
              label={formatMessage(ContentManagementPageMessages.pageInformationDescription)}
              name={'description'}
              disabled={!expandedPage}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <HBAutocompleteController
              label={formatMessage(ContentManagementPageMessages.templatePage)}
              fieldName="templatePageId"
              isOptionEqualToValue={(o, v) => o.id == v.id}
              getOptionLabel={(option) => `${option.name}`}
              options={templatePages!}
              controllerProps={{
                rules: { required: action === 'create' },
              }}
              required={action === 'create'}
              autoCompleteProps={{
                disabled: !expandedPage || action !== 'create',
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

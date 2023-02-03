import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import sidebarMessages from '@hasty-bazar-admin/core/translations/sidebar.messages'
import {
  useGetAdminCatalogProductRulesByIdQuery,
  useGetAdminCatalogProductRulesGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminCatalogProductRulesGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
  usePostAdminCatalogProductRulesChangeStateMutation,
  usePostAdminCatalogProductRulesMutation,
  usePutAdminCatalogProductRulesByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { useGetAdminGeneralDataProcessesGetAllForTreeQuery } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBClassesType, HBForm, openToast } from '@hasty-bazar/core'
import { Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ProductRulesAddEditForm } from './container'
import History from './container/history'
import {
  default as ProductRulesMessages,
  default as productRulesMessages,
} from './ProductRules.messages'
import { convertDataTree } from './utils/convertDataTree'
type HBPageClassNames = 'mainContainer'
const classes: HBClassesType<HBPageClassNames> = {
  mainContainer: {
    width: '100%',
    minHeight: 'calc(100vh - 188px)',
    display: 'flex',
    flexDirection: 'column',
  },
}
export interface IProductRulesAddEditFormType {
  id?: string | null | undefined
  processEventName?: string | null | undefined
  name?: string | null | undefined
  description?: string | null | undefined
}

const ProductRulesAddEditPage: FC = () => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const ruleId = router?.query?.id?.[0]
  const FormProvider = useForm({ mode: 'all' })

  const { data: processesTreeData, isLoading } = useGetAdminGeneralDataProcessesGetAllForTreeQuery({
    'client-name': 'Swagger on HIT.Hastim.GeneralData.Endpoints.WebApi',
    'client-version': '1.0.1.100',
  })

  const processDataItems = useMemo(
    () => convertDataTree(processesTreeData?.data?.items || []) || [],
    [processesTreeData?.data?.items],
  )

  const { data: productRulesData, refetch } = useGetAdminCatalogProductRulesByIdQuery(
    {
      'client-name': 'ProductRulesById',
      'client-version': '0.0.1',
      id: ruleId!,
    },
    {
      skip: !ruleId,
    },
  )

  const breadcrumbs = [
    { url: '/', title: formatMessage(sidebarMessages.dashboard) },
    { url: '/product-rules', title: formatMessage(sidebarMessages.productRules) },
    {
      url: '#',
      title: ruleId ? formatMessage(phrasesMessages.edit) : formatMessage(phrasesMessages.create),
    },
  ]

  const [createProductRule, { reset: resetCreate }] = usePostAdminCatalogProductRulesMutation()
  const [updateProductRule, { reset: resetUpdate }] = usePutAdminCatalogProductRulesByIdMutation()

  const handleSave = (values: IProductRulesAddEditFormType) => {
    const body = {
      ...values,
    }
    resetCreate()
    resetUpdate()
    if (ruleId) {
      updateProductRule({
        'client-name': 'update-rule',
        'client-version': '1.0.0',
        id: ruleId,
        updateProductModel: body,
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successUpdate), type: 'success' })
          router.push('/product-rules')
        }
      })
    } else {
      createProductRule({
        'client-name': 'create-rule',
        'client-version': '1.0.0',
        createProductRuleModel: body,
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({ message: formatMessage(phrasesMessages.successAdd), type: 'success' })
          router.push('/product-rules')
        }
      })
    }
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(ProductRulesMessages.breadcrumbTitle)}
        breadItems={breadcrumbs}
      />
      <Box sx={classes.mainContainer} p={4} bgcolor="common.white" gap={4}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">{formatMessage(productRulesMessages.formTitle)}</Typography>
          {ruleId && (
            <HBWorkflow
              factor="1"
              entityId={ruleId!}
              machineCode={StateMachineCode.ProductRules}
              useGetStateList={useGetStateList}
              useGetState={useGetStateInfo}
              useChangeState={usePostAdminCatalogProductRulesChangeStateMutation}
              stateCode={productRulesData?.data?.stateCode!}
              onChangeState={refetch}
            />
          )}
        </Grid>
        <HBForm
          onSubmit={handleSave}
          mode="all"
          formProviderProps={ruleId ? FormProvider : undefined}
        >
          <ProductRulesAddEditForm processDataItems={processDataItems} />
        </HBForm>
      </Box>
      <History hidden />
    </>
  )
}
export default ProductRulesAddEditPage

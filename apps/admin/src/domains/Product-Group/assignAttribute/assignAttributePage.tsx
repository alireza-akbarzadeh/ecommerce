import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetCategoryAttributeQueryResult,
  GetFeatureDisplayTypesQueryResult,
  useGetAdminCatalogCategoriesByIdAttributeAndAttributeIdQuery,
  usePostAdminCatalogCategoriesByIdAttributesMutation,
  usePutAdminCatalogCategoriesByIdAttributesAndAttributeIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { GetBusinessTypeValuesByBusinessTypeQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBClassesType, HBForm, openToast } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import ProductGroupPageMessages from '../ProductGroupPage.messages'
import AssignAttributesAddEditForm from './containers/assignAttributesAddEditForm'

type HBPageClassNames = 'toolsContainer' | 'mainContainer'

const classes: HBClassesType<HBPageClassNames> = {
  toolsContainer: ({ palette }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: palette.grey[100],
  }),
  mainContainer: {
    width: '100%',
    minHeight: 'calc(100vh - 188px)',
    display: 'flex',
    flexDirection: 'column',
  },
}

export type AssignAttributeAddEditFormType = Omit<
  GetCategoryAttributeQueryResult,
  'attributeFilterId' | 'importantTypeCode' | 'displaySortTypeCode'
> & {
  baseName?: string | null
  attributeFilterId: any
  importantTypeCode?: GetBusinessTypeValuesByBusinessTypeQueryResult
  displaySortTypeCode?: GetFeatureDisplayTypesQueryResult
}

const AssignAttributePage = (props: any) => {
  const { attributeId } = props
  const { query: { slug = [] } = {}, push, pathname } = useRouter()
  const [action, nodeId] = slug
  const [isOpenAttributesDialog, setIsOpenAttributesDialog] = useState<boolean>(false)
  const { formatMessage } = useIntl()

  const { data: attributeData, refetch } =
    useGetAdminCatalogCategoriesByIdAttributeAndAttributeIdQuery(
      {
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: nodeId,
        attributeId: attributeId!,
      },
      {
        skip: !attributeId,
      },
    )

  const formProvider = useForm<AssignAttributeAddEditFormType>({
    mode: 'onChange',
  })

  const breadcrumbs = [
    { url: '/', title: formatMessage(phrasesMessages.home) },
    {
      url: `/product-group/${action}/${nodeId}`,
      title: formatMessage(ProductGroupPageMessages.productCategoryTitle),
    },
    { url: '#', title: formatMessage(ProductGroupPageMessages.assignAttributesTitle) },
  ]

  const toggleOpenDialog = (open: boolean): void => {
    setIsOpenAttributesDialog(open)
  }

  const [assignCategoryAttribute, { isLoading: createLoading }] =
    usePostAdminCatalogCategoriesByIdAttributesMutation()

  const [updateAssignedCategoryAttribute] =
    usePutAdminCatalogCategoriesByIdAttributesAndAttributeIdMutation()

  const handleSave = (values: AssignAttributeAddEditFormType) => {
    Object.keys(values).forEach((key) => {
      //@ts-ignore
      if (values[key] === '') {
        //@ts-ignore
        values[key] = null
      }
    })

    const body = {
      ...values,
      isActive: !!values.isActive,
      searchWeight: values.searchWeight || null,
      importantTypeCode: values.importantTypeCode?.id || (values?.importantTypeCode as string),
      displaySortTypeCode:
        values.displaySortTypeCode?.id || (values?.displaySortTypeCode as string) || null,
      attributeFilterId: undefined,
    }
    if (!attributeId) {
      assignCategoryAttribute({
        'client-name': 'assign-category-attribute',
        'client-version': '1.0.0',
        assignCategoryAttributeModel: {
          ...body,
          attributeFilterId: body.isUsedForFilter ? values?.attributeFilterId?.value || null : null,
        },
        id: nodeId,
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(ProductGroupPageMessages.addAssignAttributeSuccess),
              type: 'success',
            })
            push({
              pathname,
              query: { slug, activePanel: 'relatedAttribute' },
            })
          }
        })
    } else {
      updateAssignedCategoryAttribute({
        'client-name': 'update-assigned-category-attribute',
        'client-version': '1.0.0',
        attributeId: values.attributeId || '',
        id: nodeId,
        updateAssignedCategoryAttributeModel: {
          arguments: {
            ...body,
          },
          attributeFilterId: body.isUsedForFilter ? values?.attributeFilterId?.value || null : null,
        },
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(ProductGroupPageMessages.updateAssignAttributeSuccess),
              type: 'success',
            })
            push({
              pathname,
              query: { slug, activePanel: 'relatedAttribute' },
            })
          }
        })
    }
  }

  return (
    <>
      <Box sx={classes.toolsContainer}>
        <BreadCrumbSection
          title={formatMessage(ProductGroupPageMessages.relatedAttributesWithProductGroup)}
          breadItems={breadcrumbs}
        />
      </Box>
      <Box sx={classes.mainContainer} p={4} bgcolor="common.white">
        <HBForm<AssignAttributeAddEditFormType>
          formProviderProps={formProvider}
          onSubmit={(value) => handleSave(value)}
        >
          <AssignAttributesAddEditForm
            isOpenAttributesDialog={isOpenAttributesDialog}
            toggleOpenDialog={toggleOpenDialog}
            handleSave={handleSave}
            createLoading={createLoading}
            attributeId={attributeId}
            attributeData={attributeData}
            refetch={refetch}
          />
        </HBForm>
      </Box>
      <HBRecordHistory
        data={attributeData?.data}
        isBorder
        isShowAccordion
        disabled={!attributeId}
      />
    </>
  )
}
export default AssignAttributePage

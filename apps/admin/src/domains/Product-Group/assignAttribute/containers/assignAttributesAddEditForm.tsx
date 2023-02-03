import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminCatalogApiAttributeFilterByAttributeIdQuery } from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { GetCategoryAttributeQueryResultApiResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBButton, HBClassesType, HBDialog, HBIcon, HBSelectProps } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { FC, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productGroupPageMessages from '../../ProductGroupPage.messages'
import { AssignAttributeAddEditFormType } from '../assignAttributePage'
import EffectOnDiversity from '../components/effectOnDiversity'
import EffectOnFilters from '../components/effectOnFilters'
import GeneralSpecifications from '../components/generalSpecifications'
import Header from '../components/header'
import DialogAssignAttribute from './dialogAssignAttribute'

type HBPageClassNames = 'buttonBox'

const classes: HBClassesType<HBPageClassNames> = {
  buttonBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}
export interface AssignAttributesAddEditFormProps {
  isOpenAttributesDialog: boolean
  toggleOpenDialog: (value: boolean) => void
  handleSave?: any
  createLoading?: boolean
  attributeId?: string
  attributeData?: GetCategoryAttributeQueryResultApiResult
  refetch: () => void
}

export const enum BusinessType {
  AttributeKindTypeCode = BusinessTypeEnums.AttributeKindType,
  AttributeGroupTypeCode = BusinessTypeEnums.AttributeGroupType,
  AttributeDataImportantTypeCode = BusinessTypeEnums.ImportanceRegisterData,
}

export type SelectBoxOptionsType = HBSelectProps['menuItem']

const AssignAttributesAddEditForm: FC<AssignAttributesAddEditFormProps> = (props) => {
  const {
    isOpenAttributesDialog,
    toggleOpenDialog,
    handleSave,
    createLoading,
    attributeId,
    attributeData,
    refetch,
  } = props
  const { query: { slug = [] } = {}, pathname } = useRouter()
  const [action, nodeId] = slug
  const { formatMessage } = useIntl()
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const [{ AttributeGroupTypeCodes, AttributeDataImportantTypeCodes }, setBusinessTypes] = useState<
    Record<string, GetBusinessTypeValuesQueryResult[]>
  >({
    AttributeGroupTypeCodes: [],
    AttributeDataImportantTypeCodes: [],
  })
  const router = useRouter()

  const {
    formState: { touchedFields, isDirty, isValid },
    setValue,
    reset,
    watch,
  } = useFormContext<AssignAttributeAddEditFormType>()

  useEffect(() => {
    setValue('isActive', true)
    setValue('isVisible', true)
  }, [])

  useEffect(() => {
    refetch()
  }, [])

  const { data: { data: { items: attributeFiltersData = [] } = {} } = {} } =
    useGetAdminCatalogApiAttributeFilterByAttributeIdQuery(
      {
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        pageSize: 1000,
        pageNumber: 1,
        attributeId: attributeId ? attributeId : watch('attributeId')!,
      },
      {
        skip: !watch('attributeId'),
      },
    )

  const attributeFiltersItems = useMemo(
    () =>
      attributeFiltersData?.map((item: any) => ({
        title: item.name,
        value: item.id,
      })) || [],
    [attributeFiltersData],
  )

  useEffect(() => {
    if (attributeData) {
      //@ts-ignore
      reset(attributeData?.data!)
      setValue(
        'attributeFilterId',
        attributeFiltersItems.find((item) => item.value == attributeData?.data?.attributeFilterId),
      )
    }
  }, [attributeData, attributeFiltersItems])

  const getBusinessTypes = (businessTypes: GetBusinessTypeValuesQueryResult[]) => {
    const AttributeGroupTypeCodes = businessTypes.filter(
      (item) => item.businessTypeId === BusinessType.AttributeGroupTypeCode + '',
    )

    const AttributeDataImportantTypeCodes = businessTypes.filter(
      (item) => item.businessTypeId === BusinessType.AttributeDataImportantTypeCode + '',
    )

    setBusinessTypes({
      AttributeGroupTypeCodes,
      AttributeDataImportantTypeCodes,
    })
  }

  const { data: businessTypeData } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  useEffect(() => {
    if (businessTypeData?.data?.items) {
      getBusinessTypes(businessTypeData.data.items)
    }
  }, [businessTypeData])

  const handleGoBack = (): void => {
    if (isEmpty(touchedFields)) {
      router.push({
        pathname,
        query: { slug, activePanel: 'relatedAttribute' },
      })
    } else {
      setOpenConfirmModal(true)
    }
  }

  const handleCancel = (): void => {
    setOpenConfirmModal(false)
    router.push({
      pathname,
      query: { slug, activePanel: 'relatedAttribute' },
    })
  }

  return (
    <>
      <Header />
      <GeneralSpecifications
        toggleOpenDialog={toggleOpenDialog}
        AttributeGroupTypeCodes={AttributeGroupTypeCodes}
        AttributeDataImportantTypeCodes={AttributeDataImportantTypeCodes}
        attributeId={attributeId}
      />
      <EffectOnDiversity />
      <EffectOnFilters attributeFiltersItems={attributeFiltersItems} />
      <Box sx={classes.buttonBox}>
        <HBButton
          variant="outlined"
          onClick={handleGoBack}
          startIcon={<HBIcon type="angleRight" />}
        >
          {formatMessage(productGroupPageMessages.back)}
        </HBButton>
        <HBButton
          variant="contained"
          type="submit"
          color="primary"
          disabled={createLoading || !isDirty || !isValid}
        >
          {formatMessage(productGroupPageMessages.save)}
        </HBButton>
      </Box>
      <HBDialog
        maxWidth="md"
        title={formatMessage(productGroupPageMessages.attribute)}
        open={isOpenAttributesDialog}
        onClose={() => toggleOpenDialog(false)}
        onReject={() => toggleOpenDialog(false)}
        PaperProps={{
          sx: {
            height: 650,
            minHeight: 650,
          },
        }}
      >
        <DialogAssignAttribute toggleOpenDialog={toggleOpenDialog} />
      </HBDialog>
      <HBDialog
        title={formatMessage(phrasesMessages.dialogConfirmationTitle)}
        content={formatMessage(phrasesMessages.dialogConfirmationContent)}
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

export default AssignAttributesAddEditForm

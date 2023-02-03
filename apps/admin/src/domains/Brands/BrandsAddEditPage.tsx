import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { HBContentForm } from '@hasty-bazar/admin-shared/containers/HBContentForm'
import { EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import { CreateBrandModel } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { GetContentsByEntityTypeTagQueryResult } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBForm } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, ReactNode, useEffect } from 'react'
import { useIntl } from 'react-intl'
import brandsPageMessages from './BrandsPage.messages'
import {
  useGetAdminCatalogBrandsByIdQuery,
  usePostAdminCatalogBrandsMutation,
  usePutAdminCatalogBrandsByIdMutation,
} from './catalogApi.enhanced'
import { BrandsAddEditForm } from './containers'
import RelatedProductGroupByBrandAccordion from './containers/RelatedProductGroupByBrandAccordion'

export type SelectBoxOptionsType = {
  title: ReactNode
  value: any
  iconPath?: ReactNode
  color?: string | undefined
}
export interface BrandAddEditFormType
  extends Omit<
    CreateBrandModel,
    | 'madeType'
    | 'restrictionsOnUse'
    | 'countryOfOriginId'
    | 'isLuxBrand'
    | 'pageDisplayType'
    | 'pageDisplayType'
  > {
  madeType: any
  restrictionsOnUse: any
  countryOfOriginId: any
  isLuxBrand: any
  pageDisplayType?: any
  screenDisplayId?: any
}

export type ContentType = {
  id?: string
  title?: string
  value?: string
  description?: string
  tags?: GetContentsByEntityTypeTagQueryResult[]
}

const BrandAddEditPage: FC = () => {
  const router = useRouter()
  const id = router.query.id?.[0]
  const { formatMessage } = useIntl()

  const [createBrand, { data: createBrandData }] = usePostAdminCatalogBrandsMutation()
  const [updateBrand, { data: updateBrandData }] = usePutAdminCatalogBrandsByIdMutation()

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(brandsPageMessages.dashboard),
    },
    {
      url: '/brands',
      title: formatMessage(brandsPageMessages.brand),
    },
    {
      url: '#',
      title: id
        ? formatMessage(brandsPageMessages.editBrand)
        : formatMessage(brandsPageMessages.addBrand),
    },
  ]

  const { data: brandData, refetch: getCatalogBrands } = useGetAdminCatalogBrandsByIdQuery(
    {
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: id!,
    },
    {
      skip: !id,
    },
  )

  useEffect(() => {
    if (createBrandData?.success || updateBrandData?.success) {
      router.push(`/brands`)
    }
  }, [createBrandData, updateBrandData])

  const handleSubmit = async (values: BrandAddEditFormType) => {
    const body = {
      ...values,
      foundedYear: values.foundedYear ? values.foundedYear : null,
      stateName: formatMessage(brandsPageMessages.preview),
      isLuxBrand:
        String(values?.isLuxBrand?.value) === '0' || String(values?.isLuxBrand) === '0'
          ? false
          : true,
      madeType: values?.madeType?.value || values?.madeType,
      countryOfOriginId: values?.countryOfOriginId?.value || values?.countryOfOriginId,
      restrictionsOnUse: values.restrictionsOnUse.value || values.restrictionsOnUse,
      pageDisplayType: values.pageDisplayType.value || values.pageDisplayType,
      screenDisplayId: values.screenDisplayId?.id || values.screenDisplayId,
    } as BrandAddEditFormType

    if (!id) {
      createBrand({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        createBrandModel: body,
      })
    } else {
      const putModel: BrandAddEditFormType = {
        name: values.name,
        latinName: values.latinName,
        code: values.code,
        countryOfOriginId:
          values?.countryOfOriginId?.value || (values?.countryOfOriginId as string),
        icon: values.icon,
        madeType: values?.madeType?.value || (values?.madeType as number),
        isLuxBrand:
          String(values?.isLuxBrand?.value) === '0' || String(values?.isLuxBrand) === '0'
            ? false
            : true,
        foundedYear: values.foundedYear || null,
        site: values.site,
        slogon: values.slogon,
        restrictionsOnUse: values?.restrictionsOnUse?.value || values?.restrictionsOnUse,
        pageDisplayType: values.pageDisplayType.value || values.pageDisplayType,
        screenDisplayId: values.screenDisplayId?.id || values.screenDisplayId,
      }
      updateBrand({
        'client-name': 'update-attribute',
        'client-version': '1.0.0',
        updateBrandModel: putModel,
        id,
      })
    }
  }

  return (
    <>
      <BreadCrumbSection title={formatMessage(brandsPageMessages.brand)} breadItems={breadcrumbs} />
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
        <HBForm<BrandAddEditFormType> onSubmit={handleSubmit} mode="all">
          <BrandsAddEditForm brandData={brandData} getCatalogBrands={getCatalogBrands} />
        </HBForm>
      </Box>
      <HBContentForm entityId={id} entityTypeId={EntityTypeEnums.Brand} isShowBanner />
      {id && <RelatedProductGroupByBrandAccordion />}
      <HBRecordHistory data={brandData?.data} isBorder isShowAccordion disabled={!id} />
    </>
  )
}
export default BrandAddEditPage

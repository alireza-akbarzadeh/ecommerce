import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import { HBContentUploader } from '@hasty-bazar/admin-shared/containers/HBContentUploader'
import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  useGetAdminCatalogConfigurableProductsByIdQuery,
  useGetAdminCatalogSimpleProductsByIdQuery,
} from '@hasty-bazar-admin/domains/Products/catalogApi.enhanced'
import { ProductExplanation } from '@hasty-bazar-admin/domains/Products/components'
import { getProductType } from '@hasty-bazar-admin/domains/Products/utils'
import {
  usePostAdminCatalogConfigurableProductsByIdDefaultImageMutation,
  usePostAdminCatalogSimpleProductsByIdDefaultImageMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import ContentSettingsMessages from './ContentSettings.messages'

interface ProductImagesAndVideosProps {
  disabled: boolean
}
export const OTHER_IMAGES_PRODUCT_FACTOR = 'otherImages'
export const MAIN_IMAGE_PRODUCT_FACTOR = 'mainImage'
function ProductImagesAndVideos({ disabled }: ProductImagesAndVideosProps) {
  const { formatMessage } = useIntl()
  const [videoCounts, setVideoCounts] = useState(0)
  const [imageCounts, setImageCounts] = useState(0)
  const [hasDefaultImage, setHasDefaultImage] = useState<boolean>(true)
  const router = useRouter()
  const defaultProductType = getProductType(router.pathname)
  const productType = getProductType(router.asPath) || defaultProductType
  const entityId = (router.query?.id || '') as string

  const [postDefaultImage] =
    productType === 'simple'
      ? usePostAdminCatalogSimpleProductsByIdDefaultImageMutation()
      : usePostAdminCatalogConfigurableProductsByIdDefaultImageMutation()
  const args = {
    'client-name': 'admin',
    'client-version': '1.0.0',
    id: router.query.id as string,
  }
  const options = {
    skip: !router.query.id,
  }
  const productData =
    productType === 'simple'
      ? useGetAdminCatalogSimpleProductsByIdQuery(args, options)
      : useGetAdminCatalogConfigurableProductsByIdQuery(args, options)
  return (
    <ProductExplanation
      summaryProps={{
        title: formatMessage(ContentSettingsMessages.productImageVideo),
        icon: 'image',
        statusLabel: hasDefaultImage
          ? String(imageCounts + videoCounts + 1)
          : String(imageCounts + videoCounts),
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <HBContentUploader
            max={1}
            disabled={disabled}
            factor={MAIN_IMAGE_PRODUCT_FACTOR}
            entityId={entityId}
            entityTypeId={EntityTypeEnums.Product}
            onUploaded={(file, files) => {
              if (files.length) {
                setHasDefaultImage(true)
              } else {
                setHasDefaultImage(false)
              }

              if (
                productData.data?.data?.productStatus === EnumFormHeaderStatus.draft &&
                file?.value
              ) {
                postDefaultImage({
                  'client-name': 'hasty-bazar-admin',
                  'client-version': '1.0.0',
                  id: entityId,
                  setDefaultImageModel: {
                    defaultImage: file?.value,
                  },
                })
              }
            }}
            fileType={ContentTypeEnums.Image}
            title={formatMessage(ContentSettingsMessages.uploadMainProductImage)}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <HBContentUploader
            disabled={disabled}
            entityId={entityId}
            factor={OTHER_IMAGES_PRODUCT_FACTOR}
            entityTypeId={EntityTypeEnums.Product}
            onUploaded={(file, files) => {
              setImageCounts((prev) => files.length)
            }}
            fileType={ContentTypeEnums.Image}
            title={formatMessage(ContentSettingsMessages.uploadOtherProductImages)}
          />
        </Grid>
      </Grid>
      <HBContentUploader
        entityId={entityId}
        disabled={disabled}
        onUploaded={(file, files) => {
          setVideoCounts(files.length)
        }}
        entityTypeId={EntityTypeEnums.Product}
        fileType={ContentTypeEnums.Video}
        title={formatMessage(ContentSettingsMessages.productVideoUploader)}
      />
    </ProductExplanation>
  )
}

export default ProductImagesAndVideos

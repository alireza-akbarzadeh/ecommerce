import { ContentTypeEnums, EntityTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import {
  MAIN_IMAGE_PRODUCT_FACTOR,
  OTHER_IMAGES_PRODUCT_FACTOR,
} from '@hasty-bazar-admin/domains/Products/containers/productForm/contentSettings/ProductImagesAndVideos'
import {
  CommerceTabs,
  ICommerceTabItem,
} from '@hasty-bazar-admin/domains/Products/preview/components'
import { useGetAdminCatalogProductsPreviewByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  EntityType,
  useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { HBDialog, HBIcon } from '@hasty-bazar/core'
import {
  dialogClasses,
  dialogContentClasses,
  DialogProps,
  IconButton,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../../productDetail.messages'
import ProductMedia from './ProductMedia'

interface IContentsDialog extends Required<Pick<DialogProps, 'onClose'>> {
  activeIndex?: number
}
const ContentsDialog: FC<IContentsDialog> = (props) => {
  const { onClose, activeIndex } = props
  const { id } = useRouter().query as { id: string }
  const productData = useGetAdminCatalogProductsPreviewByIdQuery({
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    id,
  })
  const english = /^[A-Za-z]*$/

  const activeUniqueProduct =
    productData.data?.data?.uniqueProducts?.find((item) => id === item.id) || {}

  const productImages = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    entityId: id,
    entityTypeId: EntityTypeEnums.Product as unknown as EntityType,
    contentType: ContentTypeEnums.Image,
    factor: OTHER_IMAGES_PRODUCT_FACTOR,
  })
  const productMainImage = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    entityId: id,
    entityTypeId: EntityTypeEnums.Product as unknown as EntityType,
    contentType: ContentTypeEnums.Image,
    factor: MAIN_IMAGE_PRODUCT_FACTOR,
  })

  const productVideos = useGetAdminCmsContentsByEntityTypeIdAndEntityIdQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    entityId: id,
    entityTypeId: EntityTypeEnums.Product as unknown as EntityType,
    contentType: ContentTypeEnums.Video,
    factor: OTHER_IMAGES_PRODUCT_FACTOR,
  })

  const images = productImages.data?.data?.items || []
  const videos = productVideos.data?.data?.items || []
  const mainImage = productMainImage.data?.data?.items || []
  const mediaList = mainImage.concat(images).concat(videos)

  const tabs: ICommerceTabItem[] = useMemo(() => {
    let tabs = [
      {
        tabLabel: (
          <Typography variant="button">
            <FormattedMessage {...ProductionDetailMessages.officialMedia} />
          </Typography>
        ),
        tabPanel: <ProductMedia activeIndex={activeIndex} content={mediaList} />,
      },
    ]

    return tabs
  }, [])

  return (
    <HBDialog
      hideCloseButton
      open
      maxWidth="sm"
      fullWidth
      onBackdropClick={() => onClose({}, 'backdropClick')}
      sx={{
        [`& .${dialogClasses.paper}`]: { borderRadius: 4, position: 'relative' },
        [`& .${dialogContentClasses.root}`]: {
          p: 0,
        },
      }}
    >
      <CommerceTabs
        tabs={tabs}
        tabsSx={{ bgcolor: 'grey.100' }}
        TabIndicatorProps={{
          sx: ({ spacing }) => ({
            top: 0,
            height: spacing(1.1),
            borderTopLeftRadius: spacing(1.1),
            borderTopRightRadius: spacing(1.1),
          }),
        }}
      />
      <IconButton
        onClick={() => onClose({}, 'backdropClick')}
        sx={{ cursor: 'pointer', position: 'absolute', right: 12, top: 8, lineHeight: 0 }}
      >
        <HBIcon sx={{ color: 'grey.500' }} size="small" type="multiply" />
      </IconButton>
    </HBDialog>
  )
}

export default ContentsDialog

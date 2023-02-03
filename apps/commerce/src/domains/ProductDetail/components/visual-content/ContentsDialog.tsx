import { CommerceTabs, ICommerceTabItem } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebSocialCommentsProductAttachmentQuery } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBDialog, HBIcon } from '@hasty-bazar/core'
import {
  dialogClasses,
  dialogContentClasses,
  DialogProps,
  IconButton,
  Typography,
} from '@mui/material'
import { FC, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../../productDetail.messages'
import { useProductDetail } from '../../ProductDetailContext'
import ProductMedia from './ProductMedia'

interface IContentsDialog extends Required<Pick<DialogProps, 'onClose'>> {
  activeIndex?: number
}
const ContentsDialog: FC<IContentsDialog> = (props) => {
  const { onClose, activeIndex } = props
  const { activeUniqueProduct } = useProductDetail()

  const { data } = useGetWebSocialCommentsProductAttachmentQuery(
    {
      ...ApiConstants,
      productId: activeUniqueProduct?.id ?? '',
    },
    {
      skip: !activeUniqueProduct?.id,
    },
  )

  const tabs: ICommerceTabItem[] = useMemo(() => {
    let tabs = [
      {
        tabLabel: (
          <Typography variant="button">
            <FormattedMessage {...ProductionDetailMessages.officialMedia} />
          </Typography>
        ),
        tabPanel: (
          <ProductMedia activeIndex={activeIndex} content={activeUniqueProduct?.mediaList ?? []} />
        ),
      },
    ]

    if (data?.data?.items?.length) {
      tabs.push({
        tabLabel: (
          <Typography variant="button">
            <FormattedMessage {...ProductionDetailMessages.userMedia} />
          </Typography>
        ),
        tabPanel: <ProductMedia activeIndex={activeIndex} content={data.data.items} />,
      })
    }
    return tabs
  }, [data])

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

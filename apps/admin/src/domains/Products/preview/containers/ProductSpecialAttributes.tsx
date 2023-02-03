import {
  PreviewProductAttributeDto,
  useGetAdminCatalogProductsPreviewByIdQuery,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBIcon } from '@hasty-bazar/core'
import { Divider, Stack, styled, Theme, Typography, useMediaQuery } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../productDetail.messages'
import { ProductName } from './visual-content'

const BorderedBoxStyle = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[100]}`,
  padding: theme.spacing(3),
}))

const ProductSpecialAttributes: FC = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { id } = useRouter().query as { id: string }
  const productData = useGetAdminCatalogProductsPreviewByIdQuery({
    'client-name': 'HIT.Hastim.Catalog.Endpoints.WebApi',
    'client-version': '1.0.0',
    id,
  })

  const activeUniqueProduct = productData.data?.data?.uniqueProducts?.find((item) => item.id === id)

  const [topAttributes, setTopAttributes] = useState<PreviewProductAttributeDto[]>([])
  useEffect(() => {
    if (activeUniqueProduct?.attributes) {
      const tempAttributes = activeUniqueProduct?.attributes.filter((i) => i.isTop).slice(0, 4)
      setTopAttributes(tempAttributes)
    } else {
      setTopAttributes([])
    }
  }, [activeUniqueProduct?.attributes])

  const handleAttributes = useMemo(() => {
    return (
      <>
        {topAttributes.length > 0 && (
          <Typography variant="caption">
            <FormattedMessage {...ProductionDetailMessages.productAttributes} />
          </Typography>
        )}
        {topAttributes.map((attr) => (
          <Stack direction="row" key={attr.id} alignItems="center" spacing={1}>
            <Image
              alt={String(attr.displayValue)}
              width={16}
              height={16}
              src={
                attr.displayIcon
                  ? `${process.env.NEXT_PUBLIC_CDN}${attr.displayIcon}`
                  : '/assets/svg/attribute-default.svg'
              }
            />
            <Typography variant="body2" sx={{ color: 'grey.500' }}>
              {attr.displayValue?.replace(/:/, '&').split('&')[0]}:
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.900' }}>
              {attr.displayValue?.replace(/:/, '&').split('&')[1]}
            </Typography>
          </Stack>
        ))}
      </>
    )
  }, [topAttributes])

  return (
    <Stack spacing={4}>
      <Stack spacing={4} divider={<Divider sx={{ borderColor: 'grey.200' }} />}>
        {!isSmall && <ProductName />}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <HBIcon sx={{ color: 'info.main' }} size="small" type="commentDots" />
            <Typography variant="caption" color="info.main">
              <FormattedMessage {...ProductionDetailMessages.commentCount} values={{ count: 1 }} />
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* <SpecificAttributesWrapper /> */}
      {handleAttributes}

      <BorderedBoxStyle
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ cursor: 'pointer' }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <HBIcon type="exclamationCircle" sx={{ color: 'info.main' }} size="small" />
          <Typography variant="caption" color="info.main">
            <FormattedMessage {...ProductionDetailMessages.seeReturnRules} />
          </Typography>
        </Stack>
        <HBIcon type="angleLeft" sx={{ color: 'info.main' }} size="small" />
      </BorderedBoxStyle>
    </Stack>
  )
}

export default ProductSpecialAttributes

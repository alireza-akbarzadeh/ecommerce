import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { CommentsOrderType } from '@hasty-bazar-commerce/core/enums'
import { persianNumber } from '@hasty-bazar-commerce/core/utils/persianConvert'
import { ProductAttributeDto } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { useGetWebSocialCommentsProductQuery } from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBDivider, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, styled, Theme, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { FC, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import PriceTiering from '../containers/PriceTiering'
import ProductionDetailMessages from '../productDetail.messages'
import { useProductDetail } from '../ProductDetailContext'
import ProductReturnRulesModal from './ProductReturnRulesModal'
import { SpecificAttributesWrapper } from './special-attribute'
import { ProductName } from './visual-content'

const BorderedBoxStyle = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[100]}`,
  padding: theme.spacing(3),
}))

const ProductOriginalityBoxStyle = styled(Stack)<{ type: 'acceptable' | 'originality' }>(
  ({ theme, type }) => ({
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor:
      type === 'acceptable' ? theme.palette.primary.lighter : theme.palette.success.lighter,
    color: type === 'acceptable' ? theme.palette.primary.main : theme.palette.success.main,
  }),
)

const ProductSpecialAttributes: FC = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'))
  const { activeUniqueProduct } = useProductDetail()
  const [topAttributes, setTopAttributes] = useState<ProductAttributeDto[]>([])
  const { data: comments } = useGetWebSocialCommentsProductQuery(
    {
      ...ApiConstants,
      productId: activeUniqueProduct?.id!,
      ordering: CommentsOrderType.newest,
      pageNumber: 1,
      pageSize: 10,
    },
    {
      skip: !activeUniqueProduct?.id,
    },
  )

  const [openReturnRulesModal, setOpenReturnRulesModal] = useState(false)
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
          <Stack key={attr.id} direction="row" alignItems="center" spacing={1}>
            <Box minWidth={16} minHeight={16} position="relative">
              <Image
                layout="fill"
                src={
                  attr.displayIcon
                    ? `${process.env.NEXT_PUBLIC_CDN}${attr.displayIcon}`
                    : '/assets/svg/attribute-default.svg'
                }
              />
            </Box>
            <Box display="flex" flexWrap="wrap">
              <Typography variant="body2" sx={{ color: 'grey.500', userSelect: 'text' }}>
                {attr.displayValue?.replace(/:/, '&').split('&')[0]}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.900', userSelect: 'text' }}>
                {attr.displayValue?.replace(/:/, '&').split('&')[1]}
              </Typography>
            </Box>
          </Stack>
        ))}
      </>
    )
  }, [topAttributes])

  return (
    <Stack spacing={4}>
      {isTablet && <HBDivider />}
      <Stack spacing={4}>
        {!isSmall && <ProductName />}
        {!!comments?.data?.totalItems && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <HBIcon sx={{ color: 'warning.light' }} type="star" size="small" />
              {!!comments?.data?.avgRate && (
                <Typography variant="caption" color="warning.light">
                  {persianNumber(comments?.data?.avgRate?.toLocaleString())}
                </Typography>
              )}

              {!!comments?.data.sumRate && (
                <Typography variant="caption" color="text.secondary">
                  ({persianNumber(comments?.data.sumRate.toLocaleString())})
                </Typography>
              )}

              <Box sx={{ width: 2, height: 2, bgcolor: 'grey.300', borderRadius: 0.5 }} />
            </Stack>

            {!!comments?.data?.totalItems && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <HBIcon sx={{ color: 'info.main' }} size="small" type="commentDots" />
                <Typography variant="caption" color="info.main">
                  <FormattedMessage
                    {...ProductionDetailMessages.commentCount}
                    values={{ count: comments?.data?.totalItems }}
                  />
                </Typography>
              </Stack>
            )}
          </Stack>
        )}

        {(!!activeUniqueProduct?.acceptableConditionTypeTitle ||
          !!activeUniqueProduct?.originalityTypeTitle) && (
          <Stack direction="row" spacing={1}>
            {!!activeUniqueProduct?.acceptableConditionTypeTitle && (
              <ProductOriginalityBoxStyle type="acceptable">
                <Typography variant="subtitle2">
                  {activeUniqueProduct?.acceptableConditionTypeTitle}
                </Typography>
              </ProductOriginalityBoxStyle>
            )}

            {!!activeUniqueProduct?.originalityTypeTitle && (
              <ProductOriginalityBoxStyle type="originality">
                <Typography variant="subtitle2">
                  {activeUniqueProduct?.originalityTypeTitle}
                </Typography>
              </ProductOriginalityBoxStyle>
            )}
          </Stack>
        )}
      </Stack>

      <SpecificAttributesWrapper />
      {handleAttributes}
      <PriceTiering />
      <BorderedBoxStyle
        direction="row"
        onClick={() => {
          setOpenReturnRulesModal(true)
        }}
        alignItems="center"
        justifyContent="space-between"
        sx={{ cursor: 'pointer' }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <HBIcon
            type="exclamationCircle"
            sx={{ color: 'info.main', display: 'flex' }}
            size="small"
          />
          <Typography variant="caption" color="info.main">
            <FormattedMessage {...ProductionDetailMessages.seeReturnRules} />
          </Typography>
        </Stack>
        <HBIcon type="angleLeft" sx={{ color: 'info.main', display: 'flex' }} size="small" />
      </BorderedBoxStyle>
      <ProductReturnRulesModal
        open={openReturnRulesModal}
        onClose={() => {
          setOpenReturnRulesModal(false)
        }}
      />
    </Stack>
  )
}

export default ProductSpecialAttributes

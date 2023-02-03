import { Rate, TextWithHBIcon, TextWithIcon } from '@hasty-bazar-commerce/components'
import { GetAllSavedVendorsQueryResult } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { Box, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import SavedMessages from '../saved.messages'

type ISavedCardInformationProps = Pick<
  GetAllSavedVendorsQueryResult,
  | 'storeName'
  | 'vendorFollower'
  | 'vendorSatisfication'
  | 'availableProduct'
  | 'countOfProducts'
  | 'imageUrl'
  | 'vendorRate'
>

const iconSize = 24

const SavedCardInformation: FC<ISavedCardInformationProps> = (props) => {
  const {
    availableProduct,
    countOfProducts,
    vendorFollower,
    vendorRate,
    storeName,
    vendorSatisfication,
  } = props
  const { formatMessage } = useIntl()
  return (
    <Stack spacing={4} justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={4}>
        <Typography variant="subtitle1" color="info.main">
          {storeName}
        </Typography>
        <Box sx={{ direction: 'rtl' }}>
          <Rate value={`${vendorRate?.value}`} />
        </Box>
      </Stack>
      <Stack spacing={3}>
        {vendorFollower?.icon ? (
          <TextWithIcon
            sx={{ color: 'grey.900' }}
            icon={`${process.env.NEXT_PUBLIC_CDN}${vendorFollower.icon}`}
            text={formatMessage(SavedMessages.followerWithCount, {
              count: vendorFollower.value,
            })}
            size={iconSize}
            spacing={2}
          />
        ) : (
          <TextWithHBIcon
            textColor="grey.900"
            iconColor="grey.700"
            iconType="usersAlt"
            text={`${vendorFollower?.value ?? ''}`}
          />
        )}

        {!!vendorSatisfication?.icon && vendorSatisfication.value && (
          <TextWithIcon
            sx={{ color: 'grey.900' }}
            icon={`${process.env.NEXT_PUBLIC_CDN}${vendorSatisfication.icon}`}
            text={formatMessage(SavedMessages.vendorSatisficationWithPercent, {
              percent: vendorSatisfication.value,
            })}
            size={iconSize}
            spacing={2}
          />
        )}

        {!vendorSatisfication?.icon && !!vendorSatisfication?.value && (
          <TextWithHBIcon
            textColor="grey.900"
            iconColor="grey.700"
            iconType="thumbsUp"
            text={formatMessage(SavedMessages.vendorSatisficationWithPercent, {
              percent: vendorSatisfication.value,
            })}
          />
        )}

        {!!availableProduct?.icon && !!availableProduct.value && (
          <TextWithIcon
            sx={{ color: 'grey.900' }}
            icon={`${process.env.NEXT_PUBLIC_CDN}${availableProduct?.icon}`}
            text={formatMessage(SavedMessages.availableProductWithCount, {
              count: availableProduct.value,
            })}
            size={iconSize}
            spacing={2}
          />
        )}

        {!!availableProduct?.value && !availableProduct?.icon && (
          <TextWithHBIcon
            textColor="grey.900"
            iconColor="grey.700"
            iconType="pricetagAlt"
            text={formatMessage(SavedMessages.availableProductWithCount, {
              count: availableProduct.value,
            })}
          />
        )}

        {!!countOfProducts?.icon && !!countOfProducts.value && (
          <TextWithIcon
            sx={{ color: 'grey.900' }}
            icon={`${process.env.NEXT_PUBLIC_CDN}${countOfProducts?.icon}`}
            text={formatMessage(SavedMessages.countOfProductsCount, {
              count: countOfProducts.value,
            })}
            size={iconSize}
            spacing={2}
          />
        )}

        {!countOfProducts?.icon && !!countOfProducts?.value && (
          <TextWithHBIcon
            textColor="grey.900"
            iconColor="grey.700"
            iconType="archive"
            text={formatMessage(SavedMessages.countOfProductsCount, {
              count: countOfProducts.value,
            })}
          />
        )}
      </Stack>
    </Stack>
  )
}

export default SavedCardInformation

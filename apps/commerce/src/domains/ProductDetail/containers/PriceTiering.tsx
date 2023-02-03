import { Box, Grid, gridClasses, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../productDetail.messages'
import { useProductDetail } from '../ProductDetailContext'

const PriceBox: FC<{ price: string; count: number; isActive: boolean; currency: string }> = ({
  count,
  price,
  isActive,
  currency,
}) => {
  return (
    <Stack
      spacing={1}
      sx={{
        borderRadius: 1,
        border: '1px solid',
        borderColor: isActive ? 'primary.main' : 'grey.200',
        py: 2,
        ':hover': {
          borderColor: 'primary.main',
        },
      }}
      alignItems="center"
    >
      <Typography variant="subtitle2" color={isActive ? 'primary.light' : 'text.secondary'}>
        <FormattedMessage {...ProductionDetailMessages.numberCount} values={{ number: count }} />
      </Typography>
      <Typography variant="subtitle2" color={isActive ? 'primary.main' : 'text.primary'}>
        <FormattedMessage
          {...ProductionDetailMessages.priceWithCurrency}
          values={{ price, currency }}
        />
      </Typography>
    </Stack>
  )
}

const PriceTiering = () => {
  const { activeUniqueProduct } = useProductDetail()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {activeUniqueProduct?.priceTieringLevels
          ?.filter((pr) => !!pr.price && !!pr.quantity)
          ?.map((pr) => (
            <Grid key={`${pr.price}-${pr.quantity}`} item xs={6}>
              <PriceBox
                count={pr.quantity!}
                currency={activeUniqueProduct.currency?.name || ''}
                isActive={false}
                price={pr.price!.toLocaleString()}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

export default PriceTiering

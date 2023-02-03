import RenderInDom from '@hasty-bazar-commerce/components/RenderInDom'
import { Container, Box } from '@mui/material'
import { FC } from 'react'

const imageSelector = {
  DiscountDay: '/assets/discount-day.jpg',
  BestSellers: '/assets/best-seller.jpg',
}

interface FixImageWidgetProps {
  pageName: string
}

const FixImageWidget: FC<FixImageWidgetProps> = ({ pageName }) => {
  return (
    <RenderInDom containerId="containerHeader">
      <Container
        maxWidth="lg"
        sx={{
          p: '0 !important',
          mt: { md: -9.5, xs: -3.5 },
          mx: { sm: 6, md: 'unset' },
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={imageSelector[pageName as keyof typeof imageSelector]}
          sx={{
            objectFit: 'contain',
            objectPosition: 'center',
            width: (theme) => ({
              xs: '100%',
              md: '100%',
              sm: `calc(100% - ${theme.spacing(12)})`,
            }),
          }}
        />
      </Container>
    </RenderInDom>
  )
}
export default FixImageWidget

import { Container, Stack } from '@mui/material'
import {
  FourthSection,
  Header,
  SecondSection,
  SellerRegistrationSection,
  SixthSection,
  ThirdSection,
} from './components'

function SellerLanding() {
  return (
    <Stack
      sx={{
        overflowX: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      <Header />
      <Container>
        <Stack
          sx={{
            mt: 25,
          }}
        >
          <SecondSection />
          <ThirdSection />
          <FourthSection />
          <SellerRegistrationSection />
          <SixthSection />
        </Stack>
      </Container>
    </Stack>
  )
}

export default SellerLanding

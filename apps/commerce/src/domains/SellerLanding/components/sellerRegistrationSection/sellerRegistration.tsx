import Image from 'next/image'
import Form from './form'
import {
  FirstSquare,
  FormSectionStyle,
  FormSectionWrapperStyle,
  ImageSection,
  SecondSquare,
  SellerRegistrationRoot,
  ThirdSquare,
} from './sellerRegistration.style'

function SellerRegistration() {
  return (
    <SellerRegistrationRoot id="seller-landing-register">
      <FirstSquare />
      <SecondSquare />
      <ThirdSquare />
      <FormSectionWrapperStyle flex={1}>
        <FormSectionStyle>
          <Form />
        </FormSectionStyle>
      </FormSectionWrapperStyle>
      <ImageSection>
        <Image src="/assets/sellerRegistration.png" layout="fill" alt="sellerLandingStep1" />
      </ImageSection>
    </SellerRegistrationRoot>
  )
}

export default SellerRegistration

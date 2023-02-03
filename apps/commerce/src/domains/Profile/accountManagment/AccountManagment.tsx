import { HBForm } from '@hasty-bazar/core'
import {
  ContactInformations,
  LegalInformations,
  SocialMediaInformations,
  UserInformations,
} from '.'
import { IContactInformationsForm } from './containers/ContactInformations'
import { IForm } from './containers/LegalInformations'
import { IInformation } from './containers/UserInformations'

const AccountManagmentBody = () => {
  return (
    <>
      <HBForm<IInformation> onSubmit={(value) => {}} mode="all">
        <UserInformations />
      </HBForm>

      <HBForm<IForm> onSubmit={(value) => {}} mode="all">
        <LegalInformations />
      </HBForm>
      {/* <BankAccountIformations /> */}
      <HBForm<IContactInformationsForm> onSubmit={(value) => {}} mode="all">
        <ContactInformations />
      </HBForm>

      <SocialMediaInformations />
    </>
  )
}

export default AccountManagmentBody

import HBTinyEditorController from '@hasty-bazar/admin-shared/containers/HBTinyEditorController'

const UserAboutUs = () => {
  return (
    <HBTinyEditorController
      name="aboutUs"
      formRules={{
        maxLength: 255,
      }}
    />
  )
}

export default UserAboutUs

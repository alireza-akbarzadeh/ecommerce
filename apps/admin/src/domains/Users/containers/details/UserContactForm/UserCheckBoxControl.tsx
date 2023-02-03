import { HBCheckBox } from '@hasty-bazar/core'
import { FC, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { UserAddressType } from '../UserContacts'

export type UserCheckBoxControlProps = {
  disabled?: boolean
}

const UserCheckBoxControl: FC<UserCheckBoxControlProps> = ({ disabled }) => {
  const Form = useFormContext<UserAddressType>()
  const checkBoxRef = useRef(null)

  return (
    <Controller
      rules={{
        required: {
          value: false,
          message: '',
        },
      }}
      name={'isDefault'}
      control={Form.control}
      render={({ field: { onBlur, onChange, value } }) => (
        <HBCheckBox
          required={false}
          inputRef={checkBoxRef}
          checked={!!value!}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
        />
      )}
    />
  )
}

export default UserCheckBoxControl

import { HBSwitch } from '@hasty-bazar/core'
import { FormControlLabel } from '@mui/material'
import { FC, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { IAttributeDetailSubjectForm } from '../../components/AttributeDetailDialog'

interface IWorkFlowSubjectController {
  statusFormName: string
}

const StatusController: FC = () => {
  const form = useFormContext<IAttributeDetailSubjectForm>()
  const errorMessage = form.formState.errors['attributeStatus']?.message
  const inputRef = useRef(null)
  return (
    <Controller
      name={'attributeStatus'}
      control={form.control}
      render={({ field }) => (
        <FormControlLabel
          {...field}
          inputRef={inputRef}
          sx={{ direction: 'rtl !important', gap: 2, justifyContent: 'space-between', width: 148 }}
          control={<HBSwitch checked={Number(field.value) ? true : false} />}
          label="وضعیت"
        />
      )}
    />
  )
}

export default StatusController

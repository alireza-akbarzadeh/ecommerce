import { HBButton, HBDialog, HBForm } from '@hasty-bazar/core'
import { Box, Stack } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import HBSelectController from '../HBSelectController'
import HBTextFieldController from '../HBTextFieldController'
import workflowMessages from './HBWorkflow.messages'

export type HBWorkflowConfirmProps = {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string, comment?: string) => void
  reasons?: string
}

type HBWorkflowConfirmFormType = {
  reason: string
  comment: string
}

export default function HBWorkflowConfirm({
  open,
  onClose,
  onConfirm,
  reasons,
}: HBWorkflowConfirmProps) {
  const { formatMessage } = useIntl()

  const formProvider = useForm<HBWorkflowConfirmFormType>({
    mode: 'all',
  })
  const { isDirty, isValid } = formProvider.formState

  const handleSubmit = (values: HBWorkflowConfirmFormType) => {
    onConfirm?.(values.reason, values.comment)
  }

  return (
    <HBDialog
      title={formatMessage(workflowMessages.workflowConfirmTitle)}
      open={open}
      onReject={onClose}
      onClose={onClose}
    >
      <Box width={500}>
        <HBForm formProviderProps={formProvider} onSubmit={(values) => {}}>
          <Stack spacing={3}>
            <HBSelectController
              required
              sx={{ width: '100%' }}
              formRules={{ required: true }}
              label={formatMessage(workflowMessages.reasonTitle)}
              name={'reason'}
              menuItem={reasons?.split('|').map((item) => ({ value: item, title: item })) || []}
            />
            <HBTextFieldController
              sx={{ width: '100%' }}
              name={'comment'}
              formRules={{ required: false }}
              label={formatMessage(workflowMessages.commentTitle)}
              multiline
              rows={4}
            />
            <Box>
              <HBButton
                disabled={!isDirty || !isValid}
                type="button"
                variant="contained"
                color="primary"
                onClick={() => {
                  formProvider.handleSubmit(handleSubmit)()
                }}
              >
                {formatMessage(workflowMessages.workflowConfirmButton)}
              </HBButton>
            </Box>
          </Stack>
        </HBForm>
      </Box>
    </HBDialog>
  )
}

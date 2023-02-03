import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetWorkflowStateMachineByStateMachineIdStateQuery } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBSelect } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { useIntl } from 'react-intl'
import { IShipmentState } from '../../enums'
export default forwardRef((props: IFilterParams, ref) => {
  const [text, setText] = useState('')
  const { formatMessage } = useIntl()

  const { data: { data: { items = [] } = {} } = {} } =
    useGetWorkflowStateMachineByStateMachineIdStateQuery({
      'client-name': '',
      'client-version': '',
      stateMachineId: String(IShipmentState.code),
    })

  useEffect(() => {
    props.filterChangedCallback()
  }, [text])

  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params: IDoesFilterPassParams) {
        if (!this.isFilterActive()) {
          return true
        }

        return params.data.stateCode === text
      },
      isFilterActive() {
        return text != null && text !== ''
      },

      getModel() {
        if (!this.isFilterActive()) {
          return null
        }

        return { filter: text, filterType: 'text', type: 'equals' }
      },

      setModel(model: any) {
        setText(model ? model.value : '')
      },
    }
  })

  const onChange = useCallback(
    (event: any) => {
      const newValue = event.target.value
      if (text !== newValue) {
        setText(newValue)
      }
    },
    [text],
  )

  return (
    <Box p={2}>
      <HBSelect
        sx={{ height: 48 }}
        value={text}
        onChange={onChange}
        fullWidth
        label={formatMessage(phrasesMessages.filtering)}
        menuItem={
          items?.map((item) => {
            return { value: item.code, title: item.title }
          }) || []
        }
      />
    </Box>
  )
})

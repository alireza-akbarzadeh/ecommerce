import { PaymentStatusEnum } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBSelect } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { useIntl } from 'react-intl'
export default forwardRef((props: IFilterParams, ref) => {
  const [text, setText] = useState('')
  const { formatMessage } = useIntl()

  const items: { title: string; value: string }[] = [
    { title: formatMessage(phrasesMessages.all), value: '' },
    { title: formatMessage(phrasesMessages.success), value: PaymentStatusEnum.Success },
    { title: formatMessage(phrasesMessages.failed), value: PaymentStatusEnum.Failed },
    { title: formatMessage(phrasesMessages.none), value: PaymentStatusEnum.None },
    { title: formatMessage(phrasesMessages.waiting), value: PaymentStatusEnum.Waiting },
    { title: formatMessage(phrasesMessages.canceled), value: PaymentStatusEnum.Canceled },
  ]

  useEffect(() => {
    props.filterChangedCallback()
  }, [text])

  useImperativeHandle(ref, () => {
    return {
      doesFilterPass(params: IDoesFilterPassParams) {
        if (!this.isFilterActive()) {
          return true
        }

        return params.data.paymentStatusId === text
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
        menuItem={items || []}
      />
    </Box>
  )
})

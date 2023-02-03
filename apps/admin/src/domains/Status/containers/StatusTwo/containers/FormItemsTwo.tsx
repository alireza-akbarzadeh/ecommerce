import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import { HBSwitchController } from '@hasty-bazar/admin-shared/containers/HBSwitchController'
import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import statusMessage from '@hasty-bazar-admin/domains/Status/status.message'
import { GetStatesQueryResult } from '@hasty-bazar/admin-shared/services/workflowApi.generated'
import { HBSelectController } from '@hasty-bazar/auth'
import { HBAutocompleteController, HBButton, HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { IconTypes } from 'libs/core/src/components/HBIcon/HBIcon.data'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Color } from '../components'
import { AddEditFormStatusTwoProps } from './AddEditFormTwo'
export default function FormItemsTwo({
  id,
  contentFormProvider,
  stateRow,
}: {
  id?: string
  contentFormProvider: UseFormReturn<AddEditFormStatusTwoProps, any>
  stateRow: GetStatesQueryResult[] | null | undefined
}) {
  const { formatMessage } = useIntl()

  const { isDirty, isValid } = contentFormProvider.formState

  const { icon } = useWatch({
    control: contentFormProvider.control,
  })

  const colorData = [
    {
      value: '#D56C0C',
      title: formatMessage(statusMessage.orangeColor),
      iconPath: <Color color="#D56C0C" />,
    },
    {
      value: '#BB2E47',
      title: formatMessage(statusMessage.redColor),
      iconPath: <Color color="#BB2E47" />,
    },
    {
      value: '#2E7D32',
      title: formatMessage(statusMessage.greenColor),
      iconPath: <Color color="#2E7D32" />,
    },
    {
      value: '#2780D2',
      title: formatMessage(statusMessage.blueColor),
      iconPath: <Color color="#2780D2" />,
    },
    {
      value: '#F9A825',
      title: formatMessage(statusMessage.yellowColor),
      iconPath: <Color color="#F9A825" />,
    },
    {
      value: '#9E9E9E',
      title: formatMessage(statusMessage.grayColor),
      iconPath: <Color color="#9E9E9E" />,
    },
  ]

  return (
    <>
      <Typography variant="body2" sx={{ mb: 8 }} component="div">
        {formatMessage(statusMessage.addStatusTwoModalDescription)}
      </Typography>
      <Grid container spacing={6} direction="row">
        <Grid item xs={12} md={6}>
          <HBTextFieldController
            autoFocus
            maskOptions={{ mask: Number, valueType: 'unmaskedValue' }}
            required
            formRules={{
              required: true,
            }}
            label={formatMessage(statusMessage.statusCode)}
            name={'code'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <HBTextFieldController
            required
            formRules={{
              required: true,
            }}
            label={formatMessage(statusMessage.statusTitle)}
            name={'title'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <HBSelectController
            formRules={{
              required: false,
            }}
            label={formatMessage(statusMessage.grid2StartStatus)}
            name={'isInitial'}
            onChange={(e) => {
              contentFormProvider.setValue('isInitial', e?.target?.value === 'true')
              contentFormProvider.setValue('isFinal', false)
            }}
            menuItem={[
              { value: 'true', title: formatMessage(phrasesMessages.yes) },
              { value: 'false', title: formatMessage(phrasesMessages.no) },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <HBSelectController
            formRules={{
              required: false,
            }}
            label={formatMessage(statusMessage.grid2FinalStatus)}
            name={'isFinal'}
            onChange={(e) => {
              contentFormProvider.setValue('isFinal', e?.target?.value === 'true')
              contentFormProvider.setValue('isInitial', false)
            }}
            menuItem={[
              { value: 'true', title: formatMessage(phrasesMessages.yes) },
              { value: 'false', title: formatMessage(phrasesMessages.no) },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <HBSelectController
            inputLabelProps={{ required: true }}
            formRules={{
              required: true,
            }}
            label={formatMessage(statusMessage.grid2Color)}
            name={'color'}
            menuItem={colorData}
            renderValue={(value) => {
              const title = colorData.find((item) => item.value === value)?.title
              return (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box width={20} height={20} borderRadius={'50%'} bgcolor={value as string} />
                  <Box sx={{ ml: 1 }}>{String(title)}</Box>
                </Stack>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {/* @ts-ignore */}
          <HBAutocompleteController<AddEditFormStatusTwoProps, string>
            label={formatMessage(statusMessage.grid2Icon)}
            autoCompleteProps={{
              renderOption: (params, option) => (
                <Box
                  component="li"
                  {...params}
                  mx={2}
                  sx={({ palette }) => ({
                    display: 'flex',
                    gap: 2,
                    borderBottom: `1px solid ${palette.grey[200]}`,
                    width: '100%',
                  })}
                >
                  <HBIcon type={option as HBIconType} size="small" />
                  {option}
                </Box>
              ),
            }}
            startAdornment={
              <HBIcon
                type={icon as HBIconType}
                size="small"
                sx={({ spacing }) => ({ padding: spacing(1.2, 0, 0, 1.2) })}
              />
            }
            fieldName="icon"
            isOptionEqualToValue={(o, v) => o == v}
            getOptionLabel={(option) => option ?? ''}
            options={IconTypes}
          />
        </Grid>

        {id && (
          <Grid item xs={12}>
            <Stack spacing={4} direction="row">
              <Typography>{formatMessage(statusMessage.statusIsActive)}</Typography>
              <HBSwitchController name="isActive" />
            </Stack>
          </Grid>
        )}
      </Grid>
      <Box mt={14} justifyContent="flex-end" display="flex" width={'100%'}>
        <HBButton type="submit" variant="contained" color="primary" disabled={!isDirty || !isValid}>
          {formatMessage(statusMessage.addStatusModalSubmit)}
        </HBButton>
      </Box>
      <Box mt={4}>
        {stateRow?.[0]?.id && (
          <HBRecordHistory data={stateRow?.[0]} isBorder isShowAccordion showInRows />
        )}
      </Box>
    </>
  )
}

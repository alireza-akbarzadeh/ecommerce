import HBTextFieldController from '@hasty-bazar/admin-shared/containers/HBTextFieldController'
import HBTinyEditorController from '@hasty-bazar/admin-shared/containers/HBTinyEditorController'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { useGetAdminCatalogProductRulesByIdQuery } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  HBButton,
  HBClassesType,
  HBDialog,
  HBIcon,
  HBSelectProps,
  HBSelectTree,
  RenderTree,
} from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import productRulesMessages from '../ProductRules.messages'
import { IProductRulesAddEditFormType } from '../ProductRulesAddEditPage'

type HBPageClassNames = 'buttonBox'
const classes: HBClassesType<HBPageClassNames> = {
  buttonBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}

interface IProductRulesAddEditFormProps {
  processDataItems: RenderTree[]
}

export type SelectBoxOptionsType = HBSelectProps['menuItem']

const ProductRulesAddEditForm = ({ processDataItems }: IProductRulesAddEditFormProps) => {
  const {
    formState: { isValid, isDirty, touchedFields },
    control,
    reset,
    setValue,
  } = useFormContext<IProductRulesAddEditFormType>()
  const { formatMessage } = useIntl()
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const [processEventNameValue, setProcessEventNameValue] = useState<string>('')
  const router = useRouter()
  const ruleId = router?.query?.id?.[0]
  const processEventName = router?.query?.processEventName
  const confirmBtnRef = useRef<HTMLButtonElement>(null)

  const { data: productRulesData, refetch } = useGetAdminCatalogProductRulesByIdQuery(
    {
      'client-name': 'ProductRulesById',
      'client-version': '0.0.1',
      id: ruleId!,
    },
    {
      skip: !ruleId,
    },
  )

  useEffect(() => {
    if (ruleId) {
      setProcessEventNameValue(productRulesData?.data?.processEventName!)
      reset({
        ...productRulesData?.data,
      })
    }
  }, [productRulesData?.data])

  useEffect(() => {
    if (!ruleId && processEventName) {
      setProcessEventNameValue(processEventName as string)
      setValue('processEventName', processEventName as string)
    }
  }, [processEventName])

  const handleGoBack = () => {
    if (isEmpty(touchedFields)) {
      router.push('/product-rules')
    } else {
      setOpenConfirmModal(true)
    }
  }

  const handleCancel = (): void => {
    setOpenConfirmModal(false)
    router.back()
  }

  const handleSave = () => {
    if (isValid) {
      confirmBtnRef.current?.click()
    }
  }

  return (
    <>
      <Grid container spacing={4} mb={5}>
        <Grid item xs={12} sm={6} md={6}>
          <Controller
            name="processEventName"
            rules={{
              required: {
                value: true,
                message: formatMessage(validationsMessages.isRequired, {
                  msg: formatMessage(productRulesMessages.process),
                }),
              },
            }}
            control={control}
            render={({ field: { onBlur, onChange } }) => {
              return (
                <HBSelectTree
                  label={formatMessage(productRulesMessages.process) + '*'}
                  value={processEventNameValue}
                  onChange={(value: string) => {
                    onChange(value)
                    setProcessEventNameValue(value)
                  }}
                  size="medium"
                  sx={{ width: '100%', height: 40, '& > label': { lineHeight: 1 } }}
                  renderValueEmptyLabel={''}
                  rootParentValue={null}
                  data={
                    processDataItems?.map((item: RenderTree) => {
                      return {
                        id: item.id!,
                        label: item.name!,
                        parentId: item.pid!,
                        value: item.id!,
                        isAllocatableToProduct: item.pid ? true : false,
                      }
                    }) || []
                  }
                  onBlur={onBlur}
                  key={processEventNameValue}
                />
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HBTextFieldController
            id="input-rule-name"
            label={formatMessage(productRulesMessages.name)}
            fullWidth
            name={'name'}
            formRules={{
              validate: (value) =>
                !!value.trim() ||
                `${formatMessage(validationsMessages.isRequired, {
                  msg: '',
                })}`,
              required: {
                value: true,
                message: `${formatMessage(validationsMessages.isRequired, {
                  msg: '',
                })}`,
              },
            }}
            autoComplete={'off'}
          />
        </Grid>
        <Grid item xs={12} id="tiny_editor_rules_grid">
          <Box sx={{ my: 1 }} id="tiny_editor_rules_box">
            <Box sx={{ my: 1 }}>
              <Typography variant="button" color="primary.main">
                {formatMessage(productRulesMessages.description)}
              </Typography>
              <Typography variant="button" color="primary.main" sx={{ px: 1, fontFamily: 'arial' }}>
                *
              </Typography>
            </Box>
            <HBTinyEditorController
              formRules={{
                required: {
                  value: true,
                  message: formatMessage(validationsMessages.isRequired),
                },
                validate: (value) => {
                  return !!value
                    .replace(/(<([^>]+)>)/gi, '')
                    .replace(/&nbsp;/g, '')
                    .trim()
                },
              }}
              name={'description'}
              id="tiny_editor_rules"
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={classes.buttonBox}>
            <HBButton
              variant="outlined"
              onClick={handleGoBack}
              startIcon={<HBIcon type="angleRight" />}
            >
              {formatMessage(phrasesMessages.back)}
            </HBButton>
            <HBButton
              variant="contained"
              type="submit"
              color="primary"
              disabled={!isValid || !isDirty}
              ref={confirmBtnRef}
              id="commissionAndReturnSubmit"
            >
              {formatMessage(phrasesMessages.confirm)}
            </HBButton>
          </Box>
        </Grid>
      </Grid>
      <HBDialog
        title={formatMessage(phrasesMessages.dialogConfirmationTitle)}
        content={formatMessage(phrasesMessages.dialogConfirmationContent)}
        onAccept={handleSave}
        onReject={handleCancel}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        acceptBtn={formatMessage(phrasesMessages.confirm)}
        rejectBtn={formatMessage(phrasesMessages.cancel)}
      />
    </>
  )
}
export default ProductRulesAddEditForm

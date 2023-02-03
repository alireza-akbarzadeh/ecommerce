import { BusinessTypeEnums } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { useGetAdminCmsMenugroupsByIdQuery } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetBusinessTypeValuesQueryResult,
  useGetAdminGeneralDataBusinessTypeValueGetAllQuery,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBButton, HBClassesType, HBDialog, HBIcon, HBSelectProps } from '@hasty-bazar/core'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { isEmpty } from 'ramda'
import { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import TitleMegaMenu from '../../components/titleMegaMenu'
import AddEditFormsItems from './add-edit-form-items'

type HBPageClassNames = 'buttonBox'
const classes: HBClassesType<HBPageClassNames> = {
  buttonBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}

type MegaMenuAddEditFormProps = {
  megaMenuId?: string
}
export type SelectBoxOptionsType = HBSelectProps['menuItem']

export const enum BusinessType {
  MenuTypeCode = BusinessTypeEnums.MenuType,
  MenuDirectionsCode = BusinessTypeEnums.MenuDirection,
  MenuDisplayTypeCode = BusinessTypeEnums.MenuDisplayType,
  PlatformTypeCode = BusinessTypeEnums.PlatformType,
}

const MegaMenuAddEditForm = (props: MegaMenuAddEditFormProps) => {
  const { megaMenuId = '' } = props
  const { formatMessage } = useIntl()
  const router = useRouter()
  const {
    formState: { isValid, isDirty, touchedFields },
    reset,
  } = useFormContext()
  const confirmBtnRef = useRef<HTMLButtonElement>(null)
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const [
    { menuTypeCodes, menuDirectionsCodes, menuDisplayTypeCodes, platformTypeCodes },
    setBusinessTypes,
  ] = useState<Record<string, SelectBoxOptionsType>>({})

  const { data: menuGroupData, refetch: refreshData } = useGetAdminCmsMenugroupsByIdQuery(
    {
      'client-name': 'megaMenuIdById',
      'client-version': '0.0.1',
      id: megaMenuId,
    },
    {
      skip: !megaMenuId,
    },
  )

  useEffect(() => {
    refreshData()
  }, [megaMenuId])

  useEffect(() => {
    reset(menuGroupData?.data)
  }, [menuGroupData])

  const getBusinessTypes = (businessTypes: GetBusinessTypeValuesQueryResult[]) => {
    const convertToSelectData = (
      data: GetBusinessTypeValuesQueryResult[],
    ): SelectBoxOptionsType => {
      return data.map((item) => ({
        title: String(item.title),
        value: item.fullCode || 0,
      }))
    }
    const menuTypeCodes = convertToSelectData(
      businessTypes.filter((item) => item.businessTypeId === BusinessType.MenuTypeCode + ''),
    )
    const menuDirectionsCodes = convertToSelectData(
      businessTypes.filter((item) => item.businessTypeId === BusinessType.MenuDirectionsCode + ''),
    )
    const menuDisplayTypeCodes = convertToSelectData(
      businessTypes.filter((item) => item.businessTypeId === BusinessType.MenuDisplayTypeCode + ''),
    )
    const platformTypeCodes = convertToSelectData(
      businessTypes.filter((item) => item.businessTypeId === BusinessType.PlatformTypeCode + ''),
    )
    setBusinessTypes({
      menuTypeCodes,
      menuDirectionsCodes,
      menuDisplayTypeCodes,
      platformTypeCodes,
    })
  }

  const { data: businessTypeData } = useGetAdminGeneralDataBusinessTypeValueGetAllQuery({
    'client-name': 'generalData',
    'client-version': '0',
    pageSize: 1000,
  })

  useEffect(() => {
    if (businessTypeData?.data?.items) {
      getBusinessTypes(businessTypeData.data.items)
    }
  }, [businessTypeData])

  const handleGoBack = () => {
    if (isEmpty(touchedFields)) {
      router.push('/mega-menu')
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
      <TitleMegaMenu stateCode={menuGroupData?.data?.stateCode!} refetch={refreshData} />
      <Grid container spacing={4} mt={3}>
        <AddEditFormsItems
          menuTypeCodes={menuTypeCodes}
          menuDirectionsCodes={menuDirectionsCodes}
          menuDisplayTypeCodes={menuDisplayTypeCodes}
          platformTypeCodes={platformTypeCodes}
        />
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

export default MegaMenuAddEditForm

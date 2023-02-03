import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import { HBMap } from '@hasty-bazar/admin-shared/containers/HBMap'
import {
  GetPartyAddressQueryResult,
  useGetAdminIdrPartiesByPartyIdAccountQuery,
  useGetAdminIdrRolesByPartyIdQuery,
  usePostAdminIdrRolesByIdAddressMutation,
  usePostAdminIdrRolesCopyAddressMutation,
  usePutAdminIdrRolesByIdAddressAndAddressIdMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import {
  useGetAdminLocalityIranByProvinceIdQuery,
  useGetAdminLocalityIranQuery,
  useGetAdminLocalityMapsGetAddressQuery,
  useGetAdminLocalityPolygonQuery,
} from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box, Grid, Stack } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import userPageMessages from '../../UserPage.messages'
import { SocialMedia } from '../details/socialMedia'
import UserContactInfo from '../UserContactInfo'
import UserAddressModalMap from './UserAddressModalMap'
import { UserContactForm } from './UserContactForm'

export type UserAddressType = GetPartyAddressQueryResult & {
  latitude?: number
  longitude?: number
  partyRoleId?: any
  provinceId?: any
  cityId?: any
}

export type UserContactsProps = {
  userId: string
}

export default function UserContacts({ userId }: UserContactsProps) {
  const formProviderProps = useForm<UserAddressType>({
    mode: 'all',
  })

  const { formatMessage } = useIntl()
  const [isAddOrEdit, setIsAddOrEdit] = useState(false)
  const [isCopyAddress, setIsCopyAddress] = useState(false)
  const [openMapDialog, setOpenMapDialog] = useState(false)
  const [prePartyRoleId, setPrePartyRoleId] = useState('')
  const [cityId, setCityId] = useState('')
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    formProviderProps.getValues('latitude') ?? 0,
    formProviderProps.getValues('longitude') ?? 0,
  ])

  const [createUserAddress] = usePostAdminIdrRolesByIdAddressMutation()
  const [updateUserAddress] = usePutAdminIdrRolesByIdAddressAndAddressIdMutation()
  const [copyUserAddress] = usePostAdminIdrRolesCopyAddressMutation()
  const userContactGridRef = useRef<any>()

  const clearForm = () => {
    formProviderProps.reset()
  }

  const { data: { data: account = {} } = {} } = useGetAdminIdrPartiesByPartyIdAccountQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      partyId: userId as string,
    },
    { skip: !userId },
  )

  const { data: userRolesData } = useGetAdminIdrRolesByPartyIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      partyId: userId,
    },
    { skip: !userId },
  )

  const userRoles = useMemo(() => {
    return (
      userRolesData?.data?.items?.map((item) => {
        return {
          value: item.id!,
          title: item.typeTitle!,
        }
      }) || []
    )
  }, [userRolesData])

  const { data: provinceList } = useGetAdminLocalityIranQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
  })

  const provinceData = useMemo(() => {
    return (
      provinceList?.data?.items?.map((item) => {
        return {
          value: item.id!,
          title: item.title!,
        }
      }) || []
    )
  }, [provinceList])

  const { data: citiesList } = useGetAdminLocalityIranByProvinceIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      provinceId: formProviderProps.getValues('provinceId')?.value!,
    },
    { skip: !formProviderProps.watch('provinceId')?.value, refetchOnMountOrArgChange: true },
  )

  const citiesData = useMemo(() => {
    return (
      citiesList?.data?.items?.map((item) => {
        return {
          value: item.id!,
          title: item.title!,
        }
      }) || []
    )
  }, [citiesList])

  const handleSaveAddress = () => {
    const addressModel = formProviderProps.getValues()
    const model = {
      title: addressModel.title,
      provinceId: addressModel.provinceId?.value,
      cityId: addressModel.cityId?.value,
      district: addressModel.district,
      streetLine: addressModel.streetLine,
      plaque: addressModel.plaque,
      unit: addressModel.unit,
      postalCode: addressModel.postalCode,
      latitude: addressModel.latitude,
      longitude: addressModel.longitude,
      isRecipient: addressModel.isRecipient!,
      recipientName: addressModel.recipientName,
      recipientMobileNo: addressModel.recipientMobileNo,
      partyRoleId: addressModel?.partyRoleId?.value,
      isDefault: addressModel.isDefault,
    }
    if (addressModel.id && !isCopyAddress) {
      updateUserAddress({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: addressModel.partyRoleId?.value!,
        addressId: addressModel.id,
        updatePartyRoleAddressesModel: {
          ...model,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          clearForm()
          openToast({
            message: formatMessage(userPageMessages.addressUpdated),
            type: 'success',
          })
          setIsAddOrEdit(false)
          userContactGridRef?.current?.afterSubmit()
        }
      })
    } else if (isCopyAddress) {
      copyUserAddress({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        addCopyAddressModel: {
          addressId: addressModel.id,
          toPartyRoleId: addressModel.partyRoleId?.value,
          fromPartyRoleId: prePartyRoleId,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          clearForm()
          openToast({
            message: formatMessage(userPageMessages.addressCopied),
            type: 'success',
          })
          setIsAddOrEdit(false)
          setIsCopyAddress(false)
          setPrePartyRoleId('')
          userContactGridRef?.current?.afterSubmit()
        }
      })
    } else {
      createUserAddress({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: addressModel.partyRoleId?.value!,
        addPartyRoleAddressesModel: {
          ...model,
        },
      }).then((res: any) => {
        if (res?.data?.success) {
          clearForm()
          setIsAddOrEdit(false)
          userContactGridRef?.current?.afterSubmit()
          openToast({
            message: formatMessage(userPageMessages.addressCreated),
            type: 'success',
          })
        }
      })
    }
  }

  const handleAddAddress = () => {
    setIsAddOrEdit(true)
  }

  const handleSetValues = (values: UserAddressType) => {
    setPrePartyRoleId(values.partyRoleId)
    setCityId(values.cityId)
    formProviderProps.reset(values)
    formProviderProps.setValue(
      'provinceId',
      provinceData?.find((item) => item.value == values.provinceId)!,
    )
    formProviderProps.setValue('cityId', citiesData?.find((item) => item.value == values.cityId)!)
    formProviderProps.setValue('district', values.district)
    formProviderProps.setValue('id', values.id)
    formProviderProps.setValue('isDefault', values.isDefault)
    formProviderProps.setValue('latitude', values.latitude)
    formProviderProps.setValue('longitude', values.longitude)
    formProviderProps.setValue('type', values.type)
    formProviderProps.setValue('plaque', values.plaque)
    formProviderProps.setValue('postalCode', values.postalCode)
    formProviderProps.setValue('isRecipient', !!values.isRecipient)
    formProviderProps.setValue('recipientMobileNo', values.recipientMobileNo)
    formProviderProps.setValue('recipientName', values.recipientName)
    formProviderProps.setValue('streetLine', values.streetLine)
    formProviderProps.setValue('title', values.title)
    formProviderProps.setValue('unit', values.unit)
    formProviderProps.setValue(
      'partyRoleId',
      userRoles?.find((item) => item.value == values.partyRoleId)!,
    )
  }

  const handleEditAddress = (address: UserAddressType) => {
    handleSetValues(address)

    if (formProviderProps.getValues('latitude')) {
      setCurrentLocation([
        formProviderProps.getValues('latitude')!,
        formProviderProps.getValues('longitude')!,
      ])
    } else {
      setCurrentLocation([0, 0])
    }
    setIsAddOrEdit(true)
  }

  const handleCancel = () => {
    clearForm()
    setIsAddOrEdit(false)
    setIsCopyAddress(false)
    setPrePartyRoleId('')
  }

  const handleChangeLocation = (location: number[]) => {
    formProviderProps.setValue('country', '')
    formProviderProps.setValue('provinceId', '')
    formProviderProps.setValue('cityId', '')
    setCurrentLocation([location[0], location[1]])
  }

  const getCenterMap = (): [number, number] | undefined => {
    if (formProviderProps.getValues('latitude') && formProviderProps.getValues('longitude')) {
      return [
        formProviderProps.getValues('latitude') ?? 0,
        formProviderProps.getValues('longitude') ?? 0,
      ]
    } else {
      return undefined
    }
  }

  const getModelMapCenter = (): [number, number] | undefined => {
    if (currentLocation[0] && currentLocation[1]) {
      return [currentLocation[0], currentLocation[1]]
    } else {
      return undefined
    }
  }
  const [firstTime, setFirstTime] = useState<boolean>(false)

  const { data: { data: { items: addressDetails = [] } = {} } = {} } =
    useGetAdminLocalityPolygonQuery(
      {
        'client-name': 'address-by-location',
        'client-version': '1.0.1.100',
        lat: currentLocation[0],
        lng: currentLocation[1],
      },

      { skip: !firstTime },
    )

  const { data: { data: { result: streetLineDetails = [] } = {} } = {} } =
    useGetAdminLocalityMapsGetAddressQuery(
      {
        'client-name': 'address-by-location',
        'client-version': '1.0.1.100',
        latitude: currentLocation[0],
        longitude: currentLocation[1],
      },
      { skip: !firstTime },
    )

  const handleChangeLocationMap = () => {
    formProviderProps.setValue('latitude', currentLocation[0])
    formProviderProps.setValue('longitude', currentLocation[1])
    setFirstTime(true)
    setOpenMapDialog(false)
  }

  const handleOpenModalMap = useCallback(() => {
    setOpenMapDialog(true)
  }, [isAddOrEdit])

  const FormMap = useCallback(
    () => (
      <HBMap
        sx={{ height: '100%' }}
        center={getCenterMap()}
        onClick={handleOpenModalMap}
        disabled={!isAddOrEdit}
        isShowMarker
      />
    ),
    [isAddOrEdit],
  )

  const handleCopyAddress = (address: UserAddressType) => {
    handleSetValues(address)
    setIsAddOrEdit(true)
    setIsCopyAddress(true)
  }

  useEffect(() => {
    if (addressDetails?.length) {
      addressDetails.map((item: any) => {
        switch (item.geoTypeValueCode) {
          case '1':
            formProviderProps.setValue('country', item.id || '')
            break
          case '2':
            formProviderProps.setValue(
              'provinceId',
              provinceData?.find((province) => province.value == item.id || '')!,
            )
            break
          case '3':
            setCityId(item.id)
            formProviderProps.setValue(
              'cityId',
              citiesData?.find((city) => city.value == item.id || '')!,
            )
            break

          default:
            break
        }
      })
    }
  }, [addressDetails])

  useEffect(() => {
    //@ts-ignore
    formProviderProps.setValue('streetLine', streetLineDetails?.formatted_Address || '')
    //@ts-ignore
  }, [streetLineDetails?.formatted_Address])

  useEffect(() => {
    formProviderProps.setValue('cityId', citiesData?.find((item) => item.value == cityId)!)
  }, [citiesData])

  return (
    <Stack spacing={2}>
      <HBExplanation
        defaultExpanded
        summary={
          <HBExplanationSummary title={formatMessage(userPageMessages.address)} icon="mapMarker" />
        }
        detail={
          <>
            <HBForm<UserAddressType>
              formProviderProps={formProviderProps}
              onSubmit={handleSaveAddress}
            >
              <UserContactInfo
                onAdd={handleAddAddress}
                onEdit={handleEditAddress}
                onCancel={handleCancel}
                onCopy={handleCopyAddress}
                ref={userContactGridRef}
              />
              <Box p={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8} md={9}>
                    <UserContactForm
                      disabled={!isAddOrEdit}
                      isCopyAddress={isCopyAddress}
                      userRoles={userRoles}
                      provinceData={provinceData}
                      citiesData={citiesData}
                      account={account}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <FormMap />
                  </Grid>
                </Grid>
              </Box>
            </HBForm>
            <UserAddressModalMap
              getModelMapCenter={() => getModelMapCenter()}
              handleChangeLocation={handleChangeLocation}
              handleChangeLocationMap={handleChangeLocationMap}
              openMapDialog={openMapDialog}
              setOpenMapDialog={setOpenMapDialog}
              isAddOrEdit={isAddOrEdit}
            />
          </>
        }
      />
      <HBExplanation
        summary={
          <HBExplanationSummary
            title={formatMessage(userPageMessages.socialMedia)}
            icon="mobileAndroid"
          />
        }
        detail={<SocialMedia userId={userId} />}
      />
    </Stack>
  )
}

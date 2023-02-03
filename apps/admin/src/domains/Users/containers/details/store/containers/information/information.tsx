import { HBExplanationSummary } from '@hasty-bazar/admin-shared/components'
import { HBExplanation } from '@hasty-bazar/admin-shared/containers/HBExplanation'
import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import { GetPagesQueryResult } from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import {
  GetVendorAddressQueryResult,
  GetVendorStoreResultApiResult,
  RoleResult,
  usePutAdminIdrVendorsByIdStoreMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import {
  useGetAdminLocalityMapsGetAddressQuery,
  useGetAdminLocalityPolygonQuery,
} from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import AddressModal from './address-modal'
import InformationFormItems from './information-form-items'

type InformationProps = {
  userId: string
  vitrinData: GetPagesQueryResult[] | null
  vendorData: GetVendorStoreResultApiResult
  isSuccessVendorData: boolean
  detailsRole: RoleResult
  addressData: GetVendorAddressQueryResult[] | null
  isSuccessAddressData: boolean
  refetchVendorData: () => void
  refetchAddress: () => void
}
type FormDataType = {
  logoPath: string
  storeName: string
  createDate: string
  vitrin: string
  shortDescription: string
  description: string
}

const Information = ({
  userId,
  vitrinData,
  vendorData,
  isSuccessVendorData,
  detailsRole,
  addressData,
  refetchVendorData,
  refetchAddress,
}: InformationProps) => {
  const { formatMessage } = useIntl()

  const formProviderProps = useForm<FormDataType>({
    mode: 'all',
  })

  const [openAddressMapDialog, setOpenAddressMapDialog] = useState(false)
  const [openAddressDetailsDialog, setOpenAddressDetailsDialog] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (isSuccessVendorData) {
      const { setValue } = formProviderProps
      setValue('storeName', vendorData?.data?.storeName || '')
      setValue('createDate', vendorData?.data?.createDate || '')
      setValue('vitrin', vendorData?.data?.vitrin || '')
      setValue('shortDescription', vendorData?.data?.shortDescription || '')
      setValue('description', vendorData?.data?.description || '')
    }
  }, [isSuccessVendorData])

  const { data: { data: { items: addressDetails = [] } = {} } = {} } =
    useGetAdminLocalityPolygonQuery(
      {
        'client-name': 'address-by-location',
        'client-version': '1.0.1.100',
        lat: currentLocation[0],
        lng: currentLocation[1],
      },
      {
        skip: !currentLocation[0],
      },
    )

  const { data: { data: { result: streetLineDetails = [] } = {} } = {} } =
    useGetAdminLocalityMapsGetAddressQuery(
      {
        'client-name': 'address-by-location',
        'client-version': '1.0.1.100',
        latitude: currentLocation[0],
        longitude: currentLocation[1],
      },
      {
        skip: !currentLocation[0],
      },
    )

  const [updateVendorStore, { reset: resetUpdate }] = usePutAdminIdrVendorsByIdStoreMutation()

  const handleSubmit = (values: FormDataType) => {
    const body = {
      ...values,
    }
    resetUpdate()
    updateVendorStore({
      'client-name': 'update-vendor-store',
      'client-version': '1.0.0',
      id: detailsRole.partyRoleId || '',
      updateStoreModel: body,
    }).then((res) => {
      //@ts-ignore
      if (res?.data?.success) {
        openToast({ message: formatMessage(validationsMessages.successUpdate), type: 'success' })
      }
      refetchVendorData()
    })
  }

  const getModelMapCenter = (): [number, number] | undefined => {
    if (currentLocation[0] && currentLocation[1]) {
      return [currentLocation[0], currentLocation[1]]
    } else {
      return undefined
    }
  }

  const handleChangeLocationMap = () => {
    setOpenAddressMapDialog(false)
    setOpenAddressDetailsDialog(true)
  }

  const handleChangeLocation = (location: number[]) => {
    setCurrentLocation([location[0], location[1]])
  }

  return (
    <HBExplanation
      defaultExpanded
      summary={
        <HBExplanationSummary
          title={formatMessage(userPageMessages.storeInfo)}
          icon="store"
          submitButton={true}
          submitButtonProps={{
            onClick: formProviderProps.handleSubmit(handleSubmit),
            form: 'information',
          }}
        />
      }
      detail={
        <>
          <HBForm id="information" formProviderProps={formProviderProps} onSubmit={handleSubmit}>
            <InformationFormItems
              userId={userId}
              vitrinData={vitrinData}
              addressData={addressData}
              setOpenAddressMapDialog={setOpenAddressMapDialog}
              detailsRole={detailsRole}
            />
          </HBForm>
          <AddressModal
            getModelMapCenter={() => getModelMapCenter()}
            handleChangeLocation={handleChangeLocation}
            handleChangeLocationMap={handleChangeLocationMap}
            openAddressMapDialog={openAddressMapDialog}
            setOpenAddressMapDialog={setOpenAddressMapDialog}
            openAddressDetailsDialog={openAddressDetailsDialog}
            setOpenAddressDetailsDialog={setOpenAddressDetailsDialog}
            currentLocation={currentLocation}
            detailsRole={detailsRole}
            addressDetails={addressDetails}
            refetchAddress={refetchAddress}
            streetLineDetails={streetLineDetails}
          />
        </>
      }
    />
  )
}
export default Information

import {
  useGetAdminLocalityIranByProvinceIdQuery,
  useGetAdminLocalityIranQuery,
} from '@hasty-bazar/admin-shared/services/localityApi.generated'
import { HBSelectController } from '@hasty-bazar/auth'
import { HBSelect, HBSelectProps } from '@hasty-bazar/core'
import { SxProps, Theme } from '@mui/material'
import { HBSelectControllerProps } from 'libs/auth/src/components/HBSelectController/HBSelectController'
import { FC, useEffect, useState } from 'react'

interface IIranLocalitySelectProps {
  type: 'simple' | 'controlled'
  controlledProps?: Omit<HBSelectControllerProps, 'menuItem'> & {
    menuItem?: Array<{ title: string; value: string | number }>
  }
  simpleProps?: HBSelectProps
  localityType: 'province' | 'city'
  provinceId?: string
  sx?: SxProps<Theme>
}

interface IMenuItemProps {
  title: string
  value: string
}

const IranLocalitySelect: FC<IIranLocalitySelectProps> = (props) => {
  const { type, controlledProps, simpleProps, localityType, provinceId, sx } = props
  const [firstTime, setFirstTime] = useState<boolean>(false)
  const { refetch: refetchProvince, data: provincesData } = useGetAdminLocalityIranQuery(
    {
      'client-name': 'get-iran-provinces',
      'client-version': '1.0.0',
    },
    { skip: firstTime },
  )

  const { refetch: refetchCity, data: citiesData } = useGetAdminLocalityIranByProvinceIdQuery(
    {
      'client-name': 'get-cities-by-province-id',
      'client-version': '1.0.0',
      provinceId: provinceId! as any,
    },
    { skip: !provinceId },
  )

  const [provinceItems, setProvinceItems] = useState<IMenuItemProps[]>([])
  const [citiesItems, setCitiesItems] = useState<IMenuItemProps[]>([])

  useEffect(() => {
    if (provincesData?.data?.items) {
      setProvinceItems(
        provincesData.data!.items!.map((value) => {
          return { title: value.title!, value: value.id!.toString() }
        }),
      )
      setFirstTime(true)
    }
  }, [provincesData])

  useEffect(() => {
    if (citiesData?.data?.items) {
      setCitiesItems(
        citiesData.data!.items!.map((value) => {
          return { title: value.title!, value: value.id!.toString() }
        }),
      )
    }
  }, [citiesData])

  useEffect(() => {
    if (provinceId && localityType === 'city') {
      refetchCity()
    }
  }, [provinceId])

  useEffect(() => {
    if (localityType === 'province') {
      refetchProvince()
    }
  }, [])

  if (type === 'simple') {
    if (localityType === 'province') {
      return <HBSelect sx={sx} {...simpleProps!} menuItem={provinceItems} />
    } else {
      return <HBSelect sx={sx} {...simpleProps!} menuItem={citiesItems} />
    }
  } else {
    if (localityType === 'province') {
      return <HBSelectController sx={sx} {...controlledProps!} menuItem={provinceItems} />
    } else {
      return <HBSelectController sx={sx} {...controlledProps!} menuItem={citiesItems} />
    }
  }
}

export default IranLocalitySelect

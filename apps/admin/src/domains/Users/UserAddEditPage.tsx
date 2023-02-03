import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import { HBRecordHistory } from '@hasty-bazar/admin-shared/containers'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetPartyQueryResult,
  UpdatePartyModel,
  useGetAdminIdrPartiesByIdQuery,
  useGetAdminIdrPartiesByIdUpdateableQuery,
  usePostAdminIdrPartiesMutation,
  usePutAdminIdrPartiesByIdMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBForm, openToast } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { UserAddEditForm, UserRoleDataGrid } from './containers'
import userPageMessages from './UserPage.messages'

export type UserAddEditFormType = GetPartyQueryResult

export type ShowTostType = {
  open: boolean
  message: string
  type?: 'error' | 'success'
}
interface UserAddEditPageProps {
  id?: string
}

const UserAddEditPage: FC<UserAddEditPageProps> = ({ id }) => {
  const router = useRouter()
  const [isEdit, setIsEdit] = useState(false)
  const { formatMessage } = useIntl()

  const formProvider = useForm<UserAddEditFormType>({ mode: 'all' })

  const { data: loadRoles, refetch: refetchChangeRole } = useGetAdminIdrPartiesByIdUpdateableQuery(
    {
      'client-name': 'HIT',
      'client-version': '1.0.0',
      id: id!,
    },
    { skip: !id },
  )

  useEffect(() => {
    setIsEdit(!!loadRoles?.data?.allowUpdate!)
  }, [loadRoles])

  const breadcrumbs = [
    {
      url: '/',
      title: formatMessage(phrasesMessages.dashboard),
    },
    {
      url: '/users',
      title: formatMessage(userPageMessages.usersTitle),
    },
    {
      url: '#',
      title: id
        ? formatMessage(userPageMessages.usersEdit)
        : formatMessage(userPageMessages.usersAdd),
    },
  ]

  const { data: usersData, refetch: refetchUsers } = useGetAdminIdrPartiesByIdQuery(
    {
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      id: id as string,
    },
    { skip: !id },
  )

  const { data: userUpdatableData, refetch: refetchUserUpdatable } =
    useGetAdminIdrPartiesByIdUpdateableQuery(
      {
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: id as string,
      },
      { skip: !id },
    )

  useEffect(() => {
    if (usersData) formProvider.reset({ ...usersData?.data })
    if (userUpdatableData) setIsEdit(!!userUpdatableData?.data?.allowUpdate)
  }, [usersData, userUpdatableData])

  const [addUser, { isLoading: isLoadingAdd }] = usePostAdminIdrPartiesMutation()
  const [updateUser, { isLoading: isLoadingUpdate }] = usePutAdminIdrPartiesByIdMutation()

  const handleSubmit = (values: UserAddEditFormType) => {
    const userModel: UpdatePartyModel = {
      firstName: values?.firstName!,
      lastName: values?.lastName!,
      isActive: values?.isActive!,
      email: values?.email!,
      mobile: values?.mobile!,
      gender: values?.gender ? +values?.gender : undefined,
      birthDate: values?.birthDate!,
      nationalCode: values?.nationalCode || null,
    }

    if (values?.id) {
      updateUser({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: String(values.id),
        updatePartyModel: userModel,
      })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            openToast({
              message: formatMessage(userPageMessages.usersSuccessUpdate),
              type: 'success',
            })
            refetchUsers()
            refetchUserUpdatable()
          }
        })
    } else {
      addUser({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        //@ts-ignore
        registerPartyModel: userModel,
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(userPageMessages.usersFailAdd),
            type: 'success',
          })
          router.replace('/users/edit/' + res?.data?.data.id)
        }
      })
    }
  }

  return (
    <>
      <BreadCrumbSection
        title={formatMessage(userPageMessages.usersTitle)}
        breadItems={breadcrumbs}
      />

      <Box
        bgcolor="common.white"
        px={8}
        pt={6}
        pb={20}
        sx={{
          borderRadius: ({ spacing }) => spacing(1),
          border: (theme) => `1px solid ${theme.palette.grey[200]}`,
          minHeight: 300,
        }}
      >
        <HBForm<UserAddEditFormType>
          onSubmit={handleSubmit}
          mode="all"
          formProviderProps={id ? formProvider : undefined}
        >
          <UserAddEditForm
            id={id || ''}
            isEdit={isEdit}
            refreshData={refetchUsers}
            usersData={usersData?.data}
            isLoading={isLoadingAdd || isLoadingUpdate}
          />
        </HBForm>
        <UserRoleDataGrid
          id={id}
          title={formatMessage(userPageMessages.usersRoleTitle)}
          changeRoles={refetchChangeRole}
        />
      </Box>
      <HBRecordHistory data={usersData?.data} isBorder isShowAccordion disabled={!id} />
    </>
  )
}
export default UserAddEditPage

import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminIdrRolesByIdSecurityRoleMutation,
  useGetAdminIdrPartiesByIdSecurityRolesAndPartyRoleIdRoleTypeQuery,
  usePostAdminIdrRolesByIdSecurityRoleMutation,
  GetSecurityRolesQueryResult,
  GetPartyAssignedSecurityRolesQueryResult,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBButton, HBCheckBox, HBClassesType, openToast } from '@hasty-bazar/core'
import { Box, FormControlLabel, List, Popover, Stack } from '@mui/material'
import { isEmpty } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

type HBPageClassNames = 'menuItem'

const classes: HBClassesType<HBPageClassNames> = {
  menuItem: ({ palette }) => ({
    borderBottom: '1px solid',
    borderColor: palette.grey[200],
  }),
}

type PopperSecurityRolesProps = {
  id?: string
  open: boolean
  anchorEl: HTMLButtonElement | null
  handleClose: () => void
  selectedValue: any
  partyId: string
}

export default function PopperSecurityRoles({
  id,
  open,
  anchorEl,
  handleClose,
  selectedValue,
  partyId,
}: PopperSecurityRolesProps) {
  const { formatMessage } = useIntl()
  const [securityRolesDataCopy, setSecurityRolesDataCopy] = useState<
    GetPartyAssignedSecurityRolesQueryResult[]
  >([])

  const {
    data: securityRoles,
    isSuccess,
    refetch,
  } = useGetAdminIdrPartiesByIdSecurityRolesAndPartyRoleIdRoleTypeQuery({
    'client-name': 'hasty-bazar-admin',
    'client-version': '1.0.0',
    id: partyId,
    partyRoleId: selectedValue.id,
    roleType: selectedValue.type,
  })

  useEffect(() => {
    if (isSuccess) {
      setSecurityRolesDataCopy(securityRoles?.data || [])
    }
  }, [isSuccess])

  const [AddSecurityRole] = usePostAdminIdrRolesByIdSecurityRoleMutation()
  const [DeleteSecurityRole] = useDeleteAdminIdrRolesByIdSecurityRoleMutation()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityRolesDataCopy((prevState) => {
      return prevState.map((item) => {
        return {
          ...item,
          hasRole: item.roleId === event.target.name ? event.target.checked : item.hasRole,
        }
      })
    })
  }

  const handleAccessControls = () => {
    let arrAdd: string[] = []
    let arrDelete: string[] = []
    securityRolesDataCopy?.map((item) => {
      const bar = securityRoles?.data?.find((apiItem: any) => apiItem.roleId === item.roleId)
      if (!isEmpty(bar)) {
        if (bar?.hasRole === item.hasRole) {
          return
        } else {
          if (item.hasRole) {
            arrAdd.push(item.roleId!)
          } else {
            arrDelete.push(item.roleId!)
          }
        }
      } else {
        return
      }
    })

    if (arrAdd.length) {
      AddSecurityRole({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: selectedValue.id,
        addSecurityRoleModel: { securityRoleIds: arrAdd },
      }).then((res) => {
        //@ts-ignore
        if (res?.data?.success) {
          openToast({ type: 'success', message: formatMessage(phrasesMessages.successUpdate) })
        }
        refetch()
        handleClose()
      })
    }
    if (arrDelete.length) {
      DeleteSecurityRole({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id: selectedValue.id,
        removeSecurityRoleModel: { securityRoleIds: arrDelete },
      }).then((res) => {
        //@ts-ignore
        if (res?.data?.success) {
          !arrAdd.length &&
            openToast({ type: 'success', message: formatMessage(phrasesMessages.successUpdate) })
        }
        refetch()
        handleClose()
      })
    }
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box sx={{ minWidth: 150, minHeight: 160 }} p={2}>
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {securityRolesDataCopy?.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={classes.menuItem}
            >
              <FormControlLabel
                control={
                  <HBCheckBox
                    checked={item.hasRole}
                    onChange={handleChange}
                    name={item.roleId}
                    id={item.roleId}
                    defaultChecked={item.hasRole}
                  />
                }
                label={item.roleTitle}
              />
            </Stack>
          ))}
        </List>
        <Box my={2}>
          <HBButton
            variant="outlined"
            type="button"
            onClick={handleClose}
            sx={({ spacing }) => ({ margin: spacing(0, 2, 0, 0) })}
          >
            {formatMessage(phrasesMessages.cancel)}
          </HBButton>
          <HBButton variant="contained" onClick={handleAccessControls}>
            {formatMessage(phrasesMessages.save)}
          </HBButton>
        </Box>
      </Box>
    </Popover>
  )
}

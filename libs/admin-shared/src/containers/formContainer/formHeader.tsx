import { HBIcon } from '@hasty-bazar/core'
import { Box, Button, List, ListItemButton, Popover, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import formContainerMessages from './formContainer.messages'
import Status from './status'

export interface FormHeaderProps {
  title: string
  statusBar?: boolean
  statusText?: string
  onChangeStatus: (status: EnumFormHeaderStatus) => void
  status: EnumFormHeaderStatus
  isEdit: boolean
}

export const enum EnumFormHeaderStatus {
  draft = 1,
  ConfirmationOfContent = 2,
  published = 3,
  disable = 4,
}

function FormHeader({
  title,
  statusBar,
  onChangeStatus,
  statusText,
  status,
  isEdit,
}: FormHeaderProps) {
  const { formatMessage } = useIntl()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const statusList = [
    {
      label: formatMessage(formContainerMessages.draft),
      value: EnumFormHeaderStatus.draft,
    },
    {
      label: formatMessage(formContainerMessages.confirmationOfContent),
      value: EnumFormHeaderStatus.ConfirmationOfContent,
    },
    {
      label: formatMessage(formContainerMessages.published),
      value: EnumFormHeaderStatus.published,
    },
    {
      label: formatMessage(formContainerMessages.disable),
      value: EnumFormHeaderStatus.disable,
    },
  ]

  const handleChangeStatus = (value: EnumFormHeaderStatus) => {
    onChangeStatus(value)
    setAnchorEl(null)
  }
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography variant="h4" mb={8} color="text.primary">
        <HBIcon type="documentInfo" />
        {title}
      </Typography>
      {statusBar && (
        <Stack spacing={4} display="flex" direction="row" justifyContent="flex-end">
          <Typography
            component="span"
            alignItems="center"
            variant="subtitle2"
            color="text.primary"
            padding={1}
          >
            {formatMessage(formContainerMessages.publishStatus)}
          </Typography>
          <Box
            borderRadius={2}
            height={24}
            px={3}
            sx={({ typography }) => ({
              fontSize: typography.caption,
            })}
            component="span"
          >
            <Status status={status} />
          </Box>
          <Button
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
              height: 25,
            }}
          >
            <Typography
              component="span"
              sx={{
                cursor: 'pointer',
              }}
              padding={1}
              variant="subtitle2"
              color="info.main"
            >
              {formatMessage(formContainerMessages.changeStatus)}
            </Typography>
          </Button>
          <Popover
            open={Boolean(anchorEl) && status !== undefined}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Box sx={{ minWidth: 150, minHeight: 160 }}>
              <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                {statusList?.map(({ label, value }, index) => (
                  <ListItemButton
                    onClick={() => handleChangeStatus(value)}
                    disabled={getDisabledStateOfStatus(value, status, isEdit)}
                  >
                    <Typography variant="subtitle2">{label}</Typography>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Popover>
        </Stack>
      )}
    </Stack>
  )
}

export default FormHeader

export function getDisabledStateOfStatus(
  value: EnumFormHeaderStatus,
  status: EnumFormHeaderStatus,
  isEdit: boolean,
) {
  if (status === value) {
    return true
  }
  if (
    status === EnumFormHeaderStatus.draft ||
    status === EnumFormHeaderStatus.ConfirmationOfContent
  ) {
    if (value === EnumFormHeaderStatus.disable) {
      return true
    }
  }

  if (status === EnumFormHeaderStatus.published) {
    if (value === EnumFormHeaderStatus.ConfirmationOfContent) {
      return true
    }
  }
  if (status === EnumFormHeaderStatus.disable) {
    if (value === EnumFormHeaderStatus.ConfirmationOfContent) {
      return true
    }
  }
  if (status === EnumFormHeaderStatus.draft && !isEdit) {
    return true
  }
  return false
}

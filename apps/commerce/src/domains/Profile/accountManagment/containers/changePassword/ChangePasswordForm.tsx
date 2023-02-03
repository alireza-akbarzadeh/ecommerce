import { GetOtpSettingApiResponse } from '@hasty-bazar-commerce/core/utils/IdsApi'
import profileMessage from '@hasty-bazar-commerce/domains/Profile/profile.messages'
import { BasketSubjectFuncs } from '@hasty-bazar-commerce/subjects/BasketSubjects'
import { HBPasswordController } from '@hasty-bazar/auth'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { IChangePasswordForm } from './ChangePasswordDialog'

interface IChangePasswordFormProps {
  isLoading: boolean
  onClose: () => void
  options?: GetOtpSettingApiResponse
}

const ChangePasswordForm: FC<IChangePasswordFormProps> = ({ isLoading, onClose, options }) => {
  const { formatMessage } = useIntl()
  const { push } = useRouter()
  const {
    formState: { isValid, errors },
  } = useFormContext<IChangePasswordForm>()

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <HBPasswordController
          {...(!!options && {
            options: {
              level: options.passwordLevel,
              maxLength: options.passwordMaxLength,
              minLength: 4,
            },
          })}
          formName="currentPassword"
          label={formatMessage(profileMessage.currentPassword)}
        />
        <Typography
          variant="caption"
          color="info.main"
          sx={{ cursor: 'pointer' }}
          onClick={() =>
            signOut({ redirect: true }).then(() => {
              BasketSubjectFuncs.signOut()
              push('/auth/signin')
            })
          }
        >
          {formatMessage(profileMessage.resetPassword)}
        </Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <HBPasswordController
          formName="newPassword"
          label={formatMessage(profileMessage.newPassword)}
          {...(!!options && {
            options: {
              level: options.passwordLevel,
              maxLength: options.passwordMaxLength,
              minLength: options.passwordMinLength,
            },
          })}
        />
        <Stack direction="row" alignItems="center" mt={1}>
          <>
            <Box color={errors.newPassword ? 'error.main' : 'grey.500'} mr={1}>
              <HBIcon type="exclamationCircle" />
            </Box>
            <Typography
              variant="caption"
              color={errors.newPassword ? 'error.main' : 'grey.500'}
              textAlign="justify"
            >
              {formatMessage(profileMessage.passwordPattern, {
                minLength: options?.passwordMinLength ?? 8,
                maxLength: options?.passwordMaxLength ?? 12,
              })}
            </Typography>
          </>
        </Stack>
      </Box>

      <Grid rowSpacing={1} container alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={6} sx={{ pr: { sm: 1, xs: 0 } }}>
          <HBButton fullWidth onClick={() => onClose()} variant="outlined" size="medium">
            {formatMessage(profileMessage.cancel)}
          </HBButton>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ pl: { sm: 1, xs: 0 } }}>
          <HBButton
            fullWidth
            loading={isLoading}
            disabled={!isValid}
            sx={{ fontSize: 14 }}
            type="submit"
          >
            {formatMessage(profileMessage.changePassword)}
          </HBButton>
        </Grid>
      </Grid>
    </>
  )
}

export default ChangePasswordForm

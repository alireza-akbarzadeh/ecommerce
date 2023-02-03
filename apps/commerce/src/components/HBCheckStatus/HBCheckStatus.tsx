import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'

export type HBCheckStatusType = 'accepted' | 'pending' | 'rejected'

const HBCheckStatus: FC<{ status: HBCheckStatusType }> = ({ status }) => {
  const [usedIcon, setUsedIcon] = useState<HBIconType | null>(null)
  const [usedColor, setUsedColor] = useState<string>('')
  const [usedText, setUsedText] = useState<string>('')

  useEffect(() => {
    switch (status) {
      case 'accepted':
        setUsedColor('success.main')
        setUsedIcon('check')
        setUsedText('تایید شده')
        break
      case 'pending':
        setUsedColor('primary.main')
        setUsedIcon('shield')
        setUsedText('درحال بررسی')
        break
      case 'rejected':
        setUsedColor('error.main')
        setUsedIcon('multiply')
        setUsedText('تایید ‌نشده')
    }
  }, [status])

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ bgcolor: usedColor, borderRadius: 6, p: 0.5 }}
      >
        {usedIcon && (
          <HBIcon
            size="small"
            type={usedIcon}
            sx={{
              color: 'common.white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}
      </Stack>
      <Typography variant="caption" color={usedColor}>
        {usedText}
      </Typography>
    </Stack>
  )
}

export default HBCheckStatus

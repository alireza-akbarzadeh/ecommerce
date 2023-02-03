import { HBIconButton } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import PopperSecurityRoles from './PopperSecurityRoles'

type GridActionAccessControlProps = {
  selectedValue: any
  partyId: string
}

export default function GridActionAccessControl({
  selectedValue,
  partyId,
}: GridActionAccessControlProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <Box>
      {selectedValue?.id && (
        <HBIconButton
          icon={'shieldCheck'}
          sx={({ palette }) => ({
            color: palette.info.main,
            background: 'unset',
            alignItems: 'baseline',
          })}
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
        />
      )}
      {open && (
        <PopperSecurityRoles
          id={id}
          selectedValue={selectedValue}
          open={open}
          anchorEl={anchorEl}
          handleClose={handleClose}
          partyId={partyId}
        />
      )}
    </Box>
  )
}

import { HBIcon, HBIconButton, HBTextField } from '@hasty-bazar/core'
import { Divider, InputAdornment, Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { useRef, useState } from 'react'

const StyledPopper = styled(Popper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  backgroundColor: theme.palette.common.white,
  border: `2px solid ${theme.palette.grey[100]}`,
}))

const DividerStyle = styled(Divider)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.grey[100]}`,
}))

const SearchRowStyle = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
}))

export default function AddressMapSearch() {
  const wrapperRef = useRef<HTMLElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [searchedText, setSearchedText] = useState<string>('')

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'github-label' : undefined

  const handleFocus = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box ref={wrapperRef}>
        <Box sx={{ bgcolor: 'common.white', borderRadius: 2 }}>
          <HBTextField
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HBIconButton
                    sx={{ border: 'none' }}
                    icon={<HBIcon type="searchAlt" />}
                  ></HBIconButton>
                </InputAdornment>
              ),
            }}
            value={searchedText}
            onChange={(event) => {
              setSearchedText(event.target.value)
            }}
            sx={{ '& fieldset': { border: 'none' } }}
            onClick={handleFocus}
          />
        </Box>
        <StyledPopper
          sx={{ width: wrapperRef.current?.clientWidth }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
        >
          <SearchRowStyle sx={{ px: 4, py: 1.5 }}>
            <Typography>رندوم ۱</Typography>
          </SearchRowStyle>
          <DividerStyle />
          <SearchRowStyle sx={{ px: 4, py: 1.5 }}>
            <Typography>رندوم ۱</Typography>
          </SearchRowStyle>
          <DividerStyle />
          <SearchRowStyle sx={{ px: 4, py: 1.5 }}>
            <Typography>رندوم ۱</Typography>
          </SearchRowStyle>
          <DividerStyle />
          <SearchRowStyle sx={{ px: 4, py: 1.5 }}>
            <Typography>رندوم ۱</Typography>
          </SearchRowStyle>
        </StyledPopper>
      </Box>
    </ClickAwayListener>
  )
}

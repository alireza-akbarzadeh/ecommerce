import { HBButton, HBIcon, HBIconButton } from '@hasty-bazar/core'
import { svgIconClasses, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Color, SketchPicker } from 'react-color'
import { Controller, RegisterOptions } from 'react-hook-form'
import rgbHex from 'rgb-hex'

export type HBFormItemColorPickerProps = {
  formName: string
  label: string
  saveButtonLabel: string
  cancelButtonLabel: string
  rules?: RegisterOptions
  disabled?: boolean
}

export default function HBFormItemColorPicker({
  formName,
  label,
  saveButtonLabel,
  cancelButtonLabel,
  rules,
  disabled,
}: HBFormItemColorPickerProps) {
  return (
    <Controller
      name={formName}
      rules={rules}
      render={({ field: { onChange, value } }) => {
        const [color, setColor] = useState<Color>(value)
        const [selectOpen, setSelectOpen] = useState<boolean>(false)
        useEffect(() => {
          setColor(value)
        }, [value, selectOpen])
        return (
          <TextField
            label={label}
            size="small"
            value={value}
            fullWidth
            select
            SelectProps={{ open: selectOpen, sx: { px: 1 } }}
            onClick={() => {
              if (!disabled) {
                setSelectOpen(true)
              }
            }}
            InputProps={{
              startAdornment: (
                <>
                  {value && (
                    <HBIcon
                      type="circle"
                      sx={{
                        borderRadius: '100%',
                        background: value,
                        color: value,
                        mx: 1,
                      }}
                    />
                  )}
                  <Typography>{value}</Typography>
                </>
              ),
              endAdornment: value && (
                <HBIconButton
                  icon={'times'}
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange('')
                  }}
                  sx={{
                    border: 'unset',
                    position: 'absolute',
                    right: 25,
                    '&:hover': {
                      background: 'unset',
                      color: 'unset',
                    },
                  }}
                />
              ),
              sx: {
                [`& .${svgIconClasses.root}`]: {
                  position: 'relative',
                  padding: 0,
                },
              },
            }}
            disabled={disabled}
          >
            <>
              <SketchPicker
                onChange={({ rgb: { r, g, b, a } }) => {
                  setColor('#' + rgbHex(r, g, b, a))
                }}
                color={color}
              />
              <HBButton
                sx={{ m: 2, minWidth: 'auto' }}
                onClick={(event) => {
                  event.stopPropagation()
                  onChange(color)
                  setSelectOpen(false)
                }}
              >
                {saveButtonLabel}
              </HBButton>
              <HBButton
                variant="text"
                color="inherit"
                sx={{ m: 2, minWidth: 'auto' }}
                onClick={(event) => {
                  event.stopPropagation()
                  setSelectOpen(false)
                }}
              >
                {cancelButtonLabel}
              </HBButton>
            </>
          </TextField>
        )
      }}
    />
  )
}

import { HBSwitch, HBTextField } from '@hasty-bazar/core'
import type { ValueEditorProps } from '@hasty-bazar/query-builder'
import { Box, Typography } from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import collectionPageMessages from '../../CollectionPage.messages'

interface SystemParameterProps extends ValueEditorProps {
  renderInput: () => React.ReactNode
}

const SystemParameter: FC<SystemParameterProps> = (props) => {
  const { formatMessage } = useIntl()
  const [showSystemParameter, setShowSystemParameter] = useState<boolean>(false)

  useEffect(() => {
    if (
      props?.fieldData?.metaData?.isParametric &&
      props.value === `[@${props?.fieldData?.metaData?.parameters[0]}]`
    ) {
      setShowSystemParameter(true)
    } else if (!props?.fieldData?.metaData?.isParametric) {
      setShowSystemParameter(false)
    }
  }, [props.value])

  return (
    <Box sx={{ display: 'inline-block' }}>
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {props?.fieldData?.metaData?.isParametric && (
          <>
            <Typography component="label" variant="body1" color="text.primary">
              {formatMessage(collectionPageMessages.systemParameter)}
            </Typography>
            <HBSwitch
              checked={showSystemParameter}
              onChange={() => {
                setShowSystemParameter((prev) => {
                  !prev && props.handleOnChange(`[@${props?.fieldData?.metaData?.parameters[0]}]`)
                  return !prev
                })
              }}
            />
          </>
        )}
        {showSystemParameter && (
          <HBTextField
            onChange={(e) => props.handleOnChange(e.target.value)}
            value={props.value}
            size="small"
            disabled
            sx={{ direction: 'rtl' }}
          />
        )}
        {!showSystemParameter && props.renderInput()}
      </Box>
    </Box>
  )
}
export default SystemParameter

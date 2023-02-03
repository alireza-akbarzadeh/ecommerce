import { Box } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { EnumTypesGrid, EnumValuesGrid } from './containers'

export default function Enums() {
  const [enumTypeId, setEnumTypeId] = useState<string | undefined | null>()

  const GridMemo = useCallback(() => <EnumValuesGrid enumTypeId={enumTypeId} />, [enumTypeId])

  return (
    <Box>
      <EnumTypesGrid onChangeEnumSelected={(id) => setEnumTypeId(id)} />
      <Box mt={4} mb={4}>
        <GridMemo />
      </Box>
    </Box>
  )
}

import { Box, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { FC } from 'react'
import { MegaMenuItemType } from '../HBMegaMenu'

interface HBMegaMenuSavedProps {
  data: MegaMenuItemType
}

const HBMegaMenuSaved: FC<HBMegaMenuSavedProps> = (props) => {
  const { data } = props

  return (
    <Box p={6} display="flex" justifyContent="space-between">
      <Stack spacing={4} sx={{ flexWrap: 'wrap', maxHeight: 350 }}>
        {data?.items?.map((item) => (
          <Link passHref href={item.link}>
            <Typography
              variant="subtitle2"
              color="text.primary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              {item.title}
            </Typography>
          </Link>
        ))}
      </Stack>
    </Box>
  )
}

export default HBMegaMenuSaved

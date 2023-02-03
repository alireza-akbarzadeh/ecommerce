import { HBChip } from '@hasty-bazar/core'
import { Box, styled } from '@mui/material'

const PREFIX_CLASSES = 'HBTreeViewFilter'

export const HBFilterListClasses = {
  root: `${PREFIX_CLASSES}-root`,
  accordion: `${PREFIX_CLASSES}-accordion`,
  accordionDetail: `${PREFIX_CLASSES}-accordionDetail`,
}

export const HBFilterRoot = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(10),

  [`& div:nth-last-child(2), div:nth-last-child(3)`]: {
    borderRadius: theme.spacing(0, 0, 2, 2),
  },
  [`& .${HBFilterListClasses.accordion}`]: {
    borderTopLeftRadius: `${theme.spacing(2)} !important`,
    borderTopRightRadius: `${theme.spacing(2)} !important`,
  },
  [`& .${HBFilterListClasses.accordionDetail}`]: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(0, 2.5, 2.5, 2.5),

    [`& .scroll`]: {
      maxHeight: 250,
      paddingRight: 10,
      overflowY: 'scroll',

      '&::-webkit-scrollbar': {
        width: theme.spacing(0.75),
      },

      '&::-webkit-scrollbar-track': {
        WebkitBoxShadow: `inset 0 0 6px ${theme.palette.grey[200]}`,
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: `${theme.palette.grey[300]}`,
        outline: `1px solid ${theme.palette.grey[300]}`,
      },
    },

    [`& div:only-child`]: {
      flex: 1,
    },
  },
}))

export const StyledHBChip = styled(HBChip)(({ theme }) => ({
  height: 32,
  maxWidth: 230,
  margin: 4,
  padding: theme.spacing(2, 4, 2, 1),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[300]}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  justifyContent: 'flex-start',

  '& span': {
    display: 'block',
    maxWidth: 185,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}))

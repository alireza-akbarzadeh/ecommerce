import { Card, cardClasses, cardContentClasses, styled } from '@mui/material'

const CardWrapper = styled(Card)(
  ({
    theme: {
      palette: { primary },
      spacing,
    },
  }) => ({
    border: `2px solid ${primary.lighter}`,
    borderRadius: spacing(2.5),
    [`& .${cardClasses.root}`]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      p: 3,
      gap: 5,
      border: `2px solid ${primary.lighter}`,
    },
    [`& .${cardContentClasses.root}`]: {
      textAlign: 'center',
      height: 332,
    },
  }),
)

export { CardWrapper }

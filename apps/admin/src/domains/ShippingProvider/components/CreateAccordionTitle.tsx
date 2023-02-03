import { styled, Typography } from '@mui/material'
import Badge, { BadgeProps } from '@mui/material/Badge'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import ShippingProviderMessages from '../shippingProvider.message'

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))

interface CreateAccordionTitleProps {
  title:
    | 'exceptionOfTheCommodityGroup'
    | 'allowedGeographicLocation'
    | 'calendarOfWorkingDaysExceptions'
  totalCount: number
}

const CreateAccordionTitle: FC<CreateAccordionTitleProps> = ({ title, totalCount }) => {
  const { formatMessage } = useIntl()
  return totalCount ? (
    <StyledBadge badgeContent={totalCount} color="primary" max={900}>
      <Typography variant="h5" pr={6}>
        {formatMessage(ShippingProviderMessages[title])}
      </Typography>
    </StyledBadge>
  ) : (
    <Typography variant="h5" pr={6}>
      {formatMessage(ShippingProviderMessages[title])}
    </Typography>
  )
}

export default CreateAccordionTitle

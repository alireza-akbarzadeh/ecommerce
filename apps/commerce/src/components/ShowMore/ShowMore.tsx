import ProductionDetailMessages from '@hasty-bazar-commerce/domains/ProductDetail/productDetail.messages'
import { HBIcon } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import HBLink from '../HBLink'

type IProps = {
  expandState: boolean
  onClickHandler: () => void
}

const ShowMore: FC<IProps> = ({ onClickHandler, expandState }) => {
  return (
    <Stack direction="row">
      <HBLink
        variant="button"
        sx={{
          color: 'info.main',
          textDecoration: 'unset',
          justifyContent: 'flex-start',
        }}
        onClick={onClickHandler}
      >
        <Stack direction="row" alignItems="center" spacing={1} color="info.main">
          <Typography variant="body2">
            {expandState ? (
              <FormattedMessage {...ProductionDetailMessages.showLess} />
            ) : (
              <FormattedMessage {...ProductionDetailMessages.showMore} />
            )}
          </Typography>
          <HBIcon type={expandState ? 'times' : 'angleLeft'} />
        </Stack>
      </HBLink>
    </Stack>
  )
}

export default ShowMore
